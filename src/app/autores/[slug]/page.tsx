import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, MapPin } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import { JsonLd } from "@/components/json-ld";
import { getPublicAuthor } from "@/lib/public-content";
import { getLocale } from "@/lib/locale.server";
import { createSocialPreviewUrl } from "@/lib/page-metadata";
import { getSiteUrl } from "@/lib/site-url";
import { hasContentForLocale, localizeArticle } from "@/lib/localized-editorial";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const author = await getPublicAuthor(slug);
  if (!author) return { title: "Autor não encontrado", robots: { index: false, follow: false } };
  const locale = await getLocale();
  const description = locale === "en"
    ? `Articles and perspectives from ${author.name} at Kioo Africa.`
    : author.biography || `Artigos e perspetivas de ${author.name} na Kioo Africa.`;
  const fallbackImage = createSocialPreviewUrl({
    locale,
    kind: "profile",
    eyebrow: locale === "en" ? "KIOO AFRICA CONTRIBUTOR" : "AUTOR KIOO AFRICA",
    title: author.name,
    description,
  });
  const image = author.imageUrl ?? fallbackImage;
  return {
    title: author.name,
    description,
    alternates: { canonical: `/autores/${slug}` },
    openGraph: {
      type: "profile",
      title: author.name,
      description,
      url: `/autores/${slug}`,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: author.name,
      description,
      images: [image],
    },
  };
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params;
  const author = await getPublicAuthor(slug);
  if (!author) notFound();
  const locale = await getLocale();
  const en = locale === "en";
  const biography = en
    ? `${author.name} is a Kioo Africa contributor. Explore their published stories and perspectives on African markets.`
    : author.biography || "Autor e colaborador da Kioo Africa.";
  const authorArticles = author.articles
    .filter((article) => hasContentForLocale(article, locale))
    .map((article) => localizeArticle(article, locale));
  const siteUrl = getSiteUrl();
  const url = new URL(`/autores/${slug}`, siteUrl).toString();
  return (
    <article className="author-detail section-pad">
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        url,
        mainEntityOfPage: url,
        mainEntity: {
          "@type": "Person",
          name: author.name,
          description: biography,
          ...(author.imageUrl ? { image: author.imageUrl } : {}),
          ...(author.countryCode ? { homeLocation: { "@type": "Place", addressCountry: author.countryCode } } : {}),
        },
        publisher: { "@id": `${siteUrl.origin}#organization` },
      }} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: en ? "Home" : "Início", item: siteUrl.origin },
          { "@type": "ListItem", position: 2, name: en ? "Contributors" : "Autores", item: new URL("/autores", siteUrl).toString() },
          { "@type": "ListItem", position: 3, name: author.name, item: url },
        ],
      }} />
      <nav className="story-breadcrumb"><Link href="/autores"><ArrowLeft size={14} /> {en ? "All contributors" : "Todos os autores"}</Link><span> / </span><span>{en ? "Profile" : "Perfil"}</span></nav>
      <header className="author-detail-header">
        <span className="byline-avatar" aria-hidden="true">{author.name.slice(0, 1).toUpperCase()}</span>
        <span className="section-kicker">{en ? "CONTRIBUTOR / KIOO AFRICA" : "AUTOR / KIOO AFRICA"}</span>
        <h1>{author.name}</h1>
        {author.countryCode && <p className="profile-location"><MapPin size={14} /> {author.countryCode}</p>}
        <p>{biography}</p>
        {author.articleCount > 0 && <span className="author-count">{author.articleCount} {author.articleCount === 1
          ? (en ? "published article" : "artigo publicado")
          : (en ? "published articles" : "artigos publicados")}</span>}
      </header>
      <section className="entity-related">
        <div className="section-heading"><div><span className="section-kicker">{en ? "PUBLISHED BY KIOO AFRICA" : "PUBLICADO NA KIOO AFRICA"}</span><h2>{en ? <>Ideas with<br /><em>context.</em></> : <>Ideias com<br /><em>contexto.</em></>}</h2></div><Link className="text-link" href="/artigos">{en ? "Explore articles" : "Explorar artigos"} <ArrowUpRight size={14} /></Link></div>
        {authorArticles.length > 0 ? <div className="article-grid">{authorArticles.map((article) => <ArticleCard key={article.slug} article={article} locale={locale} />)}</div> : <p className="workspace-empty">{en ? "No English-language stories are available for this contributor yet." : "Este autor ainda não tem artigos publicados."}</p>}
      </section>
    </article>
  );
}
