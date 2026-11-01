import { and, count, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth-session";
import { articleLikes, articles, user, userNotifications } from "@/lib/db/schema";

export const runtime = "nodejs";
type Props = { params: Promise<{ articleId: string }> };

export async function GET(_request: Request, { params }: Props) {
  const { articleId } = await params;
  if (!z.uuid().safeParse(articleId).success) return NextResponse.json({ error: "Artigo inválido." }, { status: 400 });
  const { db } = await import("@/lib/db");
  const [article] = await db.select({ id: articles.id }).from(articles)
    .where(and(eq(articles.id, articleId), eq(articles.status, "published"))).limit(1);
  if (!article) return NextResponse.json({ error: "Artigo não encontrado." }, { status: 404 });
  const [result] = await db.select({ count: count() }).from(articleLikes).where(eq(articleLikes.articleId, articleId));
  const { getSession } = await import("@/lib/auth-session");
  const session = await getSession();
  const [reaction] = session ? await db.select({ articleId: articleLikes.articleId }).from(articleLikes)
    .where(and(eq(articleLikes.articleId, articleId), eq(articleLikes.userId, session.user.id))).limit(1) : [];
  return NextResponse.json({ count: result.count, liked: Boolean(reaction) });
}

export async function POST(_request: Request, { params }: Props) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Inicie sessão para gostar deste artigo." }, { status: 401 });
  const { articleId } = await params;
  if (!z.uuid().safeParse(articleId).success) return NextResponse.json({ error: "Artigo inválido." }, { status: 400 });

  const { db } = await import("@/lib/db");
  const [account] = await db.select({ banned: user.banned }).from(user)
    .where(eq(user.id, session.user.id)).limit(1);
  if (!account || account.banned) return NextResponse.json({ error: "Esta conta não pode reagir." }, { status: 403 });
  const [article] = await db.select({ id: articles.id, authorId: articles.authorId }).from(articles)
    .where(and(eq(articles.id, articleId), eq(articles.status, "published"))).limit(1);
  if (!article) return NextResponse.json({ error: "Artigo não encontrado." }, { status: 404 });

  const result = await db.transaction(async (tx) => {
    const [inserted] = await tx.insert(articleLikes)
      .values({ articleId, userId: session.user.id })
      .onConflictDoNothing()
      .returning({ articleId: articleLikes.articleId });
    const liked = Boolean(inserted);
    if (liked) {
      if (article.authorId !== session.user.id) {
        await tx.insert(userNotifications).values({
          userId: article.authorId,
          actorId: session.user.id,
          articleId,
          kind: "article_like",
        }).onConflictDoNothing();
      }
    } else {
      await tx.delete(articleLikes).where(and(
        eq(articleLikes.articleId, articleId),
        eq(articleLikes.userId, session.user.id),
      ));
    }

    const [reactionCount] = await tx.select({ count: count() }).from(articleLikes)
      .where(eq(articleLikes.articleId, articleId));
    return { liked, count: reactionCount.count };
  });
  return NextResponse.json(result);
}
