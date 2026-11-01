import { asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getStaffSession } from "@/lib/staff";
import { contactMessages } from "@/lib/db/schema";

export const runtime = "nodejs";

export async function GET() {
  const { session, role } = await getStaffSession();
  if (!session) return NextResponse.json({ error: "Inicie sessão para aceder à redação." }, { status: 401 });
  if (!role) return NextResponse.json({ error: "A sua conta não tem permissões editoriais." }, { status: 403 });

  const { db } = await import("@/lib/db");
  const messages = await db.select({
    id: contactMessages.id,
    name: contactMessages.name,
    email: contactMessages.email,
    subject: contactMessages.subject,
    message: contactMessages.message,
    status: contactMessages.status,
    createdAt: contactMessages.createdAt,
  }).from(contactMessages)
    .where(eq(contactMessages.status, "new"))
    .orderBy(asc(contactMessages.createdAt))
    .limit(100);
  return NextResponse.json({ messages });
}
