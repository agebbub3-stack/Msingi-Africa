import { createHmac, randomUUID } from "node:crypto";
import { and, eq, gt, isNull, or } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-session";
import { payments, subscriptions } from "@/lib/db/schema";
import { getSiteUrl } from "@/lib/site-url";

export const runtime = "nodejs";

function checkoutLink(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "checkout.flutterwave.com" ? url.toString() : null;
  } catch {
    return null;
  }
}

export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Inicie sessão para ativar o Creator Plus." }, { status: 401 });
  if (!session.user.emailVerified) return NextResponse.json({ error: "Confirme o seu e-mail antes de subscrever." }, { status: 403 });

  const secret = process.env.FLW_SECRET_KEY;
  const planId = process.env.FLW_PAYMENT_PLAN_ID;
  const hasPublicOrigin = Boolean(process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL);
  if (!process.env.DATABASE_URL || !secret || !planId || !hasPublicOrigin) {
    return NextResponse.json({ error: "A assinatura ainda não está configurada. Contacte a redação." }, { status: 503 });
  }
  if (!/^\d{1,20}$/.test(planId)) {
    console.error("FLW_PAYMENT_PLAN_ID must be a numeric Flutterwave plan ID.");
    return NextResponse.json({ error: "A configuração do plano precisa de revisão." }, { status: 503 });
  }

  let origin: URL;
  try {
    origin = getSiteUrl();
  } catch {
    console.error("NEXT_PUBLIC_SITE_URL must be an absolute URL.");
    return NextResponse.json({ error: "A configuração do checkout precisa de revisão." }, { status: 503 });
  }
  if (origin.username || origin.password || (process.env.NODE_ENV === "production" && origin.protocol !== "https:")) {
    console.error("The public site URL must use HTTPS in production and must not contain credentials.");
    return NextResponse.json({ error: "A configuração do checkout precisa de revisão." }, { status: 503 });
  }

  const { db } = await import("@/lib/db");
  const [existing] = await db.select({ id: subscriptions.id, status: subscriptions.status }).from(subscriptions).where(and(
    eq(subscriptions.userId, session.user.id),
    or(
      eq(subscriptions.status, "pending"),
      and(eq(subscriptions.status, "active"), or(isNull(subscriptions.currentPeriodEnd), gt(subscriptions.currentPeriodEnd, new Date()))),
    ),
  )).limit(1);
  if (existing) {
    return NextResponse.json({
      error: existing.status === "active"
        ? "A sua assinatura Creator Plus já está ativa."
        : "Já existe um checkout pendente. Termine-o ou aguarde a confirmação antes de tentar novamente.",
    }, { status: 409 });
  }

  const timestamp = Date.now().toString(36);
  const paymentId = randomUUID();
  const txRef = `msip_${timestamp}_${paymentId}_${createHmac("sha256", secret)
    .update(`${session.user.id}:${timestamp}:${paymentId}:creator_plus:500:USD`)
    .digest("hex")}`;

  await db.transaction(async (tx) => {
    await tx.insert(subscriptions).values({
      userId: session.user.id,
      plan: "creator_plus",
      status: "pending",
      providerPlanId: planId,
      customerEmail: session.user.email,
      cancelAtPeriodEnd: false,
    }).onConflictDoUpdate({
      target: subscriptions.userId,
      set: {
        status: "pending",
        providerPlanId: planId,
        customerEmail: session.user.email,
        cancelAtPeriodEnd: false,
        updatedAt: new Date(),
      },
    });
    await tx.insert(payments).values({
      id: paymentId,
      userId: session.user.id,
      kind: "creator_plus",
      status: "pending",
      txRef,
      amountCents: 500,
      currency: "USD",
      providerPlanId: planId,
    });
  });

  let response: Response;
  try {
    response = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
      headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        tx_ref: txRef,
        amount: 5,
        currency: "USD",
        payment_plan: Number(planId),
        redirect_url: new URL("/pagamento/retorno", origin.origin).toString(),
        payment_options: "card",
        customer: { email: session.user.email, name: session.user.name },
        meta: { payment_kind: "creator_plus" },
        customizations: {
          title: "Kioo Africa",
          description: "Creator Plus — assinatura mensal",
          logo: new URL("/brand-mark.svg", origin.origin).toString(),
        },
      }),
    });
  } catch (error) {
    console.error("Flutterwave Creator Plus checkout request failed.", error);
    await db.update(payments).set({ status: "failed", updatedAt: new Date() }).where(eq(payments.txRef, txRef));
    await db.update(subscriptions).set({ status: "inactive", updatedAt: new Date() }).where(eq(subscriptions.userId, session.user.id));
    return NextResponse.json({ error: "Não foi possível contactar o serviço de pagamentos. Tente novamente." }, { status: 502 });
  }

  const responseBody: unknown = await response.json().catch((error: unknown) => {
    console.error("Flutterwave returned an unreadable subscription checkout response.", error);
    return null;
  });
  if (!response.ok || !responseBody || typeof responseBody !== "object" || !("status" in responseBody) ||
      responseBody.status !== "success" || !("data" in responseBody) || !responseBody.data ||
      typeof responseBody.data !== "object" || !("link" in responseBody.data)) {
    console.error("Flutterwave rejected the Creator Plus checkout.", { status: response.status });
    await db.update(payments).set({ status: "failed", updatedAt: new Date() }).where(eq(payments.txRef, txRef));
    await db.update(subscriptions).set({ status: "inactive", updatedAt: new Date() }).where(eq(subscriptions.userId, session.user.id));
    return NextResponse.json({ error: "O serviço de pagamentos não conseguiu iniciar a assinatura." }, { status: 502 });
  }

  const checkoutUrl = checkoutLink(responseBody.data.link);
  if (!checkoutUrl) {
    console.error("Flutterwave returned an unexpected subscription checkout URL.");
    await db.update(payments).set({ status: "failed", updatedAt: new Date() }).where(eq(payments.txRef, txRef));
    await db.update(subscriptions).set({ status: "inactive", updatedAt: new Date() }).where(eq(subscriptions.userId, session.user.id));
    return NextResponse.json({ error: "O serviço de pagamentos devolveu um endereço inválido." }, { status: 502 });
  }

  return NextResponse.json({ checkoutUrl, txRef });
}
