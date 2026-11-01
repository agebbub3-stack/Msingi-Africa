import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { contactMessages } from "@/lib/db/schema";

export const runtime = "nodejs";
const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().max(254).trim().toLowerCase(),
  subject: z.string().trim().min(3).max(140),
  message: z.string().trim().min(20).max(4000),
  website: z.string().max(500).optional(),
});

export async function POST(request: NextRequest) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "A mensagem enviada não é válida." }, { status: 400 });
  }
  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: "Revise os campos da mensagem." }, { status: 400 });
  if (parsed.data.website) {
    return NextResponse.json({ message: "Mensagem recebida. A redação responderá assim que possível." }, { status: 201 });
  }

  const { db } = await import("@/lib/db");
  await db.insert(contactMessages).values({
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject,
    message: parsed.data.message,
  });
  return NextResponse.json({ message: "Mensagem recebida. A redação responderá assim que possível." }, { status: 201 });
}
