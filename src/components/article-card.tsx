import { ArrowUpRight, Clock3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/content";

export function ArticleCard({
  article,
  featured = false,
}: {
  article: Article;
  featured?: boolean;
}) {
  return (
    <article className={`article-card${featured ? " article-card-featured" : ""}`}>
      <Link
        href={`/artigos/${article.slug}`}
        className="article-image-link"
        aria-label={`Ler: ${article.title}`}
      >
        <div className="article-image">
          <Image
            src={article.image}
            alt={article.imageAlt}
            fill
            sizes={featured ? "(max-width: 760px) 100vw, 58vw" : "(max-width: 760px) 100vw, 33vw"}
          />
          <span className="image-arrow" aria-hidden="true">
            <ArrowUpRight size={18} />
          </span>
        </div>
      </Link>
      <div className="article-card-copy">
        <div className="card-meta">
          <span className="category-label">{article.category}</span>
          <span className="meta-dot" aria-hidden="true" />
          <span>{article.date}</span>
        </div>
        <h3>
          <Link href={`/artigos/${article.slug}`}>{article.title}</Link>
        </h3>
        {featured && <p className="article-card-standfirst">{article.standfirst}</p>}
        <div className="article-card-byline">
          <span>{article.author}</span>
          <span className="reading-time"><Clock3 size={13} /> {article.readingTime}</span>
        </div>
      </div>
    </article>
  );
}
