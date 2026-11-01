import { ArrowUpRight, Clock3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/content";
import { localizeCategory, translate, type Locale } from "@/lib/i18n";

export function ArticleCard({
  article,
  featured = false,
  locale = "en",
}: {
  article: Article;
  featured?: boolean;
  locale?: Locale;
}) {
  return (
    <article className={`article-card${featured ? " article-card-featured" : ""}`}>
      <Link
        href={`/artigos/${article.slug}`}
        className="article-image-link"
        aria-label={locale === "en" ? `Read: ${article.title}` : `Ler: ${article.title}`}
      >
        <div className="article-image">
          <Image
            src={article.image}
            alt={article.imageAlt}
            fill
            sizes={featured ? "(max-width: 760px) 100vw, 58vw" : "(max-width: 760px) 100vw, 33vw"}
          />
          <span className="article-image-category">{localizeCategory(article.category, locale)}</span>
          {article.isSponsored && <span className="article-image-sponsored">{locale === "en" ? "Sponsored" : "Patrocinado"}</span>}
          <span className="image-arrow" aria-hidden="true">
            <ArrowUpRight size={18} />
          </span>
        </div>
      </Link>
      <div className="article-card-copy">
        <div className="card-meta">
          <span>{article.date}</span>
          {article.kind === "biography" && <span className="article-kind-label">{translate(locale, "biographyLabel")}</span>}
        </div>
        <h3>
          <Link href={`/artigos/${article.slug}`}>{article.title}</Link>
        </h3>
        <p className="article-card-standfirst">{article.standfirst}</p>
        <div className="article-card-byline">
          <span>{article.author}</span>
          <span className="reading-time"><Clock3 size={13} /> {article.readingTime.replace(/min de leitura/i, translate(locale, "readingMinutes"))}</span>
        </div>
      </div>
    </article>
  );
}
