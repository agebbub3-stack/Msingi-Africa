import type { MetadataRoute } from "next";
import { getPublicAuthors, getPublicEntities, getPublishedArticles, getPublishedBiographies } from "@/lib/public-content";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://msingi.africa");
  const staticPages = ["", "/artigos", "/biografias", "/autores", "/entidades", "/sobre", "/contacto"];
  const [articles, biographies, entities, authors] = await Promise.all([
    getPublishedArticles(),
    getPublishedBiographies(),
    getPublicEntities(),
    getPublicAuthors(),
  ]);
  const articlePages = articles.flatMap((article) => {
    const canonical = new URL(article.canonicalUrl?.trim() || `/artigos/${article.slug}`, siteUrl);
    if (canonical.origin !== siteUrl.origin) return [];
    return [{
      url: canonical.toString(),
      ...(article.modifiedAt ? { lastModified: new Date(article.modifiedAt) } : {}),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }];
  });
  return [
    ...staticPages.map((path) => ({
      url: new URL(path, siteUrl).toString(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...articlePages,
    ...biographies.map((profile) => ({
      url: new URL(`/biografias/${profile.slug}`, siteUrl).toString(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...entities.map((entity) => ({
      url: new URL(`/entidades/${entity.slug}`, siteUrl).toString(),
      changeFrequency: "monthly" as const,
      priority: 0.55,
    })),
    ...authors.map((author) => ({
      url: new URL(`/autores/${author.slug}`, siteUrl).toString(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
