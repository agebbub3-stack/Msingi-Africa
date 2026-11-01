import { and, asc, eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth-session";
import { articles, comments, user } from "@/lib/db/schema";

export const runtime = "nodejs";

type Props = { params: Promise<{ articleId: string }> };
const commentSchema = z.object({
  body: z.string().trim().min(3).max(2000),
  parentId: z.uuid().optional(),
});

export async function GET(_request: NextRequest, { params }: Props) {
  const { articleId } = await params;
  if (!z.uuid().safeParse(articleId).success) return NextResponse.json({ error: "Artigo inválido." }, { status: 400 });
  const { db } = await import("@/lib/db");
  const [article] = await db.select({ id: articles.id }).from(articles)
    .where(and(eq(articles.id, articleId), eq(articles.status, "published"))).limit(1);
  if (!article) return NextResponse.json({ error: "Artigo não encontrado." }, { status: 404 });

  const rows = await db.select({
    id: comments.id,
    parentId: comments.parentId,
    body: comments.body,
    createdAt: comments.createdAt,
    author: user.name,
  }).from(comments)
    .innerJoin(user, eq(comments.authorId, user.id))
    .where(and(eq(comments.articleId, articleId), eq(comments.status, "approved")))
    .orderBy(asc(comments.createdAt))
    .limit(100);
  return NextResponse.json({ comments: rows });
}

export async function POST(request: NextRequest, { params }: Props) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Inicie sessão para comentar." }, { status: 401 });
  if (!session.user.emailVerified) return NextResponse.json({ error: "Confirme o seu e-mail antes de comentar." }, { status: 403 });
  const { articleId } = await params;
  if (!z.uuid().safeParse(articleId).success) return NextResponse.json({ error: "Artigo inválido." }, { status: 400 });

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "O comentário enviado não é válido." }, { status: 400 });
  }
  const parsed = commentSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: "Os comentários devem ter entre 3 e 2 000 caracteres." }, { status: 400 });

  const { db } = await import("@/lib/db");
  const [article] = await db.select({ id: articles.id }).from(articles)
    .where(and(eq(articles.id, articleId), eq(articles.status, "published"))).limit(1);
  if (!article) return NextResponse.json({ error: "Artigo não encontrado." }, { status: 404 });
  if (parsed.data.parentId) {
    const [parent] = await db.select({ id: comments.id }).from(comments)
      .where(and(
        eq(comments.id, parsed.data.parentId),
        eq(comments.articleId, articleId),
        eq(comments.status, "approved"),
      )).limit(1);
    if (!parent) return NextResponse.json({ error: "O comentário respondido não está disponível." }, { status: 400 });
  }

  const [created] = await db.insert(comments).values({
    articleId,
    authorId: session.user.id,
    parentId: parsed.data.parentId,
    body: parsed.data.body,
  }).returning({ id: comments.id, status: comments.status });
  return NextResponse.json({ comment: created, message: "Comentário enviado para revisão editorial." }, { status: 201 });
}
