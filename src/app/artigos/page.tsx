import type { Metadata } from "next";
import { ArticlesArchive } from "@/components/articles-archive";
import { getPublishedArticles } from "@/lib/public-content";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Artigos e análise de mercados africanos",
  description: "Reportagens, ideias e análise independente sobre os mercados, a tecnologia e a cultura em África.",
  alternates: { canonical: "/artigos" },
};

export default async function ArticlesPage() {
  const publishedArticles = await getPublishedArticles();
  return <ArticlesArchive articles={publishedArticles} />;
}
