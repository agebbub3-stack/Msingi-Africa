import { and, eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getStaffSession } from "@/lib/staff";
import { articles, comments, moderationEvents, userNotifications } from "@/lib/db/schema";

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
    const [comment] = await tx.select({
      id: comments.id,
      articleId: comments.articleId,
      authorId: comments.authorId,
      parentId: comments.parentId,
      articleAuthorId: articles.authorId,
    }).from(comments)
      .innerJoin(articles, eq(comments.articleId, articles.id))
      .where(and(eq(comments.id, commentId), eq(comments.status, "pending"))).limit(1);
    if (!comment) return false;
    const [updated] = await tx.update(comments).set({
      status: parsed.data.action,
      moderatedBy: session.user.id,
      moderatedAt: new Date(),
    }).where(and(eq(comments.id, commentId), eq(comments.status, "pending")))
      .returning({ id: comments.id });
    if (!updated) return false;
    await tx.insert(moderationEvents).values({
      commentId: comment.id,
      articleId: comment.articleId,
      moderatorId: session.user.id,
      action: `comment_${parsed.data.action}`,
    });
    if (parsed.data.action === "approved") {
      await tx.insert(userNotifications).values({
        userId: comment.authorId,
        articleId: comment.articleId,
        commentId: comment.id,
        kind: "comment_approved",
      });

      if (comment.parentId) {
        const [parent] = await tx.select({ authorId: comments.authorId })
          .from(comments).where(eq(comments.id, comment.parentId)).limit(1);
        if (parent && parent.authorId !== comment.authorId) {
          await tx.insert(userNotifications).values({
            userId: parent.authorId,
            actorId: comment.authorId,
            articleId: comment.articleId,
            commentId: comment.id,
            kind: "comment_reply",
          });
        }
      } else if (comment.articleAuthorId !== comment.authorId) {
        await tx.insert(userNotifications).values({
          userId: comment.articleAuthorId,
          actorId: comment.authorId,
          articleId: comment.articleId,
          commentId: comment.id,
          kind: "article_comment",
        });
      }
    } else {
      await tx.insert(userNotifications).values({
        userId: comment.authorId,
        articleId: comment.articleId,
        commentId: comment.id,
        kind: "comment_rejected",
      });
    }
    return true;
  });
  if (!result) return NextResponse.json({ error: "Este comentário já foi revisto ou não existe." }, { status: 404 });
  return NextResponse.json({ status: parsed.data.action });
}
