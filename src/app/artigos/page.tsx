import type { Metadata } from "next";
import { ArticlesArchive } from "@/components/articles-archive";
import { getPublishedArticles } from "@/lib/public-content";
import { getLocale } from "@/lib/locale.server";
import { createPageMetadata } from "@/lib/page-metadata";

export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return createPageMetadata({
    locale,
    kind: "articles",
    path: "/artigos",
    eyebrow: locale === "en" ? "AFRICAN MARKETS · ANALYSIS" : "MERCADOS AFRICANOS · ANÁLISE",
    title: locale === "en" ? "African markets: stories and analysis" : "Artigos e análise de mercados africanos",
    description: locale === "en"
      ? "Independent reporting, ideas and analysis on African markets, technology and culture."
      : "Reportagens, ideias e análise independente sobre os mercados, a tecnologia e a cultura em África.",
  });
}

export default async function ArticlesPage() {
  const [publishedArticles, locale] = await Promise.all([getPublishedArticles(), getLocale()]);
  return <ArticlesArchive articles={publishedArticles} locale={locale} />;
}
