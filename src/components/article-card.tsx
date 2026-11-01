import { ArrowUpRight, Clock3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/content";
import { localizeCategory, translate, type Locale } from "@/lib/i18n";
import { localizeArticle } from "@/lib/localized-editorial";

export function ArticleCard({
  article,
  featured = false,
  locale = "en",
}: {
  article: Article;
  featured?: boolean;
  locale?: Locale;
}) {
  const localizedArticle = localizeArticle(article, locale);
  return (
    <article className={`article-card${featured ? " article-card-featured" : ""}`}>
      <Link
        href={`/artigos/${localizedArticle.slug}`}
        className="article-image-link"
        aria-label={locale === "en" ? `Read: ${localizedArticle.title}` : `Ler: ${localizedArticle.title}`}
      >
        <div className="article-image">
          <Image
            src={localizedArticle.image}
            alt={localizedArticle.imageAlt}
            fill
            sizes={featured ? "(max-width: 760px) 100vw, 58vw" : "(max-width: 760px) 100vw, 33vw"}
          />
          <span className="article-image-category">{localizeCategory(localizedArticle.category, locale)}</span>
          {localizedArticle.isSponsored && <span className="article-image-sponsored">{locale === "en" ? "Sponsored" : "Patrocinado"}</span>}
          <span className="image-arrow" aria-hidden="true">
            <ArrowUpRight size={18} />
          </span>
        </div>
      </Link>
      <div className="article-card-copy">
        <div className="card-meta">
          <span>{localizedArticle.date}</span>
          {localizedArticle.kind === "biography" && <span className="article-kind-label">{translate(locale, "biographyLabel")}</span>}
        </div>
        <h3>
          <Link href={`/artigos/${localizedArticle.slug}`}>{localizedArticle.title}</Link>
        </h3>
        <p className="article-card-standfirst">{localizedArticle.standfirst}</p>
        <div className="article-card-byline">
          <span>{locale === "en" && localizedArticle.author === "Redação Kioo" ? "Kioo Africa Editorial" : localizedArticle.author}</span>
          <span className="reading-time"><Clock3 size={13} /> {localizedArticle.readingTime.replace(/min de leitura/i, translate(locale, "readingMinutes"))}</span>
        </div>
      </div>
    </article>
  );
}
