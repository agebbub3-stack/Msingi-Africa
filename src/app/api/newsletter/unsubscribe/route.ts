import { createHmac, timingSafeEqual } from "node:crypto";
import { and, eq, isNull, lt, or } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { newsletterSubscribers } from "@/lib/db/schema";
import { sendTransactionalEmail } from "@/lib/email";

export const runtime = "nodejs";
const emailSchema = z.email().max(254).trim().toLowerCase();

function createToken(email: string, secret: string) {
  return createHmac("sha256", secret).update(`newsletter-unsubscribe:${email}`).digest("hex");
}

function validToken(email: string, token: string, secret: string) {
  if (!/^[\da-f]{64}$/i.test(token)) return false;
  const expected = Buffer.from(createToken(email, secret), "hex");
  const received = Buffer.from(token, "hex");
  return expected.length === received.length && timingSafeEqual(expected, received);
}

export async function POST(request: NextRequest) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "O endereço de e-mail não é válido." }, { status: 400 });
  }
  const parsed = emailSchema.safeParse(isRecord(payload) ? payload.email : undefined);
  if (!parsed.success) return NextResponse.json({ error: "Informe um e-mail válido." }, { status: 400 });

  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret || secret.length < 32) return NextResponse.json({ error: "O serviço de cancelamento não está configurado." }, { status: 503 });
  const { db } = await import("@/lib/db");
  const requestedAt = new Date();
  const [subscriber] = await db.update(newsletterSubscribers)
    .set({ unsubscribeEmailSentAt: requestedAt })
    .where(and(
      eq(newsletterSubscribers.email, parsed.data),
      isNull(newsletterSubscribers.unsubscribedAt),
      or(
        isNull(newsletterSubscribers.unsubscribeEmailSentAt),
        lt(newsletterSubscribers.unsubscribeEmailSentAt, new Date(requestedAt.getTime() - 60 * 60 * 1000)),
      ),
    ))
    .returning({ email: newsletterSubscribers.email });
  if (subscriber) {
    const token = createToken(subscriber.email, secret);
    const unsubscribeUrl = new URL("/api/newsletter/unsubscribe", request.nextUrl.origin);
    unsubscribeUrl.searchParams.set("email", subscriber.email);
    unsubscribeUrl.searchParams.set("token", token);
    try {
      await sendTransactionalEmail({
        to: subscriber.email,
        subject: "Cancelar a newsletter Bantaba Africa",
        html: `<p>Use esta ligação para cancelar a inscrição na newsletter Bantaba Africa:</p><p><a href="${unsubscribeUrl.toString()}">Cancelar inscrição</a></p><p>Se não pediu este cancelamento, ignore esta mensagem.</p>`,
      });
    } catch (error) {
      const [reset] = await db.update(newsletterSubscribers)
        .set({ unsubscribeEmailSentAt: null })
        .where(and(
          eq(newsletterSubscribers.email, subscriber.email),
          eq(newsletterSubscribers.unsubscribeEmailSentAt, requestedAt),
        ))
        .returning({ email: newsletterSubscribers.email });
      if (!reset) console.error("Could not reset the newsletter cancellation email throttle.");
      throw error;
    }
  }
  return NextResponse.json({ message: "Se o endereço estiver inscrito, receberá uma ligação para cancelar a newsletter." });
}

export async function GET(request: NextRequest) {
  const email = emailSchema.safeParse(request.nextUrl.searchParams.get("email"));
  const token = request.nextUrl.searchParams.get("token") ?? "";
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!email.success || !secret || !validToken(email.data, token, secret)) {
    return NextResponse.redirect(new URL("/newsletter/cancelada?status=invalid", request.nextUrl.origin));
  }

  const { db } = await import("@/lib/db");
  await db.update(newsletterSubscribers).set({ unsubscribedAt: new Date() })
    .where(and(isNull(newsletterSubscribers.unsubscribedAt), eq(newsletterSubscribers.email, email.data)));
  return NextResponse.redirect(new URL("/newsletter/cancelada?status=success", request.nextUrl.origin));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
