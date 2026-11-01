import { randomUUID } from "node:crypto";
import { and, desc, eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getStaffSession } from "@/lib/staff";
import { articles, articleRevisions, articleSources, moderationEvents, user } from "@/lib/db/schema";
import { slugify } from "@/lib/slug";

export const runtime = "nodejs";

const moderationSchema = z.object({
  articleId: z.uuid(),
  action: z.enum(["approve", "reject", "edit"]),
  note: z.string().trim().max(1000).optional(),
  title: z.string().trim().min(8).max(180).optional(),
  standfirst: z.string().trim().min(30).max(360).optional(),
  bodyMarkdown: z.string().trim().min(300).max(50_000).optional(),
  category: z.string().trim().min(2).max(64).optional(),
  seoTitle: z.string().trim().max(70).optional(),
  seoDescription: z.string().trim().max(180).optional(),
  seoKeywords: z.array(z.string().trim().min(2).max(60)).max(12).optional(),
});

const createArticleSchema = z.object({
  kind: z.enum(["article", "biography"]),
  title: z.string().trim().min(8).max(180),
  standfirst: z.string().trim().min(30).max(360),
  category: z.string().trim().min(2).max(64),
  bodyMarkdown: z.string().trim().min(300).max(50_000),
  coverImageUrl: z.union([
    z.literal(""),
    z.url().max(2048).refine((value) => new URL(value).protocol === "https:", "Use uma imagem HTTPS."),
  ]).optional(),
  personCountry: z.string().trim().max(100).optional(),
  personField: z.string().trim().max(100).optional(),
  personRole: z.string().trim().max(160).optional(),
  seoTitle: z.string().trim().max(70).optional(),
  seoDescription: z.string().trim().max(180).optional(),
  seoKeywords: z.array(z.string().trim().min(2).max(60)).max(12).default([]),
  sources: z.array(z.object({
    title: z.string().trim().min(2).max(180),
    publisher: z.string().trim().max(120).optional(),
    url: z.url().max(2048).refine((value) => new URL(value).protocol === "https:", "Use ligações HTTPS."),
  })).max(20).default([]),
});

function calculateReadingMinutes(markdown: string) {
  return Math.max(1, Math.ceil(markdown.trim().split(/\s+/).length / 220));
}

export async function POST(request: NextRequest) {
  const { session, role } = await getStaffSession();
  if (!session) return NextResponse.json({ error: "Inicie sessão para aceder à redação." }, { status: 401 });
  if (role !== "admin") return NextResponse.json({ error: "Só a administração pode publicar diretamente." }, { status: 403 });

  const { db } = await import("@/lib/db");
  const [account] = await db
    .select({ banned: user.banned, emailVerified: user.emailVerified })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);
  if (!account || account.banned || !account.emailVerified) {
    return NextResponse.json({ error: "Esta conta não pode publicar conteúdo editorial." }, { status: 403 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "O artigo enviado não é um JSON válido." }, { status: 400 });
  }
  const parsed = createArticleSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Revise os campos do artigo.", details: z.flattenError(parsed.error).fieldErrors }, { status: 400 });
  }
  const draft = parsed.data;
  if (draft.kind === "biography" && (!draft.personCountry || !draft.personRole)) {
    return NextResponse.json({ error: "Informe o país e o percurso da pessoa biografada." }, { status: 400 });
  }

  const articleId = randomUUID();
  const slug = `${slugify(draft.title).slice(0, 150)}-${articleId.slice(0, 8)}`;
  const publishedAt = new Date();
  const article = await db.transaction(async (tx) => {
    const [created] = await tx.insert(articles).values({
      id: articleId,
      slug,
      kind: draft.kind,
      status: "published",
      title: draft.title,
      standfirst: draft.standfirst,
      bodyMarkdown: draft.bodyMarkdown,
      category: draft.category,
      authorId: session.user.id,
      coverImageUrl: draft.coverImageUrl || null,
      readingMinutes: calculateReadingMinutes(draft.bodyMarkdown),
      personCountry: draft.kind === "biography" ? draft.personCountry : null,
      personField: draft.kind === "biography" ? draft.personField ?? draft.category : null,
      personRole: draft.kind === "biography" ? draft.personRole : null,
      seoTitle: draft.seoTitle || null,
      seoDescription: draft.seoDescription || null,
      seoKeywords: draft.seoKeywords,
      publishedAt,
      noIndex: false,
    }).returning({ id: articles.id, slug: articles.slug, kind: articles.kind, status: articles.status });

    if (draft.sources.length > 0) {
      await tx.insert(articleSources).values(draft.sources.map((source, position) => ({
        articleId: created.id,
        title: source.title,
        publisher: source.publisher || null,
        url: source.url,
        position,
      })));
    }

    await tx.insert(moderationEvents).values({
      articleId: created.id,
      moderatorId: session.user.id,
      action: "admin_create_publish",
      note: "Artigo criado e publicado diretamente pela administração.",
    });
    return created;
  });

  return NextResponse.json({ article }, { status: 201 });
}

export async function GET() {
  const { session, role } = await getStaffSession();
  if (!session) return NextResponse.json({ error: "Inicie sessão para aceder à redação." }, { status: 401 });
  if (!role) return NextResponse.json({ error: "A sua conta não tem permissões editoriais." }, { status: 403 });

  const { db } = await import("@/lib/db");
  const queue = await db
    .select({
      id: articles.id,
      slug: articles.slug,
      kind: articles.kind,
      title: articles.title,
      standfirst: articles.standfirst,
      bodyMarkdown: articles.bodyMarkdown,
      category: articles.category,
      seoTitle: articles.seoTitle,
      seoDescription: articles.seoDescription,
      seoKeywords: articles.seoKeywords,
      authorName: user.name,
      authorEmail: user.email,
      submittedWithPlan: articles.submittedWithPlan,
      createdAt: articles.createdAt,
    })
    .from(articles)
    .innerJoin(user, eq(articles.authorId, user.id))
    .where(eq(articles.status, "pending_review"))
    .orderBy(desc(articles.createdAt))
    .limit(50);

  return NextResponse.json({ articles: queue, role });
}

export async function PATCH(request: NextRequest) {
  const { session, role } = await getStaffSession();
  if (!session) return NextResponse.json({ error: "Inicie sessão para aceder à redação." }, { status: 401 });
  if (!role) return NextResponse.json({ error: "A sua conta não tem permissões editoriais." }, { status: 403 });

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "A decisão editorial não é um JSON válido." }, { status: 400 });
  }
  const parsed = moderationSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Revise a decisão editorial.", details: z.flattenError(parsed.error).fieldErrors }, { status: 400 });
  }

  const { db } = await import("@/lib/db");
  const outcome = await db.transaction(async (tx) => {
    const [article] = await tx.select().from(articles)
      .where(and(eq(articles.id, parsed.data.articleId), eq(articles.status, "pending_review")))
      .limit(1);
    if (!article) return null;

    const updatedFields = {
      ...(parsed.data.title ? { title: parsed.data.title } : {}),
      ...(parsed.data.standfirst ? { standfirst: parsed.data.standfirst } : {}),
      ...(parsed.data.bodyMarkdown ? { bodyMarkdown: parsed.data.bodyMarkdown } : {}),
      ...(parsed.data.category ? { category: parsed.data.category } : {}),
      ...(parsed.data.seoTitle !== undefined ? { seoTitle: parsed.data.seoTitle || null } : {}),
      ...(parsed.data.seoDescription !== undefined ? { seoDescription: parsed.data.seoDescription || null } : {}),
      ...(parsed.data.seoKeywords !== undefined ? { seoKeywords: parsed.data.seoKeywords } : {}),
    };

    if (parsed.data.action === "edit" && Object.keys(updatedFields).length === 0) {
      return { invalid: true as const };
    }

    if (Object.keys(updatedFields).length > 0) {
      await tx.insert(articleRevisions).values({
        articleId: article.id,
        editorId: session.user.id,
        revision: {
          title: article.title,
          standfirst: article.standfirst,
          bodyMarkdown: article.bodyMarkdown,
          category: article.category,
          seoTitle: article.seoTitle,
          seoDescription: article.seoDescription,
          seoKeywords: article.seoKeywords,
        },
        note: parsed.data.note,
      });
    }

    const nextStatus = parsed.data.action === "approve" ? "published" : parsed.data.action === "reject" ? "rejected" : "pending_review";
    await tx.update(articles).set({
      ...updatedFields,
      status: nextStatus,
      ...(nextStatus === "published" ? { publishedAt: new Date(), noIndex: false } : {}),
      updatedAt: new Date(),
    }).where(eq(articles.id, article.id));

    await tx.insert(moderationEvents).values({
      articleId: article.id,
      moderatorId: session.user.id,
      action: parsed.data.action,
      note: parsed.data.note,
    });

    return { invalid: false as const, id: article.id, status: nextStatus };
  });

  if (!outcome) return NextResponse.json({ error: "Este artigo já foi revisto ou não existe." }, { status: 404 });
  if (outcome.invalid) return NextResponse.json({ error: "Indique pelo menos um campo para editar." }, { status: 400 });
  return NextResponse.json({ article: { id: outcome.id, status: outcome.status } });
}
