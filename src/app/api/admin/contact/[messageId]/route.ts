import { and, eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getStaffSession } from "@/lib/staff";
import { contactMessages } from "@/lib/db/schema";

export const runtime = "nodejs";
type Props = { params: Promise<{ messageId: string }> };
const statusSchema = z.object({ status: z.enum(["read", "archived"]) });

export async function PATCH(request: NextRequest, { params }: Props) {
  const { session, role } = await getStaffSession();
  if (!session) return NextResponse.json({ error: "Inicie sessão para aceder à redação." }, { status: 401 });
  if (!role) return NextResponse.json({ error: "A sua conta não tem permissões editoriais." }, { status: 403 });
  const { messageId } = await params;
  if (!z.uuid().safeParse(messageId).success) return NextResponse.json({ error: "Mensagem inválida." }, { status: 400 });

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "O estado da mensagem não é válido." }, { status: 400 });
  }
  const parsed = statusSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: "Escolha um estado válido para a mensagem." }, { status: 400 });

  const { db } = await import("@/lib/db");
  const [message] = await db.update(contactMessages)
    .set({ status: parsed.data.status })
    .where(and(eq(contactMessages.id, messageId), eq(contactMessages.status, "new")))
    .returning({ id: contactMessages.id, status: contactMessages.status });
  if (!message) return NextResponse.json({ error: "Esta mensagem já foi tratada ou não existe." }, { status: 404 });
  return NextResponse.json({ message });
}
