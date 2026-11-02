import "server-only";
import { and, asc, count, desc, eq, ilike, inArray, ne, or, sql } from "drizzle-orm";
import { articles as sampleArticles, biographies, imageForCategory } from "@/lib/content";
import type { Article, Biography } from "@/lib/content";
import { getSiteUrl } from "@/lib/site-url";

function formatPublishedDate(date: Date | null) {
  if (!date) return "";
  return new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function legacyBiographyAsArticle(slug: string): Article | undefined {
  const profile = biographies.find((item) => item.slug === slug);
  if (!profile) return undefined;
  return {
    slug: profile.slug,
    title: profile.name,
    standfirst: profile.summary,
    category: profile.field,
    author: "Redação Kioo",
    date: "",
    readingTime: "5 min de leitura",
    image: profile.portrait?.src ?? imageForCategory.Tecnologia,
    imageAlt: profile.portrait?.alt ?? `${profile.name}, perfil biográfico`,
    kind: "biography",
    isFeatured: profile.isFeatured,
    isSponsored: profile.isSponsored,
    sponsorDisclosure: profile.sponsorDisclosure,
    partnerName: profile.partnerName,
    partnerLogoUrl: profile.partnerLogoUrl,
    personCountry: profile.country,
    personField: profile.field,
    personRole: profile.role,
    seoTitle: profile.seoTitle,
    seoDescription: profile.seoDescription,
    seoKeywords: profile.seoKeywords,
    markdown: profile.body.map((paragraph) => paragraph).join("\n\n"),
    sources: profile.sources ?? [],
  };
}

function legacyArticle(slug: string): Article | undefined {
  const article = sampleArticles.find((item) => item.slug === slug);
  if (!article) return undefined;
  const markdown = article.body
    ?.map((block) => `${block.heading ? `## ${block.heading}\n\n` : ""}${block.text}`)
    .join("\n\n");
  return { ...article, kind: "article", markdown };
}

async function getFromDatabase(slug?: string, kind?: "article" | "biography", search?: string) {
  const { db } = await import("@/lib/db");
  const { articles, articleEntities, articleSources, creatorProfiles, entities, user } = await import("@/lib/db/schema");

  const searchPattern = search?.replace(/[\\%_]/g, "\\$&");
  const filters = [
    eq(articles.status, "published"),
    eq(articles.noIndex, false),
    ...(kind === "biography" ? [eq(articles.kind, "biography")] : [ne(articles.kind, "biography")]),
    ...(slug ? [eq(articles.slug, slug)] : []),
    ...(search ? [or(
      ilike(articles.title, `%${searchPattern}%`),
      ilike(articles.standfirst, `%${searchPattern}%`),
      ilike(articles.category, `%${searchPattern}%`),
      ilike(articles.bodyMarkdown, `%${searchPattern}%`),
      ilike(user.name, `%${searchPattern}%`),
      ilike(sql`array_to_string(${articles.seoKeywords}, ' ')`, `%${searchPattern}%`),
    )!] : []),
  ];

  const rows = await db
    .select({
      id: articles.id,
      slug: articles.slug,
      kind: articles.kind,
      title: articles.title,
      standfirst: articles.standfirst,
      category: articles.category,
      personCountry: articles.personCountry,
      personField: articles.personField,
      personRole: articles.personRole,
      bodyMarkdown: articles.bodyMarkdown,
      locale: articles.locale,
      authorName: user.name,
      authorSlug: creatorProfiles.slug,
      isFeatured: articles.isFeatured,
      isSponsored: articles.isSponsored,
      sponsorDisclosure: articles.sponsorDisclosure,
      seoTitle: articles.seoTitle,
      seoDescription: articles.seoDescription,
      seoKeywords: articles.seoKeywords,
      canonicalUrl: articles.canonicalUrl,
      coverImageUrl: articles.coverImageUrl,
      readingMinutes: articles.readingMinutes,
      publishedAt: articles.publishedAt,
      modifiedAt: articles.updatedAt,
    })
    .from(articles)
    .innerJoin(user, eq(articles.authorId, user.id))
    .leftJoin(creatorProfiles, eq(creatorProfiles.userId, user.id))
    .where(and(...filters))
    .orderBy(desc(articles.isFeatured), desc(articles.publishedAt))
    .limit(slug ? 1 : search ? 50 : 100);

  const partnerRows = rows.length > 0
    ? await db
      .select({
        articleId: articleEntities.articleId,
        name: entities.name,
        imageUrl: entities.imageUrl,
      })
      .from(articleEntities)
      .innerJoin(entities, eq(articleEntities.entityId, entities.id))
      .where(and(
        inArray(articleEntities.articleId, rows.map((row) => row.id)),
        eq(articleEntities.role, "partner"),
      ))
    : [];
  const partnersByArticle = new Map(partnerRows.map((partner) => [partner.articleId, partner]));

  const sourceRows = rows.length > 0
    ? await db
      .select({
        articleId: articleSources.articleId,
        title: articleSources.title,
        publisher: articleSources.publisher,
        url: articleSources.url,
      })
      .from(articleSources)
      .where(inArray(articleSources.articleId, rows.map((row) => row.id)))
      .orderBy(articleSources.position)
    : [];
  const sourcesByArticle = new Map<string, { title: string; publisher: string | null; url: string }[]>();
  for (const source of sourceRows) {
    const sources = sourcesByArticle.get(source.articleId) ?? [];
    sources.push({ title: source.title, publisher: source.publisher, url: source.url });
    sourcesByArticle.set(source.articleId, sources);
  }

  return rows.map((row): Article => {
    const biography = row.kind === "biography" ? biographies.find((item) => item.slug === row.slug) : undefined;
    const partner = partnersByArticle.get(row.id) ?? (
      biography?.partnerName
        ? { name: biography.partnerName, imageUrl: biography.partnerLogoUrl ?? null }
        : undefined
    );
    return {
      id: row.id,
      slug: row.slug,
      kind: row.kind,
      title: row.title,
      standfirst: row.standfirst,
      category: row.category,
      personCountry: row.personCountry,
      personField: row.personField,
      personRole: row.personRole,
      locale: row.locale,
      author: row.authorName,
      authorSlug: row.authorSlug,
      isFeatured: row.isFeatured,
      date: formatPublishedDate(row.publishedAt),
      publishedAt: row.publishedAt?.toISOString() ?? null,
      modifiedAt: row.modifiedAt.toISOString(),
      readingTime: `${row.readingMinutes} min de leitura`,
      image: biography?.portrait?.src ?? row.coverImageUrl ?? imageForCategory[row.category] ?? imageForCategory.Mercados,
      imageAlt: biography?.portrait?.alt ?? (
        row.kind === "biography" && partner
          ? `Logótipo da ${partner.name}, organização parceira deste perfil`
          : row.title
      ),
      markdown: row.bodyMarkdown,
      isSponsored: row.isSponsored,
      sponsorDisclosure: row.sponsorDisclosure,
      partnerName: partner?.name ?? null,
      partnerLogoUrl: partner?.imageUrl ?? null,
      seoTitle: row.seoTitle,
      seoDescription: row.seoDescription,
      seoKeywords: row.seoKeywords,
      canonicalUrl: row.canonicalUrl,
      sources: sourcesByArticle.get(row.id) ?? [],
    };
  });
}

export async function getPublishedArticles() {
  if (!process.env.DATABASE_URL) return sampleArticles;
  return getFromDatabase();
}

export async function getPublishedArticle(slug: string, kind: "article" | "biography" = "article") {
  if (!process.env.DATABASE_URL) {
    return kind === "biography" ? legacyBiographyAsArticle(slug) : legacyArticle(slug);
  }
  const [article] = await getFromDatabase(slug, kind);
  return article;
}

export type PublicArticleComment = {
  id: string;
  parentId: string | null;
  body: string;
  author: string;
  authorSlug: string | null;
  createdAt: string;
};

export async function getApprovedArticleComments(articleId: string) {
  const { db } = await import("@/lib/db");
  const { articles, comments, creatorProfiles, user } = await import("@/lib/db/schema");
  const filters = and(
    eq(comments.articleId, articleId),
    eq(comments.status, "approved"),
    eq(articles.status, "published"),
    eq(articles.noIndex, false),
  );
  const [rows, [result]] = await Promise.all([
    db.select({
      id: comments.id,
      parentId: comments.parentId,
      body: comments.body,
      author: user.name,
      authorSlug: creatorProfiles.slug,
      createdAt: comments.createdAt,
    })
      .from(comments)
      .innerJoin(articles, eq(comments.articleId, articles.id))
      .innerJoin(user, eq(comments.authorId, user.id))
      .leftJoin(creatorProfiles, eq(creatorProfiles.userId, user.id))
      .where(filters)
      .orderBy(asc(comments.createdAt))
      .limit(100),
    db.select({ count: count() })
      .from(comments)
      .innerJoin(articles, eq(comments.articleId, articles.id))
      .where(filters),
  ]);
  return {
    comments: rows.map((comment): PublicArticleComment => ({
      ...comment,
      createdAt: comment.createdAt.toISOString(),
    })),
    totalCount: result.count,
  };
}

export async function getPublishedBiographies() {
  if (!process.env.DATABASE_URL) return biographies;
  const { db } = await import("@/lib/db");
  const { articles, user } = await import("@/lib/db/schema");
  const rows = await db
    .select({
      slug: articles.slug,
      name: articles.title,
      summary: articles.standfirst,
      field: articles.category,
      country: articles.personCountry,
      role: articles.personRole,
      bodyMarkdown: articles.bodyMarkdown,
      locale: articles.locale,
      isFeatured: articles.isFeatured,
      isSponsored: articles.isSponsored,
      sponsorDisclosure: articles.sponsorDisclosure,
    })
    .from(articles)
    .innerJoin(user, eq(articles.authorId, user.id))
    .where(and(eq(articles.kind, "biography"), eq(articles.status, "published"), eq(articles.noIndex, false)))
    .orderBy(desc(articles.isFeatured), desc(articles.publishedAt))
    .limit(100);
  return rows.map((row): Biography => {
    const editorialProfile = biographies.find((profile) => profile.slug === row.slug);
    return {
      ...editorialProfile,
      slug: row.slug,
      name: row.name,
      summary: row.summary,
      field: row.field,
      country: row.country ?? "África",
      role: row.role ?? "Perfil publicado pela comunidade",
      isFeatured: row.isFeatured,
      isSponsored: row.isSponsored,
      sponsorDisclosure: row.sponsorDisclosure,
      partnerName: editorialProfile?.partnerName,
      partnerLogoUrl: editorialProfile?.partnerLogoUrl,
      monogram: editorialProfile?.monogram ?? row.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase(),
      accent: editorialProfile?.accent ?? "sage",
      body: row.bodyMarkdown.split(/\n{2,}/).filter(Boolean),
      portrait: editorialProfile?.portrait,
      sources: editorialProfile?.sources,
      locale: row.locale,
    };
  });
}

export async function searchPublishedArticles(query: string) {
  const search = query.trim().slice(0, 100);
  if (!search) return [];
  if (!process.env.DATABASE_URL) {
    const normalized = search.toLocaleLowerCase("pt");
    return sampleArticles.filter((article) =>
      `${article.title} ${article.standfirst} ${article.category} ${article.author} ${article.seoKeywords?.join(" ")} ${article.body?.map((part) => part.text).join(" ")}`
        .toLocaleLowerCase("pt")
        .includes(normalized),
    );
  }
  return getFromDatabase(undefined, undefined, search);
}

export type PublicEntity = {
  slug: string;
  type: "person" | "company" | "organization" | "market" | "product";
  name: string;
  description: string;
  countryCode: string | null;
  websiteUrl: string | null;
  imageUrl: string | null;
  verified: boolean;
};

const sampleEntities: PublicEntity[] = [
  {
    slug: "msingi-africa",
    type: "organization",
    name: "Kioo Africa",
    description: "Grupo editorial e de pesquisa independente dedicado a pessoas, ideias e mercados africanos.",
    countryCode: "AO",
    websiteUrl: getSiteUrl().origin,
    imageUrl: null,
    verified: true,
  },
  {
    slug: "creator-plus",
    type: "product",
    name: "Kioo Creator Plus",
    description: "Plano mensal para criadores que precisam incluir ligações e fontes verificáveis nas propostas editoriais.",
    countryCode: null,
    websiteUrl: null,
    imageUrl: null,
    verified: true,
  },
  {
    slug: "lifebank",
    type: "company",
    name: "LifeBank",
    description: "Empresa de cadeia de abastecimento de saúde que coordena a entrega de produtos essenciais a hospitais.",
    countryCode: "NG",
    websiteUrl: "https://lifebank.ng/",
    imageUrl: null,
    verified: true,
  },
  {
    slug: "andela",
    type: "company",
    name: "Andela",
    description: "Rede global que liga profissionais de tecnologia a oportunidades e equipas de empresas.",
    countryCode: null,
    websiteUrl: "https://www.andela.com/",
    imageUrl: null,
    verified: true,
  },
  {
    slug: "flutterwave",
    type: "company",
    name: "Flutterwave",
    description: "Empresa de tecnologia financeira focada em pagamentos para negócios que operam em mercados africanos.",
    countryCode: "NG",
    websiteUrl: "https://flutterwave.com/",
    imageUrl: null,
    verified: true,
  },
  {
    slug: "sunculture",
    type: "company",
    name: "SunCulture",
    description: "Empresa de tecnologia climática que combina energia solar, bombagem de água e irrigação para agricultores.",
    countryCode: "KE",
    websiteUrl: "https://sunculture.io/",
    imageUrl: null,
    verified: true,
  },
  {
    slug: "softedge-corporation",
    type: "company",
    name: "SoftEdge Corporation",
    description: "Empresa angolana de tecnologia focada em desenvolvimento de software, produtos digitais e soluções de inteligência artificial.",
    countryCode: "AO",
    websiteUrl: "https://softedge-corporation.up.railway.app/",
    imageUrl: "/images/partners/softedge-logo.jpeg",
    verified: true,
  },
  {
    slug: "akira",
    type: "product",
    name: "AKIRA",
    description: "Assistente de inteligência artificial apresentada pela SoftEdge Corporation como criada em Angola e focada em português.",
    countryCode: "AO",
    websiteUrl: "https://akira-ia.onrender.com/",
    imageUrl: "/images/partners/akira-web.png",
    verified: true,
  },
  {
    slug: "afcfta",
    type: "organization",
    name: "Zona de Comércio Livre Continental Africana",
    description: "Acordo de integração económica da União Africana que procura facilitar o comércio de bens e serviços entre países africanos.",
    countryCode: null,
    websiteUrl: "https://au-afcfta.org/",
    imageUrl: null,
    verified: true,
  },
  {
    slug: "desert-to-power",
    type: "organization",
    name: "Desert to Power",
    description: "Iniciativa do Banco Africano de Desenvolvimento que visa mobilizar energia solar nos países do Sahel, com objetivo anunciado de 10 GW até 2030.",
    countryCode: null,
    websiteUrl: "https://www.afdb.org/en/topics-and-sectors/initiatives-partnerships/desert-power-initiative",
    imageUrl: null,
    verified: true,
  },
  {
    slug: "africa-cdc",
    type: "organization",
    name: "Africa Centres for Disease Control and Prevention",
    description: "Agência de saúde pública da União Africana dedicada a reforçar a prevenção, preparação e resposta a ameaças de saúde no continente.",
    countryCode: "ET",
    websiteUrl: "https://africacdc.org/",
    imageUrl: null,
    verified: true,
  },
  {
    slug: "partnership-african-vaccine-manufacturing",
    type: "organization",
    name: "Partnerships for African Vaccine Manufacturing",
    description: "Iniciativa apresentada pela Africa CDC para apoiar o desenvolvimento da capacidade de produção de vacinas em África.",
    countryCode: null,
    websiteUrl: "https://africacdc.org/event/partnerships-for-african-vaccine-manufacturing-pavm/",
    imageUrl: null,
    verified: true,
  },
  {
    slug: "ashesi-university",
    type: "organization",
    name: "Ashesi University",
    description: "Universidade no Gana cuja missão institucional destaca a formação de líderes éticos e empreendedores.",
    countryCode: "GH",
    websiteUrl: "https://ashesi.org/",
    imageUrl: null,
    verified: true,
  },
  {
    slug: "dangote-group",
    type: "company",
    name: "Dangote Group",
    description: "Grupo empresarial nigeriano com operações industriais em setores como cimento, alimentos, fertilizantes e energia.",
    countryCode: "NG",
    websiteUrl: "https://www.dangote.com/",
    imageUrl: null,
    verified: true,
  },
];

export async function getPublicEntities(): Promise<PublicEntity[]> {
  if (!process.env.DATABASE_URL) return sampleEntities;
  const { db } = await import("@/lib/db");
  const { entities } = await import("@/lib/db/schema");
  const rows = await db.select().from(entities).orderBy(entities.name).limit(100);
  return rows.map(({ slug, type, name, description, countryCode, websiteUrl, imageUrl, isVerified }) => ({
    slug, type, name, description, countryCode, websiteUrl, imageUrl, verified: isVerified,
  }));
}

export async function getPublicEntity(slug: string): Promise<PublicEntity | undefined> {
  if (!process.env.DATABASE_URL) return sampleEntities.find((entity) => entity.slug === slug);
  const { db } = await import("@/lib/db");
  const { entities } = await import("@/lib/db/schema");
  const [entity] = await db.select().from(entities).where(eq(entities.slug, slug)).limit(1);
  if (!entity) return undefined;
  return {
    slug: entity.slug,
    type: entity.type,
    name: entity.name,
    description: entity.description,
    countryCode: entity.countryCode,
    websiteUrl: entity.websiteUrl,
    imageUrl: entity.imageUrl,
    verified: entity.isVerified,
  };
}

export async function getArticlesForEntity(slug: string) {
  if (!process.env.DATABASE_URL) {
    const relatedSlugs: Record<string, string[]> = {
      lifebank: ["logistica-saude-acesso-sangue", "temie-giwa-tubosun"],
      andela: ["iyinoluwa-aboyeji"],
      flutterwave: ["iyinoluwa-aboyeji"],
      sunculture: ["energia-solar-irrigacao-agricultura-africa", "samir-ibrahim"],
      "softedge-corporation": ["softedge-ia-angolana-akira", "isaac-nascimento-quarenta"],
      akira: ["softedge-ia-angolana-akira"],
      afcfta: ["afcfta-integracao-mercados-africanos"],
      "desert-to-power": ["desert-to-power-energia-solar-sahel"],
      "africa-cdc": ["africa-cdc-seguranca-sanitaria-capacidade-local"],
      "partnership-african-vaccine-manufacturing": ["africa-cdc-seguranca-sanitaria-capacidade-local"],
      "ashesi-university": ["ashesi-educacao-lideranca-empreendedorismo-africa", "patrick-awuah"],
      "dangote-group": ["industria-africana-valor-acrescentado-producao-local", "aliko-dangote"],
    };
    const stories = relatedSlugs[slug];
    if (!stories) return sampleArticles.slice(0, 3);
    return stories.flatMap((storySlug) => {
      const article = legacyArticle(storySlug) ?? legacyBiographyAsArticle(storySlug);
      return article ? [article] : [];
    });
  }
  const { db } = await import("@/lib/db");
  const { articleEntities, articles, entities } = await import("@/lib/db/schema");
  const linkedRows = await db.select({ id: articles.id }).from(articleEntities)
    .innerJoin(articles, eq(articleEntities.articleId, articles.id))
    .innerJoin(entities, eq(articleEntities.entityId, entities.id))
    .where(and(
      eq(entities.slug, slug),
      eq(articles.status, "published"),
      eq(articles.noIndex, false),
    ))
    .orderBy(desc(articles.publishedAt))
    .limit(30);
  if (linkedRows.length === 0) return [];
  const articleIds = new Set(linkedRows.map((row) => row.id));
  const [publishedArticles, publishedBiographies] = await Promise.all([
    getPublishedArticles(),
    getFromDatabase(undefined, "biography"),
  ]);
  return [...publishedArticles, ...publishedBiographies]
    .filter((article) => article.id && articleIds.has(article.id));
}

export type PublicAuthor = {
  slug: string;
  name: string;
  biography: string;
  countryCode: string | null;
  imageUrl: string | null;
  articleCount: number;
};

export async function getPublicAuthors(): Promise<PublicAuthor[]> {
  if (!process.env.DATABASE_URL) return [];
  const { db } = await import("@/lib/db");
  const { articles, creatorProfiles, user } = await import("@/lib/db/schema");
  return db.select({
    slug: creatorProfiles.slug,
    name: creatorProfiles.displayName,
    biography: creatorProfiles.biography,
    countryCode: creatorProfiles.countryCode,
    imageUrl: creatorProfiles.imageUrl,
    articleCount: count(articles.id),
  }).from(creatorProfiles)
    .innerJoin(user, eq(creatorProfiles.userId, user.id))
    .leftJoin(articles, and(eq(articles.authorId, user.id), eq(articles.status, "published"), eq(articles.noIndex, false)))
    .where(eq(creatorProfiles.isPublic, true))
    .groupBy(creatorProfiles.id, creatorProfiles.slug, creatorProfiles.displayName, creatorProfiles.biography, creatorProfiles.countryCode, creatorProfiles.imageUrl)
    .orderBy(desc(count(articles.id)))
    .limit(100);
}

export async function getPublicAuthor(slug: string) {
  const authors = await getPublicAuthors();
  const author = authors.find((item) => item.slug === slug);
  if (!author) return undefined;
  const allArticles = await getPublishedArticles();
  return {
    ...author,
    articles: allArticles.filter((article) => article.authorSlug === slug),
  };
}
