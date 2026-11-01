import type { MetadataRoute } from "next";
import { getPublicAuthors, getPublicEntities, getPublishedArticles, getPublishedBiographies } from "@/lib/public-content";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://msingi.africa";
  const staticPages = ["", "/artigos", "/biografias", "/autores", "/entidades", "/pesquisa", "/sobre", "/publicar", "/contacto"];
  const [articles, biographies, entities, authors] = await Promise.all([
    getPublishedArticles(),
    getPublishedBiographies(),
    getPublicEntities(),
    getPublicAuthors(),
  ]);
  return [
    ...staticPages.map((path) => ({
      url: new URL(path, baseUrl).toString(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...articles.map((article) => ({
      url: new URL(`/artigos/${article.slug}`, baseUrl).toString(),
      ...(article.modifiedAt ? { lastModified: new Date(article.modifiedAt) } : {}),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...biographies.map((profile) => ({
      url: new URL(`/biografias/${profile.slug}`, baseUrl).toString(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...entities.map((entity) => ({
      url: new URL(`/entidades/${entity.slug}`, baseUrl).toString(),
      changeFrequency: "monthly" as const,
      priority: 0.55,
    })),
    ...authors.map((author) => ({
      url: new URL(`/autores/${author.slug}`, baseUrl).toString(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
