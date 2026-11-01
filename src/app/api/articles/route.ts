import { randomUUID } from "node:crypto";
import { and, eq, gt, isNull, or } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth-session";
import { articles, articleSources, subscriptions, user } from "@/lib/db/schema";
import { slugify } from "@/lib/slug";

export const runtime = "nodejs";

const sourceSchema = z.object({
  title: z.string().trim().min(2).max(180),
  publisher: z.string().trim().max(120).optional(),
  url: z.url().max(2048).refine((value) => new URL(value).protocol === "https:", "Use ligações HTTPS."),
});

const submissionSchema = z.object({
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
  sources: z.array(sourceSchema).max(20).default([]),
});

function calculateReadingMinutes(markdown: string) {
  const words = markdown.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 220));
}

function containsExternalLink(markdown: string) {
  return /(?:https?:\/\/|www\.)|]\([^)]*\)|<a(?:\s|>)/i.test(markdown);
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Inicie sessão para ver as suas propostas." }, { status: 401 });

  const { db } = await import("@/lib/db");
  const rows = await db
    .select({
      id: articles.id,
      slug: articles.slug,
      kind: articles.kind,
      status: articles.status,
      title: articles.title,
      standfirst: articles.standfirst,
      category: articles.category,
      updatedAt: articles.updatedAt,
      createdAt: articles.createdAt,
    })
    .from(articles)
    .where(eq(articles.authorId, session.user.id))
    .orderBy(articles.updatedAt);

  return NextResponse.json({ articles: rows });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Inicie sessão para submeter um artigo." }, { status: 401 });
  if (!session.user.emailVerified) {
    return NextResponse.json({ error: "Confirme o seu endereço de e-mail antes de submeter conteúdo." }, { status: 403 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "O conteúdo enviado não é um JSON válido." }, { status: 400 });
  }
  const parsed = submissionSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Revise os campos do artigo.", details: z.flattenError(parsed.error).fieldErrors }, { status: 400 });
  }

  const submission = parsed.data;
  if (submission.kind === "biography" && (!submission.personCountry || !submission.personRole)) {
    return NextResponse.json({ error: "Informe o país e o percurso da pessoa biografada." }, { status: 400 });
  }

  const { db } = await import("@/lib/db");
  const [account] = await db
    .select({ banned: user.banned })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);
  if (!account || account.banned) {
    return NextResponse.json({ error: "Esta conta não pode submeter conteúdo." }, { status: 403 });
  }

  const activeSubscription = await db
    .select({ id: subscriptions.id })
    .from(subscriptions)
    .where(and(
      eq(subscriptions.userId, session.user.id),
      eq(subscriptions.status, "active"),
      or(isNull(subscriptions.currentPeriodEnd), gt(subscriptions.currentPeriodEnd, new Date())),
    ))
    .limit(1);
  const isCreatorPlus = activeSubscription.length > 0;
  if (!isCreatorPlus && (submission.sources.length > 0 || containsExternalLink(submission.bodyMarkdown))) {
    return NextResponse.json({
      error: "O plano gratuito não permite ligações ou fontes. Assine o Creator Plus para incluir referências verificáveis.",
      code: "CREATOR_PLUS_REQUIRED",
    }, { status: 403 });
  }

  const articleId = randomUUID();
  const articleSlug = `${slugify(submission.title).slice(0, 150)}-${articleId.slice(0, 8)}`;
  const readingMinutes = calculateReadingMinutes(submission.bodyMarkdown);
  const article = await db.transaction(async (tx) => {
    const [created] = await tx.insert(articles).values({
      id: articleId,
      slug: articleSlug,
      kind: submission.kind,
      status: "pending_review",
      title: submission.title,
      standfirst: submission.standfirst,
      bodyMarkdown: submission.bodyMarkdown,
      category: submission.category,
      authorId: session.user.id,
      coverImageUrl: submission.coverImageUrl || null,
      readingMinutes,
      submittedWithPlan: isCreatorPlus ? "creator_plus" : "free",
      personCountry: submission.kind === "biography" ? submission.personCountry : null,
      personField: submission.kind === "biography" ? submission.personField ?? submission.category : null,
      personRole: submission.kind === "biography" ? submission.personRole : null,
    }).returning({ id: articles.id, slug: articles.slug, status: articles.status });

    if (submission.sources.length > 0) {
      await tx.insert(articleSources).values(submission.sources.map((source, position) => ({
        articleId: created.id,
        title: source.title,
        publisher: source.publisher || null,
        url: source.url,
        position,
      })));
    }
    return created;
  });

  return NextResponse.json({ article }, { status: 201 });
}
