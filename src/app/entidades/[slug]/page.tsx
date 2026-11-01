import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, BadgeCheck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import { JsonLd } from "@/components/json-ld";
import { getArticlesForEntity, getPublicEntity } from "@/lib/public-content";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entity = await getPublicEntity(slug);
  if (!entity) return { title: "Entidade não encontrada", robots: { index: false, follow: false } };
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://msingi.africa";
  return {
    title: entity.name,
    description: entity.description,
    alternates: { canonical: new URL(`/entidades/${slug}`, siteUrl).toString() },
    openGraph: { type: "website", title: entity.name, description: entity.description, ...(entity.imageUrl ? { images: [entity.imageUrl] } : {}) },
  };
}

export default async function EntityPage({ params }: Props) {
  const { slug } = await params;
  const [entity, relatedArticles] = await Promise.all([getPublicEntity(slug), getArticlesForEntity(slug)]);
  if (!entity) notFound();

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
        ...(entity.countryCode ? { areaServed: entity.countryCode } : {}),
        ...(entity.websiteUrl ? { sameAs: entity.websiteUrl } : {}),
        ...(productOffer ? { offers: productOffer } : {}),
        ...(entity.verified ? { additionalProperty: { "@type": "PropertyValue", name: "Verificado pela redação", value: true } } : {}),
      }} />
      <nav className="story-breadcrumb"><Link href="/entidades"><ArrowLeft size={14} /> Todas as entidades</Link><span> / </span><span>{entity.type}</span></nav>
      <header className="entity-detail-header">
        <span className="section-kicker">{entity.type.toUpperCase()}{entity.verified ? <><BadgeCheck size={14} /> PERFIL REVISTO</> : null}</span>
        <h1>{entity.name}</h1>
        <p>{entity.description}</p>
        {entity.countryCode && <span className="entity-country">ÁREA DE ATUAÇÃO · {entity.countryCode}</span>}
        {entity.websiteUrl && <a className="text-link" href={entity.websiteUrl} target="_blank" rel="noopener noreferrer">Website oficial <ArrowUpRight size={14} /></a>}
        {entity.type === "product" && entity.slug === "creator-plus" && (
          <div className="entity-product-offer"><strong>US$ 5 / mês</strong><span>Inclui ligações e fontes verificáveis nas propostas. Todas as submissões continuam sujeitas a revisão e decisão editorial.</span><Link className="button button-dark" href="/registar">Criar conta de autor <ArrowUpRight size={15} /></Link></div>
        )}
      </header>
      <section className="entity-related">
        <div className="section-heading"><div><span className="section-kicker">LIGADO À CONVERSA</span><h2>Histórias<br /><em>relacionadas.</em></h2></div><Link className="text-link" href="/artigos">Todos os artigos <ArrowUpRight size={14} /></Link></div>
        {relatedArticles.length > 0
          ? <div className="article-grid">{relatedArticles.map((article) => <ArticleCard key={article.slug} article={article} />)}</div>
          : <p className="workspace-empty">Ainda não há artigos ligados a este perfil.</p>}
      </section>
    </article>
  );
}
