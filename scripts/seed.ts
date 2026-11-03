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
    name: "Redação Kioo Africa",
    email: editorEmail,
    emailVerified: true,
  }).onConflictDoUpdate({
    target: schema.user.id,
    set: { name: "Redação Kioo Africa", emailVerified: true, updatedAt: new Date() },
  });

  await db.insert(schema.creatorProfiles).values({
    userId: editorId,
    slug: "msingi-africa",
    displayName: "Redação Kioo Africa",
    biography: "Grupo independente de pesquisa e jornalismo que acompanha as ideias, os negócios e as pessoas a transformar os mercados africanos.",
    countryCode: "AO",
  }).onConflictDoUpdate({
    target: schema.creatorProfiles.userId,
    set: {
      slug: "msingi-africa",
      displayName: "Redação Kioo Africa",
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
        isFeatured: article.isFeatured ?? index === 0,
        isSponsored: article.isSponsored ?? false,
        sponsorDisclosure: article.sponsorDisclosure ?? null,
        coverImageUrl: article.image,
        readingMinutes: readingMinutes(bodyMarkdown),
        seoTitle: article.seoTitle ?? null,
        seoDescription: article.seoDescription ?? null,
        seoKeywords: article.seoKeywords ?? [],
        publishedAt: new Date(),
        noIndex: false,
        submittedWithPlan: article.isSponsored ? "free" : "editorial",
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
        isFeatured: profile.isFeatured ?? false,
        isSponsored: profile.isSponsored ?? false,
        sponsorDisclosure: profile.sponsorDisclosure ?? null,
        coverImageUrl: profile.portrait?.src ?? profile.partnerLogoUrl ?? imageForCategory.Tecnologia,
        readingMinutes: readingMinutes(bodyMarkdown),
        seoTitle: profile.seoTitle ?? `${profile.name}: ${profile.role}`.slice(0, 70),
        seoDescription: profile.seoDescription ?? profile.summary.slice(0, 180),
        seoKeywords: profile.seoKeywords ?? [
          profile.name,
          profile.role,
          profile.field,
          profile.country,
          "Kioo Africa",
          "inovadores africanos",
        ],
        publishedAt: new Date(),
        noIndex: false,
        submittedWithPlan: profile.isSponsored ? "free" : "editorial",
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
      name: "Kioo Africa",
      description: "Grupo editorial e de pesquisa independente dedicado a pessoas, ideias e mercados africanos.",
      countryCode: "AO",
      websiteUrl: "https://msingi.africa",
      isVerified: true,
    },
    {
      slug: "creator-plus",
      type: "product" as const,
      name: "Kioo Creator Plus",
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
    {
      slug: "softedge-corporation",
      type: "company" as const,
      name: "SoftEdge Corporation",
      description: "Empresa angolana de tecnologia. A sua página institucional identifica Isaac Quarenta como fundador e lista José Lopes, Stefânio Costa e Tiago Rodrigues em funções técnicas da equipa.",
      countryCode: "AO",
      websiteUrl: "https://softedge-corporation.up.railway.app/",
      imageUrl: "/images/partners/softedge-logo.jpeg",
      isVerified: true,
    },
    {
      slug: "akira",
      type: "product" as const,
      name: "AKIRA",
      description: "Assistente de inteligência artificial apresentada pela SoftEdge Corporation como criada em Angola e focada em português.",
      countryCode: "AO",
      websiteUrl: "https://akira-ia.onrender.com/",
      imageUrl: "/images/partners/akira-web.png",
      isVerified: true,
    },
    {
      slug: "afcfta",
      type: "organization" as const,
      name: "Zona de Comércio Livre Continental Africana",
      description: "Acordo de integração económica da União Africana que procura facilitar o comércio de bens e serviços entre países africanos.",
      websiteUrl: "https://au-afcfta.org/",
      isVerified: true,
    },
    {
      slug: "desert-to-power",
      type: "organization" as const,
      name: "Desert to Power",
      description: "Iniciativa do Banco Africano de Desenvolvimento que visa mobilizar energia solar nos países do Sahel, com objetivo anunciado de 10 GW até 2030.",
      websiteUrl: "https://www.afdb.org/en/topics-and-sectors/initiatives-partnerships/desert-power-initiative",
      isVerified: true,
    },
    {
      slug: "africa-cdc",
      type: "organization" as const,
      name: "Africa Centres for Disease Control and Prevention",
      description: "Agência de saúde pública da União Africana dedicada a reforçar a prevenção, preparação e resposta a ameaças de saúde no continente.",
      websiteUrl: "https://africacdc.org/",
      isVerified: true,
    },
    {
      slug: "partnership-african-vaccine-manufacturing",
      type: "organization" as const,
      name: "Partnerships for African Vaccine Manufacturing",
      description: "Iniciativa apresentada pela Africa CDC para apoiar o desenvolvimento da capacidade de produção de vacinas em África.",
      websiteUrl: "https://africacdc.org/event/partnerships-for-african-vaccine-manufacturing-pavm/",
      isVerified: true,
    },
    {
      slug: "ashesi-university",
      type: "organization" as const,
      name: "Ashesi University",
      description: "Universidade no Gana cuja missão institucional destaca a formação de líderes éticos e empreendedores.",
      countryCode: "GH",
      websiteUrl: "https://ashesi.org/",
      isVerified: true,
    },
    {
      slug: "dangote-group",
      type: "company" as const,
      name: "Dangote Group",
      description: "Grupo empresarial nigeriano com operações industriais em setores como cimento, alimentos, fertilizantes e energia.",
      countryCode: "NG",
      websiteUrl: "https://www.dangote.com/",
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
    { entitySlug: "softedge-corporation", storySlug: "softedge-ia-angolana-akira", role: "partner" },
    { entitySlug: "softedge-corporation", storySlug: "isaac-nascimento-quarenta", role: "partner" },
    { entitySlug: "akira", storySlug: "softedge-ia-angolana-akira", role: "subject" },
    { entitySlug: "afcfta", storySlug: "afcfta-integracao-mercados-africanos", role: "subject" },
    { entitySlug: "desert-to-power", storySlug: "desert-to-power-energia-solar-sahel", role: "subject" },
    { entitySlug: "africa-cdc", storySlug: "africa-cdc-seguranca-sanitaria-capacidade-local", role: "subject" },
    { entitySlug: "partnership-african-vaccine-manufacturing", storySlug: "africa-cdc-seguranca-sanitaria-capacidade-local", role: "mentions" },
    { entitySlug: "ashesi-university", storySlug: "ashesi-educacao-lideranca-empreendedorismo-africa", role: "subject" },
    { entitySlug: "ashesi-university", storySlug: "patrick-awuah", role: "subject" },
    { entitySlug: "dangote-group", storySlug: "industria-africana-valor-acrescentado-producao-local", role: "subject" },
    { entitySlug: "dangote-group", storySlug: "aliko-dangote", role: "subject" },
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
