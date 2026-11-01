import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, Clock3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleInteractions } from "@/components/article-interactions";
import { ArticleMarkdown } from "@/components/article-markdown";
import { ArticleCard } from "@/components/article-card";
import { JsonLd } from "@/components/json-ld";
import { getApprovedArticleComments, getPublishedArticle, getPublishedArticles } from "@/lib/public-content";
import { getStorySeo } from "@/lib/story-seo";
import { getLocale } from "@/lib/locale.server";
import { localizeCategory } from "@/lib/i18n";
import { createSocialPreviewUrl } from "@/lib/page-metadata";
import { hasEnglishArticleCopy, localizeArticle } from "@/lib/localized-editorial";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

function getArticleContent(article: NonNullable<Awaited<ReturnType<typeof getPublishedArticle>>>) {
  return article.markdown
    ?? article.body?.map((block) => `${block.heading ? `## ${block.heading}\n\n` : ""}${block.text}`).join("\n\n")
    ?? "";
}

function formatStoryDate(
  article: NonNullable<Awaited<ReturnType<typeof getPublishedArticle>>>,
  locale: "pt" | "en",
) {
  if (article.publishedAt) {
    return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "pt-PT", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(article.publishedAt));
  }
  if (locale === "pt") return article.date;
  const monthNames: Record<string, string> = {
    "jan.": "Jan", "fev.": "Feb", "mar.": "Mar", "abr.": "Apr",
    "mai.": "May", "jun.": "Jun", "jul.": "Jul", "ago.": "Aug",
    "set.": "Sep", "out.": "Oct", "nov.": "Nov", "dez.": "Dec",
  };
  return article.date.replace(/\b(?:jan\.|fev\.|mar\.|abr\.|mai\.|jun\.|jul\.|ago\.|set\.|out\.|nov\.|dez\.)/i, (month) => monthNames[month.toLowerCase()] ?? month);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);
  if (!article) return { title: "Artigo não encontrado", robots: { index: false, follow: false } };
  const [locale] = await Promise.all([getLocale()]);
  const en = locale === "en";
  const localizedArticle = localizeArticle(article, locale);
  const hasEnglishCopy = hasEnglishArticleCopy(article.slug);
  const seo = getStorySeo(en && hasEnglishCopy
    ? { ...localizedArticle, seoTitle: null, seoDescription: null }
    : article);
  const siteUrl = getSiteUrl();
  const canonical = new URL(article.canonicalUrl?.trim() || `/artigos/${article.slug}`, siteUrl).toString();
  const socialImage = createSocialPreviewUrl({
    locale,
    kind: "article",
    eyebrow: en ? "AFRICAN MARKETS · ANALYSIS" : "MERCADOS AFRICANOS · ANÁLISE",
    title: seo.title,
    description: seo.description,
    image: article.image,
  });
  return {
    title: seo.title,
    description: seo.description,
    keywords: en && hasEnglishCopy
      ? [seo.title, localizeCategory(article.category, locale), "African markets", "Africa"]
      : seo.keywords,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: seo.title,
      description: seo.description,
      url: canonical,
      siteName: "Kioo Africa",
      locale: en ? "en_GB" : "pt_AO",
      images: [{ url: socialImage, width: 1200, height: 630, alt: seo.title }],
      ...(article.publishedAt ? { publishedTime: article.publishedAt } : {}),
      ...(article.modifiedAt ? { modifiedTime: article.modifiedAt } : {}),
    },
    twitter: { card: "summary_large_image", title: seo.title, description: seo.description, images: [socialImage] },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);
  if (!article) notFound();

  const [allArticles, locale] = await Promise.all([getPublishedArticles(), getLocale()]);
  const en = locale === "en";
  const displayArticle = localizeArticle(article, locale);
  const hasEnglishCopy = hasEnglishArticleCopy(article.slug);
  const relatedArticles = allArticles.filter((item) => item.slug !== slug).slice(0, 3);
  const siteUrl = getSiteUrl();
  const articleUrl = new URL(article.canonicalUrl?.trim() || `/artigos/${article.slug}`, siteUrl).toString();
  const initialComments = article.id
    ? await getApprovedArticleComments(article.id)
    : { comments: [], totalCount: 0 };
  const content = getArticleContent(displayArticle);
  const seo = getStorySeo(article);
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: displayArticle.title,
    alternativeHeadline: seo.title,
    description: displayArticle.standfirst,
    keywords: en && hasEnglishCopy
      ? [seo.title, localizeCategory(article.category, locale), "African markets", "Africa"]
      : seo.keywords,
    image: [article.image],
    inLanguage: en && hasEnglishCopy ? "en" : "pt-AO",
    articleSection: localizeCategory(article.category, locale),
    wordCount: content.trim().split(/\s+/).filter(Boolean).length,
    isAccessibleForFree: true,
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
    author: article.authorSlug
      ? { "@type": "Person", name: article.author, url: new URL(`/autores/${article.authorSlug}`, siteUrl).toString() }
      : { "@id": `${siteUrl.origin}#organization` },
    publisher: {
      "@type": "Organization",
      name: "Kioo Africa",
      url: siteUrl.origin,
      logo: { "@type": "ImageObject", url: new URL("/brand-mark.svg", siteUrl).toString() },
    },
    ...(article.partnerName ? {
      sponsor: { "@type": "Organization", name: article.partnerName },
    } : {}),
    ...(article.publishedAt ? { datePublished: article.publishedAt } : {}),
    ...(article.modifiedAt ? { dateModified: article.modifiedAt } : {}),
  };

  return (
    <article className="story-page">
      <JsonLd data={jsonLd} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: en ? "Home" : "Início", item: siteUrl.origin },
          { "@type": "ListItem", position: 2, name: en ? "Articles" : "Artigos", item: new URL("/artigos", siteUrl).toString() },
          { "@type": "ListItem", position: 3, name: displayArticle.title, item: articleUrl },
        ],
      }} />
      <div className="story-breadcrumb"><Link href="/artigos"><ArrowLeft size={14} /> {en ? "All articles" : "Todos os artigos"}</Link><span> / </span><span>{localizeCategory(article.category, locale)}</span></div>
      <header className="story-header">
        <span className="category-label">{article.isSponsored
          ? article.partnerName
            ? (en ? "Disclosed partnership" : "Parceria divulgada")
            : (en ? "Sponsored" : "Patrocinado")
          : localizeCategory(article.category, locale)}</span>
        <h1>{displayArticle.title}</h1>
        <p className="story-standfirst">{displayArticle.standfirst}</p>
        <div className="story-byline">
          <div className="byline-avatar" aria-hidden="true">{displayArticle.author.trim().slice(0, 1).toUpperCase()}</div>
          <div>
            <strong>{article.authorSlug ? <Link href={`/autores/${article.authorSlug}`}>{displayArticle.author}</Link> : displayArticle.author}</strong>
            <span>{article.kind === "biography"
              ? (en ? "Biographical profile" : "Perfil biográfico")
              : article.isSponsored
              ? (en
                ? `Disclosed partnership${article.partnerName ? ` · ${article.partnerName}` : ""}`
                : `Parceria divulgada${article.partnerName ? ` · ${article.partnerName}` : ""}`)
                : (en ? "Kioo Africa Editorial" : "Redação Kioo Africa")}</span>
          </div>
          <span className="byline-divider" />
          <div className="story-date">{formatStoryDate(displayArticle, locale)}</div>
          <span className="reading-time"><Clock3 size={14} /> {displayArticle.readingTime.replace(/min de leitura/i, en ? "min read" : "min de leitura")}</span>
        </div>
      </header>
      <figure className="story-cover">
        <Image src={article.image} alt={displayArticle.imageAlt} fill priority sizes="100vw" unoptimized={Boolean(article.id)} />
        {article.partnerName && article.partnerLogoUrl && (
          <div className="story-partner-mark">
            <Image src={article.partnerLogoUrl} alt="" width={38} height={38} />
            <span>
              <small>{en ? "DISCLOSED PARTNERSHIP" : "PARCERIA IDENTIFICADA"}</small>
              <strong>{article.partnerName}</strong>
            </span>
          </div>
        )}
        <figcaption>{displayArticle.imageAlt} · {article.partnerName
          ? (en ? "Illustrative image; the partner logo is identified separately." : "Imagem ilustrativa; o logótipo da parceira é identificado separadamente.")
          : (en ? "Illustrative image." : "Imagem ilustrativa.")}</figcaption>
      </figure>
      <div className="story-body-layout">
        <aside className="story-aside"><span>KIOO / JOURNAL</span><span>{en ? <>READING<br />WITH CONTEXT.</> : <>UMA LEITURA<br />COM CONTEXTO.</>}</span><Link href="/sobre">{en ? "Our principles" : "Os nossos princípios"} <ArrowUpRight size={14} /></Link></aside>
        <div className="story-body">
          {en && !hasEnglishCopy && <p className="original-language-note">This article is available in its original language.</p>}
          <ArticleMarkdown content={content} />
          {article.sources && article.sources.length > 0 && (
            <section className="article-sources">
              <h2>{en ? "Sources and references" : "Fontes e referências"}</h2>
              <ol>{article.sources.map((source) => (
                <li key={`${source.url}-${source.title}`}>
                  <a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a>
                  {source.publisher && <span> · {source.publisher}</span>}
                </li>
              ))}</ol>
            </section>
          )}
          <div className={`story-disclosure${article.isSponsored ? " disclosure-sponsored" : ""}`}>
            <span>✳</span>
            <p>{article.isSponsored
                ? article.sponsorDisclosure ?? (en
                  ? "Sponsored content. This commercial partnership is clearly labelled and does not determine editorial coverage."
                  : "Conteúdo patrocinado. A parceria comercial é identificada e não determina decisões de cobertura editorial.")
                : en
                  ? "Independent editorial reporting. Kioo Africa's coverage decisions are not influenced by advertisers."
                  : "Reportagem editorial independente. As decisões de cobertura da Kioo Africa não são influenciadas por anunciantes."}</p>
          </div>
        </div>
      </div>
      <div className="section-pad">
        <ArticleInteractions
          articleId={article.id}
          title={displayArticle.title}
          shareUrl={articleUrl}
          returnPath={`/artigos/${article.slug}`}
          initialComments={initialComments.comments}
          initialCommentCount={initialComments.totalCount}
          locale={locale}
        />
      </div>
      <section className="related-stories section-pad">
        <div className="section-heading"><div><span className="section-kicker">{en ? "KEEP EXPLORING" : "CONTINUE A EXPLORAR"}</span><h2>{en ? <>More stories,<br />more <em>perspectives.</em></> : <>Mais histórias,<br />mais <em>perspetivas.</em></>}</h2></div><Link href="/artigos" className="text-link">{en ? "All articles" : "Todos os artigos"} <ArrowUpRight size={15} /></Link></div>
        <div className="article-grid">{relatedArticles.map((item) => <ArticleCard key={item.slug} article={item} locale={locale} />)}</div>
      </section>
    </article>
  );
}
