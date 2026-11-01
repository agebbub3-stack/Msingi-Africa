import "dotenv/config";
import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { articles as sampleArticles, biographies, imageForCategory } from "../src/lib/content";
import * as schema from "../src/lib/db/schema";
import { getPostgresSslConfig } from "../src/lib/db/ssl";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required to seed the editorial database.");

const databaseUrl = new URL(process.env.DATABASE_URL);
for (const parameter of ["sslmode", "sslrootcert", "sslcert", "sslkey"]) databaseUrl.searchParams.delete(parameter);
const pool = new Pool({
  connectionString: databaseUrl.toString(),
  max: 2,
  connectionTimeoutMillis: 10_000,
  ssl: getPostgresSslConfig(databaseUrl.hostname),
});
const db = drizzle(pool, { schema });
const editorId = "msingi-editorial";
const editorEmail = (process.env.NEXT_PUBLIC_EDITORIAL_EMAIL ?? "editorial@msingi.africa").trim().toLowerCase();

function readingMinutes(content: string) {
  return Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 220));
}

function articleBody(blocks: { heading?: string; text: string }[]) {
  return blocks.map((block) => `${block.heading ? `## ${block.heading}\n\n` : ""}${block.text}`).join("\n\n");
}

async function seed() {
  const includeDemoContent = process.env.SEED_DEMO_CONTENT === "true";
  if (includeDemoContent && process.env.NODE_ENV === "production") {
    throw new Error("Demo articles cannot be seeded in production.");
  }

  await db.insert(schema.user).values({
    id: editorId,
    name: "Redação Msingi Africa",
    email: editorEmail,
    emailVerified: true,
  }).onConflictDoUpdate({
    target: schema.user.id,
    set: { name: "Redação Msingi Africa", emailVerified: true, updatedAt: new Date() },
  });

  await db.insert(schema.creatorProfiles).values({
    userId: editorId,
    slug: "msingi-africa",
    displayName: "Redação Msingi Africa",
    biography: "Grupo independente de pesquisa e jornalismo que acompanha as ideias, os negócios e as pessoas a transformar os mercados africanos.",
    countryCode: "AO",
  }).onConflictDoUpdate({
    target: schema.creatorProfiles.userId,
    set: {
      slug: "msingi-africa",
      displayName: "Redação Msingi Africa",
      biography: "Grupo independente de pesquisa e jornalismo que acompanha as ideias, os negócios e as pessoas a transformar os mercados africanos.",
      countryCode: "AO",
      updatedAt: new Date(),
    },
  });

  const editorialArticles = sampleArticles.filter((article) => article.sources?.length);
  const editorialBiographies = biographies.filter((profile) => profile.sources?.length);
  const seedArticles = [
    ...editorialArticles,
    ...(includeDemoContent ? sampleArticles.filter((article) => !article.sources?.length) : []),
  ].map((article, index) => {
      const bodyMarkdown = articleBody(article.body ?? []);
      return {
        slug: article.slug,
        kind: "article" as const,
        status: "published" as const,
        title: article.title,
        standfirst: article.standfirst,
        bodyMarkdown,
        category: article.category,
        authorId: editorId,
        isFeatured: index === 0,
        coverImageUrl: article.image,
        readingMinutes: readingMinutes(bodyMarkdown),
        seoTitle: article.seoTitle ?? null,
        seoDescription: article.seoDescription ?? null,
        seoKeywords: article.seoKeywords ?? [],
        publishedAt: new Date(),
        noIndex: false,
        submittedWithPlan: "editorial",
      };
    });
  const seedBiographies = [
    ...editorialBiographies,
    ...(includeDemoContent ? biographies.filter((profile) => !profile.sources?.length) : []),
  ].map((profile) => {
      const bodyMarkdown = profile.body.join("\n\n");
      return {
        slug: profile.slug,
        kind: "biography" as const,
        status: "published" as const,
        title: profile.name,
        standfirst: profile.summary,
        bodyMarkdown,
        category: profile.field,
        personCountry: profile.country,
        personField: profile.field,
        personRole: profile.role,
        authorId: editorId,
        coverImageUrl: imageForCategory.Tecnologia,
        readingMinutes: readingMinutes(bodyMarkdown),
        seoTitle: `${profile.name}: ${profile.role}`,
        seoDescription: profile.summary,
        seoKeywords: [profile.name, profile.role, profile.field, profile.country, "inovadores africanos"],
        publishedAt: new Date(),
        noIndex: false,
        submittedWithPlan: "editorial",
      };
    });

  for (const article of [...seedArticles, ...seedBiographies]) {
    await db.insert(schema.articles).values(article).onConflictDoUpdate({
      target: schema.articles.slug,
      set: {
        kind: article.kind,
        status: "published",
        title: article.title,
        standfirst: article.standfirst,
        bodyMarkdown: article.bodyMarkdown,
        category: article.category,
        personCountry: article.kind === "biography" ? article.personCountry : null,
        personField: article.kind === "biography" ? article.personField : null,
        personRole: article.kind === "biography" ? article.personRole : null,
        coverImageUrl: article.coverImageUrl,
        readingMinutes: article.readingMinutes,
        seoTitle: article.seoTitle,
        seoDescription: article.seoDescription,
        seoKeywords: article.seoKeywords,
        publishedAt: article.publishedAt,
        noIndex: false,
        updatedAt: new Date(),
      },
    });
  }

  for (const sourceStory of [...editorialArticles, ...editorialBiographies]) {
    const [savedStory] = await db.select({ id: schema.articles.id })
      .from(schema.articles)
      .where(eq(schema.articles.slug, sourceStory.slug))
      .limit(1);
    if (!savedStory) throw new Error(`Seeded story "${sourceStory.slug}" could not be found.`);
    await db.delete(schema.articleSources).where(eq(schema.articleSources.articleId, savedStory.id));
    await db.insert(schema.articleSources).values(sourceStory.sources!.map((source, position) => ({
      articleId: savedStory.id,
      title: source.title,
      publisher: source.publisher,
      url: source.url,
      accessedAt: new Date(),
      position,
    })));
  }

  const entityRows = [
    {
      slug: "msingi-africa",
      type: "organization" as const,
      name: "Msingi Africa",
      description: "Grupo editorial e de pesquisa independente dedicado a pessoas, ideias e mercados africanos.",
      countryCode: "AO",
      websiteUrl: "https://msingi.africa",
      isVerified: true,
    },
    {
      slug: "creator-plus",
      type: "product" as const,
      name: "Msingi Creator Plus",
      description: "Plano mensal para criadores que precisam incluir ligações e fontes verificáveis nas propostas editoriais.",
      isVerified: true,
    },
  ];
  for (const entity of entityRows) {
    await db.insert(schema.entities).values(entity).onConflictDoUpdate({
      target: schema.entities.slug,
      set: { ...entity, updatedAt: new Date() },
    });
  }

  const [publisher] = await db.select({ id: schema.entities.id }).from(schema.entities)
    .where(eq(schema.entities.slug, "msingi-africa")).limit(1);
  const allSeededStories = [...seedArticles, ...seedBiographies];
  const seededStories = allSeededStories.length > 0
    ? await db.select({ id: schema.articles.id, slug: schema.articles.slug })
      .from(schema.articles)
      .where(sql`${schema.articles.slug} IN (${sql.join(allSeededStories.map((article) => sql`${article.slug}`), sql`, `)})`)
    : [];
  if (publisher && seededStories.length > 0) {
    await db.insert(schema.articleEntities).values(seededStories.map((article) => ({
      articleId: article.id,
      entityId: publisher.id,
      role: "publisher",
    }))).onConflictDoNothing();
  }

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (adminEmail) {
    const [admin] = await db.update(schema.user)
      .set({ role: "admin", updatedAt: new Date() })
      .where(sql`lower(${schema.user.email}) = ${adminEmail}`)
      .returning({ id: schema.user.id });
    console.info(admin
      ? "Configured the requested editorial administrator account."
      : "ADMIN_EMAIL did not match a registered account. Register it first, then rerun the seed command.");
  }
  console.info(
    `Seeded ${editorialArticles.length} sourced articles, ${editorialBiographies.length} sourced biographies, ` +
    `${includeDemoContent ? seedArticles.length - editorialArticles.length + seedBiographies.length - editorialBiographies.length : 0} demo stories, ` +
    `and ${entityRows.length} entity profiles.`,
  );
}

seed()
  .catch((error: unknown) => {
    console.error("Database seed failed.", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
