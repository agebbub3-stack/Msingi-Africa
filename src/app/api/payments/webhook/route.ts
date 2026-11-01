import { createHash, timingSafeEqual } from "node:crypto";
import { and, eq, inArray } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { nextBillingDate } from "@/lib/billing";
import { findFlutterwaveSubscriptionId } from "@/lib/flutterwave";

export const runtime = "nodejs";

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function paymentPlanMatches(value: unknown, configuredPlan: string) {
  const id = isRecord(value) ? value.id : value;
  return String(id ?? "") === configuredPlan;
}

async function verifyFlutterwaveTransaction(transactionId: string, secret: string) {
  const response = await fetch(
    `https://api.flutterwave.com/v3/transactions/${encodeURIComponent(transactionId)}/verify`,
    {
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
      headers: { Authorization: `Bearer ${secret}` },
    },
  );
  const payload: unknown = await response.json().catch((error: unknown) => {
    console.error("Flutterwave webhook transaction verification returned unreadable JSON.", error);
    return null;
  });
  if (!response.ok || !isRecord(payload) || !isRecord(payload.data)) {
    throw new Error(`Flutterwave transaction verification failed with status ${response.status}.`);
  }
  return payload.data;
}

export async function POST(request: NextRequest) {
  const configuredHash = process.env.FLW_SECRET_HASH;
  const secret = process.env.FLW_SECRET_KEY;
  const planId = process.env.FLW_PAYMENT_PLAN_ID;
  const receivedHash = request.headers.get("verif-hash") ?? "";
  if (!configuredHash || !secret || !planId) {
    console.error("Flutterwave webhook secrets and payment plan must be configured.");
    return NextResponse.json({ error: "Webhook não configurado." }, { status: 503 });
  }
  if (!receivedHash || !safeEqual(receivedHash, configuredHash)) {
    return NextResponse.json({ error: "Assinatura do webhook inválida." }, { status: 401 });
  }

  const rawBody = await request.text();
  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Payload de webhook inválido." }, { status: 400 });
  }
  if (!isRecord(payload) || typeof payload.event !== "string" || !isRecord(payload.data)) {
    return NextResponse.json({ error: "Evento Flutterwave inválido." }, { status: 400 });
  }

  const eventType = payload.event;
  const eventData = payload.data;
  let verifiedPayment: JsonRecord | null = null;
  if (eventType === "charge.completed") {
    const transactionId = String(eventData.id ?? "");
    if (!/^\d{1,30}$/.test(transactionId)) {
      return NextResponse.json({ error: "Identificador de transação inválido." }, { status: 400 });
    }
    try {
      verifiedPayment = await verifyFlutterwaveTransaction(transactionId, secret);
    } catch (error) {
      console.error("Flutterwave webhook payment could not be verified.", error);
      return NextResponse.json({ error: "Não foi possível verificar a cobrança." }, { status: 502 });
    }
    if (
      verifiedPayment.status !== "successful" ||
      verifiedPayment.currency !== "USD" ||
      typeof verifiedPayment.amount !== "number" ||
      verifiedPayment.tx_ref !== eventData.tx_ref
    ) {
      console.error("Flutterwave webhook transaction details did not match the expected Msingi payment.");
      return NextResponse.json({ received: true, ignored: true });
    }
  }

  const eventHash = createHash("sha256").update(rawBody).digest("hex");
  const { db } = await import("@/lib/db");
  const { payments, sponsoredProposals, subscriptions, webhookEvents } = await import("@/lib/db/schema");
  let providerSubscriptionId: string | null = null;
  if (verifiedPayment?.amount === 5) {
    const customer = isRecord(verifiedPayment.customer) ? verifiedPayment.customer : eventData.customer;
    const email = isRecord(customer) && typeof customer.email === "string" ? customer.email : "";
    if (email) {
      try {
        providerSubscriptionId = await findFlutterwaveSubscriptionId(email, planId, secret);
      } catch (error) {
        console.error("Could not retrieve the Flutterwave subscription reference.", error);
      }
    }
  }

  try {
    const outcome = await db.transaction(async (tx) => {
      const [event] = await tx.insert(webhookEvents)
        .values({ eventHash, eventType, processedAt: new Date() })
        .onConflictDoNothing()
        .returning({ eventHash: webhookEvents.eventHash });
      if (!event) return "duplicate";

        const applyRecurringCharge = async (userId: string, transactionId: string) => {
          const [existingTransaction] = await tx.select({ id: payments.id }).from(payments)
            .where(eq(payments.providerTransactionId, transactionId)).limit(1);
          if (existingTransaction) return "duplicate";
          const [subscription] = await tx.select().from(subscriptions).where(and(
            eq(subscriptions.userId, userId),
            inArray(subscriptions.status, ["active", "past_due"]),
          )).limit(1);
          if (!subscription || subscription.providerPlanId !== planId) return "ignored";

          await tx.insert(payments).values({
            userId: subscription.userId,
            kind: "creator_plus",
            status: "successful",
            txRef: `flw_${transactionId}`,
            providerTransactionId: transactionId,
            amountCents: 500,
            currency: "USD",
            providerPlanId: planId,
          });
          const now = new Date();
          const periodStart = subscription.currentPeriodEnd && subscription.currentPeriodEnd > now
            ? subscription.currentPeriodEnd
            : now;
          await tx.update(subscriptions).set({
            status: "active",
            currentPeriodStart: periodStart,
            currentPeriodEnd: nextBillingDate(periodStart),
            ...(providerSubscriptionId ? { providerSubscriptionId } : {}),
            cancelAtPeriodEnd: false,
            updatedAt: now,
          }).where(eq(subscriptions.id, subscription.id));
          return "processed";
        };

        if (eventType === "charge.completed" && verifiedPayment) {
          const txRef = String(verifiedPayment.tx_ref);
          const [sponsoredProposal] = await tx.select().from(sponsoredProposals)
            .where(eq(sponsoredProposals.paymentRef, txRef)).limit(1);
          if (sponsoredProposal) {
            if (sponsoredProposal.amountCents !== Number(verifiedPayment.amount) * 100) return "ignored";
            const transactionId = String(verifiedPayment.id);
            const [existingTransaction] = await tx.select({ id: sponsoredProposals.id })
              .from(sponsoredProposals)
              .where(eq(sponsoredProposals.providerTransactionId, transactionId))
              .limit(1);
            if (existingTransaction && existingTransaction.id !== sponsoredProposal.id) return "duplicate";
            if (sponsoredProposal.providerTransactionId === transactionId) return "duplicate";
            if (sponsoredProposal.status !== "awaiting_payment" && sponsoredProposal.status !== "payment_failed") return "ignored";
            const [updatedProposal] = await tx.update(sponsoredProposals).set({
              status: "pending_review",
              providerTransactionId: transactionId,
              paidAt: new Date(),
              updatedAt: new Date(),
            }).where(and(
              eq(sponsoredProposals.id, sponsoredProposal.id),
              inArray(sponsoredProposals.status, ["awaiting_payment", "payment_failed"]),
            )).returning({ id: sponsoredProposals.id });
            return updatedProposal ? "processed" : "duplicate";
          }

          const [payment] = await tx.select().from(payments).where(eq(payments.txRef, txRef)).limit(1);
          if (payment?.kind === "creator_plus" && payment.providerPlanId === planId) {
            if (payment.status === "successful") {
              if (payment.providerTransactionId === String(verifiedPayment.id) && providerSubscriptionId) {
              await tx.update(subscriptions).set({
                providerSubscriptionId,
                updatedAt: new Date(),
              }).where(eq(subscriptions.userId, payment.userId));
            }
            if (payment.providerTransactionId === String(verifiedPayment.id)) return "duplicate";
            return applyRecurringCharge(payment.userId, String(verifiedPayment.id));
          }
          const [existingTransaction] = await tx.select({ id: payments.id }).from(payments)
            .where(eq(payments.providerTransactionId, String(verifiedPayment.id))).limit(1);
          if (existingTransaction && existingTransaction.id !== payment.id) return "duplicate";
          await tx.update(payments).set({
            status: "successful",
            providerTransactionId: String(verifiedPayment.id),
            updatedAt: new Date(),
          }).where(eq(payments.id, payment.id));
          const [subscription] = await tx.select().from(subscriptions).where(eq(subscriptions.userId, payment.userId)).limit(1);
          if (subscription) {
            const now = new Date();
            const periodStart = subscription.currentPeriodEnd && subscription.currentPeriodEnd > now
              ? subscription.currentPeriodEnd
              : now;
            await tx.update(subscriptions).set({
              status: "active",
              providerPlanId: planId,
              ...(providerSubscriptionId ? { providerSubscriptionId } : {}),
              currentPeriodStart: periodStart,
              currentPeriodEnd: nextBillingDate(periodStart),
              cancelAtPeriodEnd: false,
              updatedAt: now,
            }).where(eq(subscriptions.id, subscription.id));
          }
          return "processed";
        }

        const customer = isRecord(verifiedPayment.customer) ? verifiedPayment.customer : eventData.customer;
        const email = isRecord(customer) && typeof customer.email === "string" ? customer.email.toLowerCase() : "";
        if (!email) return "ignored";

        const [subscription] = await tx.select().from(subscriptions).where(and(
          eq(subscriptions.customerEmail, email),
          eq(subscriptions.providerPlanId, planId),
          inArray(subscriptions.status, ["active", "past_due"]),
        )).limit(1);
        if (!subscription) return "ignored";
        return applyRecurringCharge(subscription.userId, String(verifiedPayment.id));
      }

      if (eventType === "subscription.cancelled" || eventType === "subscription.not_renewed") {
        const customer = isRecord(eventData.customer) ? eventData.customer : null;
        const email = customer && typeof (customer.customer_email ?? customer.email) === "string"
          ? String(customer.customer_email ?? customer.email).toLowerCase()
          : "";
        const eventPlan = eventData.plan ?? eventData.payment_plan;
        if (email && paymentPlanMatches(eventPlan, planId)) {
          await tx.update(subscriptions).set({
            status: eventType === "subscription.cancelled" ? "active" : "past_due",
            ...(eventType === "subscription.cancelled" ? {
              canceledAt: new Date(),
              ...(String(eventData.id ?? "") ? { providerSubscriptionId: String(eventData.id) } : {}),
            } : {}),
            cancelAtPeriodEnd: eventType === "subscription.cancelled",
            updatedAt: new Date(),
          }).where(and(
            eq(subscriptions.customerEmail, email),
            eq(subscriptions.providerPlanId, planId),
            inArray(subscriptions.status, ["active", "past_due"]),
          ));
        }
      }

      return "processed";
    });

    return NextResponse.json({ received: true, result: outcome });
  } catch (error) {
    console.error("Flutterwave webhook processing failed.", error);
    return NextResponse.json({ error: "Não foi possível processar o evento de pagamento." }, { status: 500 });
  }
}
