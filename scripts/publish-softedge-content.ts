import { config } from "dotenv";
import { eq, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { articles as editorialArticles, biographies, imageForCategory } from "../src/lib/content";
import * as schema from "../src/lib/db/schema";
import { getPostgresConnectionUrl } from "../src/lib/db/connection-url";
import { getPostgresSslConfig } from "../src/lib/db/ssl";
import { submitIndexNow } from "../src/lib/indexnow";

config({ path: ".env.local" });
config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required to publish the SoftEdge partnership content.");
}

const databaseUrl = getPostgresConnectionUrl(process.env.DATABASE_URL);
const pool = new Pool({
  connectionString: databaseUrl.toString(),
  max: 2,
  connectionTimeoutMillis: 10_000,
  ssl: getPostgresSslConfig(databaseUrl.hostname),
});
const db = drizzle(pool, { schema });
const editorId = "msingi-editorial";
const partnerArticleSlug = "softedge-ia-angolana-akira";
const isaacProfileSlug = "isaac-nascimento-quarenta";
const partnerArticle = editorialArticles.find((article) => article.slug === partnerArticleSlug);
const isaacProfile = biographies.find((profile) => profile.slug === isaacProfileSlug);

if (!partnerArticle || !isaacProfile) {
  throw new Error("The SoftEdge article and Isaac biography must exist in the editorial content source.");
}
const partnerArticleCoverImage = partnerArticle.image;

function readingMinutes(content: string) {
  return Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 220));
}

function asMarkdown(story: { body?: { heading?: string; text: string }[]; markdown?: string }) {
  if (story.markdown) return story.markdown;
  return (story.body ?? [])
    .map((block) => `${block.heading ? `## ${block.heading}\n\n` : ""}${block.text}`)
    .join("\n\n");
}

const biographyStory = {
  slug: isaacProfile.slug,
  title: isaacProfile.name,
  standfirst: isaacProfile.summary,
  category: isaacProfile.field,
  author: "Redação Kioo",
  date: "",
  readingTime: "5 min de leitura",
  image: isaacProfile.partnerLogoUrl ?? imageForCategory.Tecnologia,
  imageAlt: `${isaacProfile.partnerName ?? "SoftEdge Corporation"} logo, partnership profile`,
  kind: "biography" as const,
  isFeatured: isaacProfile.isFeatured,
  isSponsored: isaacProfile.isSponsored,
  sponsorDisclosure: isaacProfile.sponsorDisclosure,
  partnerName: isaacProfile.partnerName,
  partnerLogoUrl: isaacProfile.partnerLogoUrl,
  personCountry: isaacProfile.country,
  personField: isaacProfile.field,
  personRole: isaacProfile.role,
  markdown: isaacProfile.body.join("\n\n"),
  seoTitle: isaacProfile.seoTitle ?? `${isaacProfile.name}: ${isaacProfile.role}`.slice(0, 70),
  seoDescription: isaacProfile.seoDescription ?? isaacProfile.summary.slice(0, 180),
  seoKeywords: isaacProfile.seoKeywords ?? [],
  sources: isaacProfile.sources ?? [],
};

const partnershipStories = [
  { story: partnerArticle, kind: "article" as const, seoTitle: partnerArticle.seoTitle },
  { story: biographyStory, kind: "biography" as const, seoTitle: biographyStory.seoTitle },
];

const entityRows: (typeof schema.entities.$inferInsert)[] = [
  {
    slug: "msingi-africa",
    type: "organization",
    name: "Kioo Africa",
    description: "Grupo editorial e de pesquisa independente dedicado a pessoas, ideias e mercados africanos.",
    countryCode: "AO",
    websiteUrl: "https://msingi.africa",
    isVerified: true,
  },
  {
    slug: "softedge-corporation",
    type: "company",
    name: "SoftEdge Corporation",
    description: "Empresa angolana de tecnologia. A sua página institucional identifica Isaac Quarenta como fundador e lista José Lopes, Stefânio Costa e Tiago Rodrigues em funções técnicas da equipa.",
    countryCode: "AO",
    websiteUrl: "https://softedge-corporation.up.railway.app/",
    imageUrl: "/images/partners/softedge-logo.jpeg",
    isVerified: true,
  },
  {
    slug: "akira",
    type: "product",
    name: "AKIRA",
    description: "Assistente de inteligência artificial apresentada pela SoftEdge Corporation como criada em Angola e focada em português.",
    countryCode: "AO",
    websiteUrl: "https://akira-ia.onrender.com/",
    imageUrl: "/images/partners/akira-web.png",
    isVerified: true,
  },
];

function storySnapshot(story: typeof schema.articles.$inferSelect) {
  return JSON.stringify([
    story.kind,
    story.status,
    story.title,
    story.standfirst,
    story.bodyMarkdown,
    story.category,
    story.locale,
    story.personCountry,
    story.personField,
    story.personRole,
    story.editorialAuthor,
    story.isFeatured,
    story.isSponsored,
    story.sponsorDisclosure,
    story.seoTitle,
    story.seoDescription,
    story.seoKeywords,
    story.coverImageUrl,
    story.noIndex,
    story.readingMinutes,
    story.submittedWithPlan,
    story.publishedAt,
  ]);
}

function storyInputSnapshot(story: typeof schema.articles.$inferInsert) {
  return JSON.stringify([
    story.kind,
    story.status,
    story.title,
    story.standfirst,
    story.bodyMarkdown,
    story.category,
    story.locale,
    story.personCountry,
    story.personField,
    story.personRole,
    story.editorialAuthor,
    story.isFeatured,
    story.isSponsored,
    story.sponsorDisclosure,
    story.seoTitle,
    story.seoDescription,
    story.seoKeywords,
    story.coverImageUrl,
    story.noIndex,
    story.readingMinutes,
    story.submittedWithPlan,
    story.publishedAt,
  ]);
}

async function ensureEntity(transaction: Parameters<Parameters<typeof db.transaction>[0]>[0], entity: typeof entityRows[number]) {
  const [existing] = await transaction.select().from(schema.entities)
    .where(eq(schema.entities.slug, entity.slug))
    .limit(1);

  if (!existing) {
    const [inserted] = await transaction.insert(schema.entities).values(entity)
      .returning({ id: schema.entities.id });
    if (!inserted) throw new Error(`Could not create entity "${entity.slug}".`);
    return inserted.id;
  }

  const hasChanges = existing.name !== entity.name
    || existing.type !== entity.type
    || existing.description !== entity.description
    || existing.countryCode !== (entity.countryCode ?? null)
    || existing.websiteUrl !== (entity.websiteUrl ?? null)
    || existing.imageUrl !== (entity.imageUrl ?? null)
    || existing.isVerified !== entity.isVerified;
  if (!hasChanges) return existing.id;

  const [updated] = await transaction.update(schema.entities)
    .set({ ...entity, updatedAt: new Date() })
    .where(eq(schema.entities.id, existing.id))
    .returning({ id: schema.entities.id });
  if (!updated) throw new Error(`Could not update entity "${entity.slug}".`);
  return updated.id;
}

async function publishStory(
  transaction: Parameters<Parameters<typeof db.transaction>[0]>[0],
  story: typeof partnershipStories[number]["story"],
  kind: typeof partnershipStories[number]["kind"],
  seoTitle: string | null | undefined,
  authorId: string,
) {
  if (!story.sources?.length) throw new Error(`Story "${story.slug}" has no sources.`);
  if (story.isSponsored && !story.sponsorDisclosure) {
    throw new Error(`Sponsored story "${story.slug}" requires a disclosure.`);
  }

  const bodyMarkdown = asMarkdown(story);
  const [existing] = await transaction.select().from(schema.articles)
    .where(eq(schema.articles.slug, story.slug))
    .limit(1);
  const values: typeof schema.articles.$inferInsert = {
    slug: story.slug,
    kind,
    status: "published",
    title: story.title,
    standfirst: story.standfirst,
    bodyMarkdown,
    category: story.category,
    locale: "pt-AO",
    personCountry: story.personCountry ?? null,
    personField: story.personField ?? null,
    personRole: story.personRole ?? null,
    authorId,
    editorialAuthor: "Redação Kioo Africa",
    isFeatured: story.isFeatured ?? false,
    isSponsored: story.isSponsored ?? false,
    sponsorDisclosure: story.sponsorDisclosure ?? null,
    seoTitle: seoTitle?.slice(0, 70) ?? null,
    seoDescription: story.seoDescription?.slice(0, 180) ?? null,
    seoKeywords: story.seoKeywords ?? [],
    coverImageUrl: story.image,
    noIndex: false,
    readingMinutes: readingMinutes(bodyMarkdown),
    submittedWithPlan: story.isSponsored ? "free" : "editorial",
    publishedAt: existing?.publishedAt ?? new Date(),
  };
  const changed = !existing || storySnapshot(existing) !== storyInputSnapshot(values);
  let articleId = existing?.id;

  if (changed) {
    if (existing) {
      await transaction.insert(schema.articleRevisions).values({
        articleId: existing.id,
        editorId,
        revision: {
          title: existing.title,
          standfirst: existing.standfirst,
          bodyMarkdown: existing.bodyMarkdown,
          category: existing.category,
          seoTitle: existing.seoTitle,
          seoDescription: existing.seoDescription,
          seoKeywords: existing.seoKeywords,
          isFeatured: existing.isFeatured,
          isSponsored: existing.isSponsored,
          sponsorDisclosure: existing.sponsorDisclosure,
        },
        note: "Updated the disclosed SoftEdge partnership feature.",
      });
    }

    const [saved] = await transaction.insert(schema.articles).values(values)
      .onConflictDoUpdate({
        target: schema.articles.slug,
        set: { ...values, updatedAt: new Date() },
      })
      .returning({ id: schema.articles.id });
    if (!saved) throw new Error(`Could not publish story "${story.slug}".`);
    articleId = saved.id;
  }

  if (!articleId) throw new Error(`Published story "${story.slug}" has no database id.`);
  const existingSources = await transaction.select({
    title: schema.articleSources.title,
    publisher: schema.articleSources.publisher,
    url: schema.articleSources.url,
  }).from(schema.articleSources)
    .where(eq(schema.articleSources.articleId, articleId))
    .orderBy(schema.articleSources.position);
  const desiredSources = story.sources.map(({ title, publisher, url }) => ({ title, publisher, url }));
  if (JSON.stringify(existingSources) !== JSON.stringify(desiredSources)) {
    await transaction.delete(schema.articleSources)
      .where(eq(schema.articleSources.articleId, articleId));
    await transaction.insert(schema.articleSources).values(desiredSources.map((source, position) => ({
      articleId,
      ...source,
      accessedAt: new Date(),
      position,
    })));
  }

  return { id: articleId, slug: story.slug };
}

async function publish() {
  const publishedSlugs = await db.transaction(async (transaction) => {
    const [editor] = await transaction.select({ id: schema.user.id }).from(schema.user)
      .where(eq(schema.user.id, editorId))
      .limit(1);
    if (!editor) throw new Error('Editorial user "msingi-editorial" is missing. Run the normal seed first.');

    const entityIds = new Map<string, string>();
    for (const entity of entityRows) {
      entityIds.set(entity.slug, await ensureEntity(transaction, entity));
    }

    const savedStories = [];
    for (const { story, kind, seoTitle } of partnershipStories) {
      savedStories.push(await publishStory(transaction, story, kind, seoTitle, editor.id));
    }

    const relations = [
      { storySlug: partnerArticleSlug, entitySlug: "msingi-africa", role: "publisher" },
      { storySlug: isaacProfileSlug, entitySlug: "msingi-africa", role: "publisher" },
      { storySlug: partnerArticleSlug, entitySlug: "softedge-corporation", role: "partner" },
      { storySlug: isaacProfileSlug, entitySlug: "softedge-corporation", role: "partner" },
      { storySlug: partnerArticleSlug, entitySlug: "akira", role: "subject" },
    ];

    for (const relation of relations) {
      const story = savedStories.find((item) => item.slug === relation.storySlug);
      const entityId = entityIds.get(relation.entitySlug);
      if (!story || !entityId) {
        throw new Error(`Could not resolve relationship "${relation.entitySlug}" → "${relation.storySlug}".`);
      }
      await transaction.insert(schema.articleEntities).values({
        articleId: story.id,
        entityId,
        role: relation.role,
      }).onConflictDoUpdate({
        target: [schema.articleEntities.articleId, schema.articleEntities.entityId],
        set: { role: relation.role },
      });
    }
    return savedStories.map((story) => story.slug);
  });

  const publishedRows = await db.select({
    id: schema.articles.id,
    slug: schema.articles.slug,
    status: schema.articles.status,
    coverImageUrl: schema.articles.coverImageUrl,
    isFeatured: schema.articles.isFeatured,
    isSponsored: schema.articles.isSponsored,
    sponsorDisclosure: schema.articles.sponsorDisclosure,
    submittedWithPlan: schema.articles.submittedWithPlan,
  }).from(schema.articles)
    .where(inArray(schema.articles.slug, [partnerArticleSlug, isaacProfileSlug]));
  if (
    publishedRows.length !== 2
    || publishedRows.some((story) =>
      story.status !== "published"
      || !story.isFeatured
      || !story.isSponsored
      || !story.sponsorDisclosure
      || (story.slug === partnerArticleSlug && story.coverImageUrl !== partnerArticleCoverImage)
      || story.submittedWithPlan !== "free")
  ) {
    throw new Error("Post-publication verification failed for the featured partnership records or AKIRA article cover.");
  }

  const sourceRows = await db.select({ id: schema.articleSources.id }).from(schema.articleSources)
    .where(inArray(schema.articleSources.articleId, publishedRows.map((story) => story.id)));
  const expectedSourceCount = partnershipStories.reduce(
    (total, { story }) => total + (story.sources?.length ?? 0),
    0,
  );
  if (sourceRows.length !== expectedSourceCount) {
    throw new Error("Post-publication verification found an unexpected number of source records.");
  }

  const relationRows = await db.select({
    articleId: schema.articleEntities.articleId,
    entityId: schema.articleEntities.entityId,
  }).from(schema.articleEntities)
    .where(inArray(schema.articleEntities.articleId, publishedRows.map((story) => story.id)));
  if (relationRows.length < 5) {
    throw new Error("Post-publication verification found missing company, product or publisher relationships.");
  }

  console.info(`Published and linked partnership stories: ${publishedSlugs.join(", ")}.`);
  try {
    const siteUrl = new URL(process.env.INDEXNOW_SITE_URL?.trim() || "https://kioo-africa.vercel.app");
    const indexing = await submitIndexNow(
      [
        "/artigos/softedge-ia-angolana-akira",
        "/biografias/isaac-nascimento-quarenta",
        "/entidades/softedge-corporation",
        "/entidades/akira",
      ],
      siteUrl,
    );
    if (indexing.status === "unconfigured") {
      console.warn("Stories are published, but IndexNow was not submitted because INDEXNOW_KEY is not configured.");
    } else {
      console.info(`IndexNow accepted ${indexing.submittedCount} URL(s) with HTTP ${indexing.httpStatus}.`);
    }
  } catch (error) {
    console.error("Stories are published, but IndexNow notification failed.", error);
  }
}

publish()
  .catch((error: unknown) => {
    console.error("SoftEdge partnership publication failed.", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
