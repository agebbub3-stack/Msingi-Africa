import { and, asc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getStaffSession } from "@/lib/staff";
import { articles, comments, user } from "@/lib/db/schema";

export const runtime = "nodejs";

export async function GET() {
  const { session, role } = await getStaffSession();
  if (!session) return NextResponse.json({ error: "Inicie sessão para aceder à redação." }, { status: 401 });
  if (!role) return NextResponse.json({ error: "A sua conta não tem permissões editoriais." }, { status: 403 });

  const { db } = await import("@/lib/db");
  const queue = await db.select({
    id: comments.id,
    body: comments.body,
    createdAt: comments.createdAt,
    authorName: user.name,
    articleTitle: articles.title,
  }).from(comments)
    .innerJoin(user, eq(comments.authorId, user.id))
    .innerJoin(articles, eq(comments.articleId, articles.id))
    .where(and(eq(comments.status, "pending"), eq(articles.status, "published")))
    .orderBy(asc(comments.createdAt))
    .limit(100);
  return NextResponse.json({ comments: queue });
}
