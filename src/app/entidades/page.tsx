import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Building2, Package, UserRound } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { getPublicEntities } from "@/lib/public-content";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Empresas, pessoas e produtos africanos",
  description: "Explore perfis e entidades ligadas às histórias e aos mercados acompanhados pela Msingi Africa.",
  alternates: { canonical: "/entidades" },
};

const icons = { person: UserRound, company: Building2, organization: Building2, market: Building2, product: Package };

export default async function EntitiesPage() {
  const entities = await getPublicEntities();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://msingi.africa";
  return (
    <section className="archive-content section-pad entities-page">
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Entidades e produtos Msingi Africa",
        itemListElement: entities.map((entity, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: new URL(`/entidades/${entity.slug}`, siteUrl).toString(),
          name: entity.name,
        })),
      }} />
      <header className="archive-masthead entities-masthead">
        <span className="section-kicker">O ECOSSISTEMA EM CONTEXTO</span>
        <div className="archive-masthead-row"><div><h1>Nomes que<br /><em>movem mercados.</em></h1><p>Perfis de pessoas, organizações, empresas e produtos que ajudam a explicar as mudanças no continente.</p></div></div>
      </header>
      {entities.length === 0 ? <p className="workspace-empty">Ainda não há entidades publicadas.</p> : (
        <div className="entity-grid">{entities.map((entity) => {
          const Icon = icons[entity.type];
          return (
            <article className="entity-card" key={entity.slug}>
              <span className="entity-icon"><Icon size={20} /></span>
              <span className="section-kicker">{entity.type.toUpperCase()}{entity.verified ? " · VERIFICADO" : ""}</span>
              <h2><Link href={`/entidades/${entity.slug}`}>{entity.name}</Link></h2>
              <p>{entity.description}</p>
              <Link className="text-link" href={`/entidades/${entity.slug}`}>Ver perfil <ArrowUpRight size={14} /></Link>
            </article>
          );
        })}</div>
      )}
    </section>
  );
}
