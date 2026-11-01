import { createHmac, timingSafeEqual } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { nextBillingDate } from "@/lib/billing";
import { findFlutterwaveSubscriptionId } from "@/lib/flutterwave";
import { getPromotionPackage } from "@/lib/paid-promotions";

export const runtime = "nodejs";

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function getSignedPackage(txRef: string, secret: string) {
  const parts = txRef.split("_");
  if (parts.length !== 5 || parts[0] !== "msi") return null;
  const [, timestamp, transactionId, packageId, signature] = parts;
  const promotion = getPromotionPackage(packageId);
  if (!promotion || !/^[a-z0-9]+$/i.test(timestamp) || !/^[\da-f-]{36}$/i.test(transactionId) || !/^[\da-f]{64}$/i.test(signature)) return null;

  const timestampValue = Number.parseInt(timestamp, 36);
  const age = Date.now() - timestampValue;
  if (!Number.isSafeInteger(timestampValue) || age < -5 * 60 * 1000 || age > 30 * 24 * 60 * 60 * 1000) return null;

  const expected = createHmac("sha256", secret)
    .update(`${timestamp}:${transactionId}:${promotion.id}:${promotion.price}:USD`)
    .digest();
  const received = Buffer.from(signature, "hex");
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) return null;
  return promotion;
}

async function fetchVerifiedTransaction(transactionId: string, secret: string) {
  let response: Response;
  try {
    response = await fetch(
      `https://api.flutterwave.com/v3/transactions/${encodeURIComponent(transactionId)}/verify`,
      {
        cache: "no-store",
        signal: AbortSignal.timeout(15_000),
        headers: { Authorization: `Bearer ${secret}` },
      },
    );
  } catch (error) {
    console.error("Flutterwave payment verification request failed.", error);
    return { error: "Não foi possível confirmar o pagamento. Atualize esta página dentro de alguns instantes.", status: 502 } as const;
  }

  const payload: unknown = await response.json().catch((error: unknown) => {
    console.error("Flutterwave returned an unreadable verification response.", error);
    return null;
  });
  if (!response.ok || !isRecord(payload) || !isRecord(payload.data)) {
    console.error("Flutterwave could not verify the transaction.", { status: response.status });
    return { error: "O serviço de pagamentos não conseguiu confirmar esta transação.", status: 502 } as const;
  }
  return { data: payload.data } as const;
}

async function verifyCreatorSubscription(transactionId: string, txRef: string, secret: string) {
  const { getSession } = await import("@/lib/auth-session");
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Inicie sessão na conta que iniciou esta assinatura." }, { status: 401 });

  const { db } = await import("@/lib/db");
  const { payments, subscriptions } = await import("@/lib/db/schema");
  const [payment] = await db.select().from(payments).where(and(
    eq(payments.txRef, txRef),
    eq(payments.userId, session.user.id),
  )).limit(1);
  if (!payment || payment.kind !== "creator_plus") {
    return NextResponse.json({ error: "Esta referência não corresponde à sua assinatura." }, { status: 404 });
  }
  if (!process.env.FLW_PAYMENT_PLAN_ID || payment.providerPlanId !== process.env.FLW_PAYMENT_PLAN_ID) {
    return NextResponse.json({ error: "A assinatura não corresponde ao plano atualmente configurado." }, { status: 409 });
  }

  const verification = await fetchVerifiedTransaction(transactionId, secret);
  if ("error" in verification) return NextResponse.json({ error: verification.error }, { status: verification.status });
  const data = verification.data;
  if (data.status !== "successful") {
    return NextResponse.json({ status: "pending", message: "O pagamento ainda não foi confirmado." });
  }
  if (
    data.tx_ref !== txRef ||
    data.currency !== "USD" ||
    typeof data.amount !== "number" ||
    data.amount !== payment.amountCents / 100
  ) {
    console.error("Flutterwave subscription transaction did not match the Bantaba payment.");
    return NextResponse.json({ error: "Os detalhes do pagamento não correspondem à assinatura." }, { status: 400 });
  }

  let providerSubscriptionId: string | null = null;
  if (process.env.FLW_PAYMENT_PLAN_ID) {
    try {
      providerSubscriptionId = await findFlutterwaveSubscriptionId(
        session.user.email,
        process.env.FLW_PAYMENT_PLAN_ID,
        secret,
      );
    } catch (error) {
      console.error("Could not retrieve the Flutterwave subscription reference.", error);
    }
  }

  await db.transaction(async (tx) => {
    const [currentPayment] = await tx.select().from(payments).where(eq(payments.id, payment.id)).limit(1);
    if (!currentPayment) throw new Error("The confirmed Creator Plus payment disappeared.");
    const transactionIdValue = String(data.id ?? transactionId);
    if (currentPayment.status === "successful" && currentPayment.providerTransactionId === transactionIdValue) {
      if (providerSubscriptionId) {
        await tx.update(subscriptions).set({ providerSubscriptionId, updatedAt: new Date() })
          .where(eq(subscriptions.userId, session.user.id));
      }
      return;
    }

    const [duplicateTransaction] = await tx.select({ id: payments.id }).from(payments)
      .where(eq(payments.providerTransactionId, transactionIdValue)).limit(1);
    if (duplicateTransaction && duplicateTransaction.id !== currentPayment.id) return;

    if (currentPayment.status === "successful") {
      await tx.insert(payments).values({
        userId: session.user.id,
        kind: "creator_plus",
        status: "successful",
        txRef: `flw_${transactionIdValue}`,
        providerTransactionId: transactionIdValue,
        amountCents: currentPayment.amountCents,
        currency: "USD",
        providerPlanId: currentPayment.providerPlanId,
      });
    } else {
      await tx.update(payments).set({
        status: "successful",
        providerTransactionId: transactionIdValue,
        updatedAt: new Date(),
      }).where(eq(payments.id, currentPayment.id));
    }

    const [subscription] = await tx.select().from(subscriptions).where(eq(subscriptions.userId, session.user.id)).limit(1);
    if (!subscription) throw new Error("The Creator Plus subscription record was not found.");
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
      canceledAt: null,
      updatedAt: now,
    }).where(eq(subscriptions.id, subscription.id));
  });

  return NextResponse.json({
    status: "successful",
    planName: "Creator Plus",
    subscription: true,
    amount: payment.amountCents / 100,
    currency: "USD",
    transactionId,
  });
}

export async function GET(request: NextRequest) {
  const secret = process.env.FLW_SECRET_KEY;
  const transactionId = request.nextUrl.searchParams.get("transaction_id") ?? "";
  const txRef = request.nextUrl.searchParams.get("tx_ref") ?? "";
  if (!secret) {
    return NextResponse.json({ error: "A confirmação de pagamentos ainda não está configurada." }, { status: 503 });
  }
  if (!/^\d{1,30}$/.test(transactionId) || txRef.length > 240) {
    return NextResponse.json({ error: "Não foi possível validar esta referência de pagamento." }, { status: 400 });
  }

  if (txRef.startsWith("msip_")) {
    return verifyCreatorSubscription(transactionId, txRef, secret);
  }

  const promotion = getSignedPackage(txRef, secret);
  if (!promotion) {
    return NextResponse.json({ error: "Esta referência não corresponde a um pedido válido." }, { status: 400 });
  }

  const verification = await fetchVerifiedTransaction(transactionId, secret);
  if ("error" in verification) return NextResponse.json({ error: verification.error }, { status: verification.status });
  const data = verification.data;
  if (data.status !== "successful") {
    return NextResponse.json({ status: "pending", message: "O pagamento ainda não foi confirmado." });
  }
  if (
    data.tx_ref !== txRef ||
    data.currency !== "USD" ||
    typeof data.amount !== "number" ||
    data.amount !== promotion.price
  ) {
    console.error("Flutterwave transaction details do not match the signed Bantaba order.", transactionId);
    return NextResponse.json({ error: "Os detalhes do pagamento não correspondem ao pedido." }, { status: 400 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "O registo da proposta patrocinada não está configurado." }, { status: 503 });
  }
  const { db } = await import("@/lib/db");
  const { sponsoredProposals } = await import("@/lib/db/schema");
  const proposalStatus = await db.transaction(async (tx) => {
    const [proposal] = await tx.select().from(sponsoredProposals)
      .where(eq(sponsoredProposals.paymentRef, txRef)).limit(1);
    if (!proposal) return "missing";
    if (proposal.packageId !== promotion.id || proposal.amountCents !== promotion.price * 100) return "mismatch";
    const verifiedTransactionId = String(data.id ?? transactionId);
    if (proposal.status !== "awaiting_payment" && proposal.status !== "payment_failed") {
      return proposal.providerTransactionId === verifiedTransactionId ? proposal.status : "already_paid";
    }

    await tx.update(sponsoredProposals).set({
      status: "pending_review",
      providerTransactionId: verifiedTransactionId,
      paidAt: new Date(),
      updatedAt: new Date(),
    }).where(eq(sponsoredProposals.id, proposal.id));
    return "pending_review";
  });
  if (proposalStatus === "missing") return NextResponse.json({ error: "A proposta associada a este pagamento não foi encontrada." }, { status: 404 });
  if (proposalStatus === "mismatch") return NextResponse.json({ error: "O valor do pagamento não corresponde à proposta." }, { status: 400 });
  if (proposalStatus === "already_paid") return NextResponse.json({ error: "Esta proposta já está associada a outra transação." }, { status: 409 });

  return NextResponse.json({
    status: "successful",
    packageName: promotion.name,
    amount: promotion.price,
    currency: "USD",
    transactionId,
    proposalStatus,
  });
}
