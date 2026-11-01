import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, BadgeCheck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import { JsonLd } from "@/components/json-ld";
import { getArticlesForEntity, getPublicEntity } from "@/lib/public-content";
import { getLocale } from "@/lib/locale.server";
import { createSocialPreviewUrl } from "@/lib/page-metadata";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entity = await getPublicEntity(slug);
  if (!entity) return { title: "Entidade não encontrada", robots: { index: false, follow: false } };
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://msingi.africa";
  const locale = await getLocale();
  const fallbackImage = createSocialPreviewUrl({
    locale,
    kind: entity.type === "product" ? "product" : "entities",
    eyebrow: entity.type === "product"
      ? (locale === "en" ? "KIOO AFRICA PRODUCT" : "PRODUTO KIOO AFRICA")
      : (locale === "en" ? "AFRICAN ECOSYSTEM" : "ECOSSISTEMA AFRICANO"),
    title: entity.name,
    description: entity.description,
  });
  const image = entity.imageUrl ?? fallbackImage;
  return {
    title: entity.name,
    description: entity.description,
    alternates: { canonical: new URL(`/entidades/${slug}`, siteUrl).toString() },
    openGraph: {
      type: "website",
      title: entity.name,
      description: entity.description,
      url: new URL(`/entidades/${slug}`, siteUrl).toString(),
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: entity.name,
      description: entity.description,
      images: [image],
    },
  };
}

export default async function EntityPage({ params }: Props) {
  const { slug } = await params;
  const [entity, relatedArticles] = await Promise.all([getPublicEntity(slug), getArticlesForEntity(slug)]);
  if (!entity) notFound();

  const locale = await getLocale();
  const en = locale === "en";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://msingi.africa";
  const entityUrl = new URL(`/entidades/${entity.slug}`, siteUrl).toString();
  const schemaType = entity.type === "person"
    ? "Person"
    : entity.type === "product"
      ? "Product"
      : entity.type === "market"
        ? "Place"
        : "Organization";
  const productOffer = entity.slug === "creator-plus"
    ? {
        "@type": "Offer",
        price: "5.00",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url: new URL("/registar", siteUrl).toString(),
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "5.00",
          priceCurrency: "USD",
          billingDuration: "P1M",
        },
      }
    : undefined;

  return (
    <article className="entity-detail section-pad">
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": schemaType,
        name: entity.name,
        description: entity.description,
        url: entityUrl,
        ...(entity.imageUrl ? { image: entity.imageUrl } : {}),
        ...(entity.countryCode ? { areaServed: { "@type": "Country", identifier: entity.countryCode } } : {}),
        ...(entity.websiteUrl ? { sameAs: entity.websiteUrl } : {}),
        ...(productOffer ? { offers: productOffer } : {}),
        ...(entity.verified ? { additionalProperty: { "@type": "PropertyValue", name: en ? "Verified by the newsroom" : "Verificado pela redação", value: true } } : {}),
      }} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: en ? "Home" : "Início", item: siteUrl },
          { "@type": "ListItem", position: 2, name: en ? "Organisations" : "Entidades", item: new URL("/entidades", siteUrl).toString() },
          { "@type": "ListItem", position: 3, name: entity.name, item: entityUrl },
        ],
      }} />
      <nav className="story-breadcrumb"><Link href="/entidades"><ArrowLeft size={14} /> {en ? "All organisations" : "Todas as entidades"}</Link><span> / </span><span>{en
        ? ({ person: "Person", company: "Company", organization: "Organisation", market: "Market", product: "Product" } as const)[entity.type]
        : entity.type}</span></nav>
      <header className="entity-detail-header">
        <span className="section-kicker">{(en
          ? ({ person: "PERSON", company: "COMPANY", organization: "ORGANISATION", market: "MARKET", product: "PRODUCT" } as const)[entity.type]
          : entity.type.toUpperCase())}{entity.verified ? <><BadgeCheck size={14} /> {en ? "REVIEWED PROFILE" : "PERFIL REVISTO"}</> : null}</span>
        <h1>{entity.name}</h1>
        <p>{entity.description}</p>
        {entity.countryCode && <span className="entity-country">{en ? "AREA OF OPERATION" : "ÁREA DE ATUAÇÃO"} · {entity.countryCode}</span>}
        {entity.websiteUrl && <a className="text-link" href={entity.websiteUrl} target="_blank" rel="noopener noreferrer">{en ? "Official website" : "Website oficial"} <ArrowUpRight size={14} /></a>}
        {entity.type === "product" && entity.slug === "creator-plus" && (
          <div className="entity-product-offer"><strong>US$ 5 / {en ? "month" : "mês"}</strong><span>{en
            ? "Include links and verifiable sources in submissions. Every submission remains subject to editorial review and decision."
            : "Inclui ligações e fontes verificáveis nas propostas. Todas as submissões continuam sujeitas a revisão e decisão editorial."}</span><Link className="button button-dark" href="/registar">{en ? "Create a creator account" : "Criar conta de autor"} <ArrowUpRight size={15} /></Link></div>
        )}
      </header>
      <section className="entity-related">
        <div className="section-heading"><div><span className="section-kicker">{en ? "PART OF THE CONVERSATION" : "LIGADO À CONVERSA"}</span><h2>{en ? <>Related<br /><em>stories.</em></> : <>Histórias<br /><em>relacionadas.</em></>}</h2></div><Link className="text-link" href="/artigos">{en ? "All articles" : "Todos os artigos"} <ArrowUpRight size={14} /></Link></div>
        {relatedArticles.length > 0
          ? <div className="article-grid">{relatedArticles.map((article) => <ArticleCard key={article.slug} article={article} locale={locale} />)}</div>
          : <p className="workspace-empty">{en ? "No articles are linked to this profile yet." : "Ainda não há artigos ligados a este perfil."}</p>}
      </section>
    </article>
  );
}
