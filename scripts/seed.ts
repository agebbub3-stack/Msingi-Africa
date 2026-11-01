import { config } from "dotenv";
import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { articles as sampleArticles, biographies, imageForCategory } from "../src/lib/content";
import * as schema from "../src/lib/db/schema";
import { getPostgresConnectionUrl } from "../src/lib/db/connection-url";
import { getPostgresSslConfig } from "../src/lib/db/ssl";

config({ path: ".env.local" });
config();

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required to seed the editorial database.");

const databaseUrl = getPostgresConnectionUrl(process.env.DATABASE_URL);
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
        coverImageUrl: profile.portrait?.src ?? imageForCategory.Tecnologia,
        readingMinutes: readingMinutes(bodyMarkdown),
        seoTitle: `${profile.name}: ${profile.role}`,
        seoDescription: profile.summary,
        seoKeywords: profile.seoKeywords ?? [
          profile.name,
          profile.role,
          profile.field,
          profile.country,
          "Msingi Africa",
          "inovadores africanos",
        ],
        publishedAt: new Date(),
        noIndex: false,
        submittedWithPlan: "editorial",
      };
    });

  const insertedStorySlugs = new Set<string>();
  for (const article of [...seedArticles, ...seedBiographies]) {
    const [inserted] = await db.insert(schema.articles).values(article)
      .onConflictDoNothing({ target: schema.articles.slug })
      .returning({ slug: schema.articles.slug });
    if (inserted) insertedStorySlugs.add(inserted.slug);
  }

  for (const sourceStory of [...editorialArticles, ...editorialBiographies]) {
    if (!insertedStorySlugs.has(sourceStory.slug)) continue;
    const [savedStory] = await db.select({ id: schema.articles.id })
      .from(schema.articles)
      .where(eq(schema.articles.slug, sourceStory.slug))
      .limit(1);
    if (!savedStory) throw new Error(`Seeded story "${sourceStory.slug}" could not be found.`);
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
    {
      slug: "lifebank",
      type: "company" as const,
      name: "LifeBank",
      description: "Empresa de cadeia de abastecimento de saúde que coordena a entrega de produtos essenciais a hospitais.",
      countryCode: "NG",
      websiteUrl: "https://lifebank.ng/",
      isVerified: true,
    },
    {
      slug: "andela",
      type: "company" as const,
      name: "Andela",
      description: "Rede global que liga profissionais de tecnologia a oportunidades e equipas de empresas.",
      websiteUrl: "https://www.andela.com/",
      isVerified: true,
    },
    {
      slug: "flutterwave",
      type: "company" as const,
      name: "Flutterwave",
      description: "Empresa de tecnologia financeira focada em pagamentos para negócios que operam em mercados africanos.",
      countryCode: "NG",
      websiteUrl: "https://flutterwave.com/",
      isVerified: true,
    },
    {
      slug: "sunculture",
      type: "company" as const,
      name: "SunCulture",
      description: "Empresa de tecnologia climática que combina energia solar, bombagem de água e irrigação para agricultores.",
      countryCode: "KE",
      websiteUrl: "https://sunculture.io/",
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
  const entityStoryRelations = [
    { entitySlug: "lifebank", storySlug: "logistica-saude-acesso-sangue", role: "subject" },
    { entitySlug: "lifebank", storySlug: "temie-giwa-tubosun", role: "subject" },
    { entitySlug: "andela", storySlug: "iyinoluwa-aboyeji", role: "mentions" },
    { entitySlug: "flutterwave", storySlug: "iyinoluwa-aboyeji", role: "subject" },
    { entitySlug: "sunculture", storySlug: "energia-solar-irrigacao-agricultura-africa", role: "subject" },
    { entitySlug: "sunculture", storySlug: "samir-ibrahim", role: "subject" },
  ];
  for (const relation of entityStoryRelations) {
    const [entity] = await db.select({ id: schema.entities.id }).from(schema.entities)
      .where(eq(schema.entities.slug, relation.entitySlug)).limit(1);
    const [story] = await db.select({ id: schema.articles.id }).from(schema.articles)
      .where(eq(schema.articles.slug, relation.storySlug)).limit(1);
    if (!entity || !story) throw new Error(`Could not link entity "${relation.entitySlug}" to "${relation.storySlug}".`);
    await db.insert(schema.articleEntities).values({
      articleId: story.id,
      entityId: entity.id,
      role: relation.role,
    }).onConflictDoNothing();
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
