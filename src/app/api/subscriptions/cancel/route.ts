import { and, eq, gt } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-session";
import { findFlutterwaveSubscriptionId } from "@/lib/flutterwave";
import { subscriptions } from "@/lib/db/schema";

export const runtime = "nodejs";

export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Inicie sessão para gerir a assinatura." }, { status: 401 });

  const secret = process.env.FLW_SECRET_KEY;
  const planId = process.env.FLW_PAYMENT_PLAN_ID;
  if (!secret || !planId) return NextResponse.json({ error: "A gestão de assinaturas não está configurada." }, { status: 503 });

  const { db } = await import("@/lib/db");
  const [subscription] = await db.select().from(subscriptions).where(and(
    eq(subscriptions.userId, session.user.id),
    eq(subscriptions.status, "active"),
    gt(subscriptions.currentPeriodEnd, new Date()),
  )).limit(1);
  if (!subscription) return NextResponse.json({ error: "Não existe uma assinatura ativa para cancelar." }, { status: 404 });
  if (subscription.cancelAtPeriodEnd) {
    return NextResponse.json({ error: "A assinatura já está marcada para terminar no fim do período." }, { status: 409 });
  }
  if (subscription.providerPlanId !== planId) {
    console.error("Creator subscription has an unexpected Flutterwave plan ID.");
    return NextResponse.json({ error: "A assinatura não corresponde ao plano configurado." }, { status: 409 });
  }

  let providerId = subscription.providerSubscriptionId;
  if (!providerId) {
    try {
      providerId = await findFlutterwaveSubscriptionId(subscription.customerEmail, planId, secret);
    } catch (error) {
      console.error("Could not retrieve the Flutterwave subscription reference for cancellation.", error);
      return NextResponse.json({ error: "Não foi possível localizar a assinatura na Flutterwave. Contacte a redação." }, { status: 502 });
    }
  }
  if (!providerId) {
    return NextResponse.json({ error: "A Flutterwave ainda não disponibilizou a referência da assinatura. Tente novamente ou contacte a redação." }, { status: 409 });
  }

  let response: Response;
  try {
    response = await fetch(`https://api.flutterwave.com/v3/subscriptions/${encodeURIComponent(providerId)}/cancel`, {
      method: "PUT",
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
      headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Flutterwave subscription cancellation request failed.", error);
    return NextResponse.json({ error: "Não foi possível contactar a Flutterwave. Tente novamente." }, { status: 502 });
  }

  const payload: unknown = await response.json().catch((error: unknown) => {
    console.error("Flutterwave returned unreadable subscription cancellation JSON.", error);
    return null;
  });
  if (!response.ok || !payload || typeof payload !== "object" || !("status" in payload) || payload.status !== "success") {
    console.error("Flutterwave rejected the subscription cancellation.", { status: response.status });
    return NextResponse.json({ error: "A Flutterwave não conseguiu cancelar a renovação automática." }, { status: 502 });
  }

  await db.update(subscriptions).set({
    providerSubscriptionId: providerId,
    cancelAtPeriodEnd: true,
    canceledAt: new Date(),
    updatedAt: new Date(),
  }).where(eq(subscriptions.id, subscription.id));

  return NextResponse.json({
    canceled: true,
    currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() ?? null,
    message: "A renovação foi cancelada. O acesso continua até ao fim do período já pago.",
  });
}
