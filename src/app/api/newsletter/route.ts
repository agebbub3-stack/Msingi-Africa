import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { newsletterSubscribers } from "@/lib/db/schema";

export const runtime = "nodejs";
const signupSchema = z.object({
  email: z.email().max(254).trim().toLowerCase(),
  consent: z.literal(true),
});

export async function POST(request: NextRequest) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Os dados da inscrição são inválidos." }, { status: 400 });
  }
  const parsed = signupSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: "Informe um e-mail válido e confirme a inscrição." }, { status: 400 });

  const { db } = await import("@/lib/db");
  await db.insert(newsletterSubscribers).values({
    email: parsed.data.email,
    consentedAt: new Date(),
  }).onConflictDoUpdate({
    target: newsletterSubscribers.email,
    set: { consentedAt: new Date(), unsubscribedAt: null },
  });
  return NextResponse.json({ message: "Inscrição registada. Obrigado por acompanhar a Bantaba." }, { status: 201 });
}
