import { createHmac, randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { getPromotionPackage, type PromotionPackageId } from "@/lib/paid-promotions";
import { sponsoredProposals } from "@/lib/db/schema";

export const runtime = "nodejs";

type CheckoutRequest = {
  packageId: string;
  name: string;
  email: string;
  title: string;
  idea: string;
};

function isCheckoutRequest(value: unknown): value is CheckoutRequest {
  if (!value || typeof value !== "object") return false;
  const request = value as Record<string, unknown>;
  return (
    typeof request.packageId === "string" &&
    typeof request.name === "string" &&
    typeof request.email === "string" &&
    typeof request.title === "string" &&
    typeof request.idea === "string"
  );
}

function createTransactionReference(packageId: PromotionPackageId, amount: number, secret: string) {
  const timestamp = Date.now().toString(36);
  const transactionId = randomUUID();
  const signature = createHmac("sha256", secret)
    .update(`${timestamp}:${transactionId}:${packageId}:${amount}:USD`)
    .digest("hex");
  return `msi_${timestamp}_${transactionId}_${packageId}_${signature}`;
}

export async function POST(request: NextRequest) {
  const secret = process.env.FLW_SECRET_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!secret || !siteUrl || !process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "O checkout ainda não está configurado. Fale com a redação para solicitar um orçamento." },
      { status: 503 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Não foi possível ler os dados da proposta." }, { status: 400 });
  }
  if (!isCheckoutRequest(payload)) {
    return NextResponse.json({ error: "Preencha os campos obrigatórios da proposta." }, { status: 400 });
  }

  const promotion = getPromotionPackage(payload.packageId);
  const name = payload.name.trim();
  const email = payload.email.trim().toLowerCase();
  const title = payload.title.trim();
  const idea = payload.idea.trim();
  if (
    !promotion ||
    name.length < 2 ||
    name.length > 100 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    email.length > 254 ||
    title.length < 3 ||
    title.length > 140 ||
    idea.length < 20 ||
    idea.length > 4000
  ) {
    return NextResponse.json({ error: "Verifique a proposta, o pacote selecionado e os seus dados." }, { status: 400 });
  }

  let appUrl: URL;
  try {
    appUrl = new URL(siteUrl);
  } catch {
    console.error("NEXT_PUBLIC_SITE_URL must be an absolute URL.");
    return NextResponse.json({ error: "A configuração do checkout precisa de revisão." }, { status: 503 });
  }
  if (
    !["http:", "https:"].includes(appUrl.protocol) ||
    (process.env.NODE_ENV === "production" && appUrl.protocol !== "https:") ||
    appUrl.username.length > 0 ||
    appUrl.password.length > 0
  ) {
    console.error("NEXT_PUBLIC_SITE_URL must use HTTPS in production and must not contain credentials.");
    return NextResponse.json({ error: "A configuração do checkout precisa de revisão." }, { status: 503 });
  }
  const callbackUrl = new URL("/pagamento/retorno", appUrl.origin);

  const txRef = createTransactionReference(promotion.id, promotion.price, secret);
  const { db } = await import("@/lib/db");
  await db.insert(sponsoredProposals).values({
    packageId: promotion.id,
    paymentRef: txRef,
    amountCents: promotion.price * 100,
    contactName: name,
    contactEmail: email,
    title,
    idea,
  });

  let providerResponse: Response;
  try {
    providerResponse = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tx_ref: txRef,
        amount: promotion.price,
        currency: "USD",
        redirect_url: callbackUrl.toString(),
        payment_options: "card",
        customer: { email, name },
        meta: { package_id: promotion.id },
        customizations: {
          title: "Bantaba Africa",
          description: `Conteúdo patrocinado — ${promotion.name}`,
          logo: new URL("/brand-mark.svg", appUrl.origin).toString(),
        },
      }),
    });
  } catch (error) {
    console.error("Flutterwave checkout request failed.", error);
    await db.update(sponsoredProposals)
      .set({ status: "payment_failed", updatedAt: new Date() })
      .where(eq(sponsoredProposals.paymentRef, txRef));
    return NextResponse.json(
      { error: "Não foi possível contactar o serviço de pagamentos. Tente novamente." },
      { status: 502 },
    );
  }

  const providerPayload: unknown = await providerResponse.json().catch((error: unknown) => {
    console.error("Flutterwave returned an unreadable checkout response.", error);
    return null;
  });
  if (
    !providerResponse.ok ||
    !providerPayload ||
    typeof providerPayload !== "object" ||
    !("status" in providerPayload) ||
    providerPayload.status !== "success" ||
    !("data" in providerPayload) ||
    !providerPayload.data ||
    typeof providerPayload.data !== "object" ||
    !("link" in providerPayload.data) ||
    typeof providerPayload.data.link !== "string"
  ) {
    console.error("Flutterwave rejected the checkout request.", { status: providerResponse.status });
    await db.update(sponsoredProposals)
      .set({ status: "payment_failed", updatedAt: new Date() })
      .where(eq(sponsoredProposals.paymentRef, txRef));
    return NextResponse.json(
      { error: "O serviço de pagamentos não conseguiu iniciar o checkout. Tente novamente ou peça um orçamento." },
      { status: 502 },
    );
  }

  let checkoutUrl: URL;
  try {
    checkoutUrl = new URL(providerPayload.data.link);
  } catch {
    console.error("Flutterwave returned an invalid checkout URL.");
    await db.update(sponsoredProposals)
      .set({ status: "payment_failed", updatedAt: new Date() })
      .where(eq(sponsoredProposals.paymentRef, txRef));
    return NextResponse.json({ error: "O serviço de pagamentos devolveu um endereço inválido." }, { status: 502 });
  }
  if (checkoutUrl.protocol !== "https:" || checkoutUrl.hostname !== "checkout.flutterwave.com") {
    console.error("Flutterwave returned an unexpected checkout hostname.", checkoutUrl.hostname);
    await db.update(sponsoredProposals)
      .set({ status: "payment_failed", updatedAt: new Date() })
      .where(eq(sponsoredProposals.paymentRef, txRef));
    return NextResponse.json({ error: "O serviço de pagamentos devolveu um endereço inválido." }, { status: 502 });
  }

  return NextResponse.json({ checkoutUrl: checkoutUrl.toString(), txRef });
}
