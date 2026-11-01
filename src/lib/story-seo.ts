import type { Article } from "@/lib/content";

type StorySeoInput = Pick<
  Article,
  | "title"
  | "standfirst"
  | "category"
  | "kind"
  | "personCountry"
  | "personField"
  | "personRole"
  | "seoTitle"
  | "seoDescription"
  | "seoKeywords"
>;

export function getStorySeo(article: StorySeoInput) {
  const keywords = article.seoKeywords?.filter((keyword) => keyword.trim()).map((keyword) => keyword.trim());
  const biographyKeywords = article.kind === "biography"
    ? [article.personRole, article.personField, article.personCountry].filter((value): value is string => Boolean(value))
    : [];
  const derivedKeywords = [article.title, article.category, ...biographyKeywords, "mercados africanos"];

  return {
    title: article.seoTitle?.trim() || article.title,
    description: article.seoDescription?.trim() || article.standfirst,
    keywords: [...new Set(keywords?.length ? keywords : derivedKeywords)],
  };
}
