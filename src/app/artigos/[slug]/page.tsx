import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, Clock3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleInteractions } from "@/components/article-interactions";
import { ArticleMarkdown } from "@/components/article-markdown";
import { ArticleCard } from "@/components/article-card";
import { JsonLd } from "@/components/json-ld";
import { getPublishedArticle, getPublishedArticles } from "@/lib/public-content";
import { getStorySeo } from "@/lib/story-seo";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

function getArticleContent(article: NonNullable<Awaited<ReturnType<typeof getPublishedArticle>>>) {
  return article.markdown
    ?? article.body?.map((block) => `${block.heading ? `## ${block.heading}\n\n` : ""}${block.text}`).join("\n\n")
    ?? "";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);
  if (!article) return { title: "Artigo não encontrado", robots: { index: false, follow: false } };
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://msingi.africa";
  const seo = getStorySeo(article);
  const canonical = article.canonicalUrl?.trim() || `/artigos/${article.slug}`;
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: { canonical: new URL(canonical, siteUrl).toString() },
    openGraph: {
      type: "article",
      title: seo.title,
      description: seo.description,
      url: new URL(canonical, siteUrl).toString(),
      images: [{ url: article.image, alt: article.imageAlt }],
      ...(article.publishedAt ? { publishedTime: article.publishedAt } : {}),
      ...(article.modifiedAt ? { modifiedTime: article.modifiedAt } : {}),
    },
    twitter: { card: "summary_large_image", title: seo.title, description: seo.description, images: [article.image] },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);
  if (!article) notFound();

  const [allArticles] = await Promise.all([getPublishedArticles()]);
  const relatedArticles = allArticles.filter((item) => item.slug !== slug).slice(0, 3);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://msingi.africa";
  const articleUrl = new URL(`/artigos/${article.slug}`, siteUrl).toString();
  const content = getArticleContent(article);
  const seo = getStorySeo(article);
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    alternativeHeadline: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    image: [article.image],
    inLanguage: "pt-AO",
    articleSection: article.category,
    wordCount: content.trim().split(/\s+/).filter(Boolean).length,
    isAccessibleForFree: true,
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
    author: { "@type": "Person", name: article.author, ...(article.authorSlug ? { url: new URL(`/autores/${article.authorSlug}`, siteUrl).toString() } : {}) },
    publisher: {
      "@type": "Organization",
      name: "Bantaba Africa",
      url: siteUrl,
      logo: { "@type": "ImageObject", url: new URL("/brand-mark.svg", siteUrl).toString() },
    },
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
          { "@type": "ListItem", position: 1, name: "Início", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Artigos", item: new URL("/artigos", siteUrl).toString() },
          { "@type": "ListItem", position: 3, name: article.title, item: articleUrl },
        ],
      }} />
      <div className="story-breadcrumb"><Link href="/artigos"><ArrowLeft size={14} /> Todos os artigos</Link><span> / </span><span>{article.category}</span></div>
      <header className="story-header">
        <span className="category-label">{article.isSponsored ? "Patrocinado" : article.category}</span>
        <h1>{article.title}</h1>
        <p className="story-standfirst">{article.standfirst}</p>
        <div className="story-byline">
          <div className="byline-avatar" aria-hidden="true">{article.author.trim().slice(0, 1).toUpperCase()}</div>
          <div>
            <strong>{article.authorSlug ? <Link href={`/autores/${article.authorSlug}`}>{article.author}</Link> : article.author}</strong>
            <span>{article.kind === "biography" ? "Perfil biográfico" : article.isSponsored ? "Parceria identificada" : "Redação Bantaba Africa"}</span>
          </div>
          <span className="byline-divider" />
          <div className="story-date">{article.date}</div>
          <span className="reading-time"><Clock3 size={14} /> {article.readingTime}</span>
        </div>
      </header>
      <figure className="story-cover">
        <Image src={article.image} alt={article.imageAlt} fill priority sizes="100vw" unoptimized={Boolean(article.id)} />
        <figcaption>{article.imageAlt} · Imagem ilustrativa.</figcaption>
      </figure>
      <div className="story-body-layout">
        <aside className="story-aside"><span>BA / JOURNAL</span><span>UMA LEITURA<br />COM CONTEXTO.</span><Link href="/sobre">Os nossos princípios <ArrowUpRight size={14} /></Link></aside>
        <div className="story-body">
          <ArticleMarkdown content={content} />
          {article.sources && article.sources.length > 0 && (
            <section className="article-sources">
              <h2>Fontes e referências</h2>
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
              ? article.sponsorDisclosure ?? "Conteúdo patrocinado. A parceria comercial é identificada e não determina decisões de cobertura editorial."
              : "Reportagem editorial independente. As decisões de cobertura da Bantaba Africa não são influenciadas por anunciantes."}</p>
          </div>
        </div>
      </div>
      <div className="section-pad"><ArticleInteractions articleId={article.id} title={article.title} /></div>
      <section className="related-stories section-pad">
        <div className="section-heading"><div><span className="section-kicker">CONTINUE A EXPLORAR</span><h2>Mais histórias,<br />mais <em>perspetivas.</em></h2></div><Link href="/artigos" className="text-link">Todos os artigos <ArrowUpRight size={15} /></Link></div>
        <div className="article-grid">{relatedArticles.map((item) => <ArticleCard key={item.slug} article={item} />)}</div>
      </section>
    </article>
  );
}
