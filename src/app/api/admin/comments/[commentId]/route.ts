import { and, eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getStaffSession } from "@/lib/staff";
import { comments, moderationEvents } from "@/lib/db/schema";

export const runtime = "nodejs";
type Props = { params: Promise<{ commentId: string }> };
const decisionSchema = z.object({ action: z.enum(["approved", "rejected"]) });

export async function PATCH(request: NextRequest, { params }: Props) {
  const { session, role } = await getStaffSession();
  if (!session) return NextResponse.json({ error: "Inicie sessão para aceder à redação." }, { status: 401 });
  if (!role) return NextResponse.json({ error: "A sua conta não tem permissões editoriais." }, { status: 403 });

  const { commentId } = await params;
  if (!z.uuid().safeParse(commentId).success) return NextResponse.json({ error: "Comentário inválido." }, { status: 400 });
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "A decisão de moderação não é válida." }, { status: 400 });
  }
  const parsed = decisionSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: "Escolha aprovar ou rejeitar o comentário." }, { status: 400 });

  const { db } = await import("@/lib/db");
  const result = await db.transaction(async (tx) => {
    const [comment] = await tx.select({ id: comments.id, articleId: comments.articleId })
      .from(comments).where(and(eq(comments.id, commentId), eq(comments.status, "pending"))).limit(1);
    if (!comment) return false;
    await tx.update(comments).set({
      status: parsed.data.action,
      moderatedBy: session.user.id,
      moderatedAt: new Date(),
    }).where(eq(comments.id, commentId));
    await tx.insert(moderationEvents).values({
      commentId: comment.id,
      articleId: comment.articleId,
      moderatorId: session.user.id,
      action: `comment_${parsed.data.action}`,
    });
    return true;
  });
  if (!result) return NextResponse.json({ error: "Este comentário já foi revisto ou não existe." }, { status: 404 });
  return NextResponse.json({ status: parsed.data.action });
}
