import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Building2, ExternalLink, Package, UserRound } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { getPublicEntities, getPublishedBiographies } from "@/lib/public-content";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Empresas, pessoas e produtos africanos",
  description: "Explore perfis e entidades ligadas às histórias e aos mercados acompanhados pela Kioo Africa.",
  alternates: { canonical: "/entidades" },
};

const icons = { person: UserRound, company: Building2, organization: Building2, market: Building2, product: Package };

export default async function EntitiesPage() {
  const [entities, publishedBiographies] = await Promise.all([
    getPublicEntities(),
    getPublishedBiographies(),
  ]);
  const featuredPeople = publishedBiographies.filter((person) => person.spotlight);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://msingi.africa";
  return (
    <section className="archive-content section-pad entities-page">
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "ItemList",
            name: "Entidades e produtos Kioo Africa",
            itemListElement: entities.map((entity, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: new URL(`/entidades/${entity.slug}`, siteUrl).toString(),
              name: entity.name,
            })),
          },
          {
            "@type": "ItemList",
            name: "Luzes Africanas — perfis editoriais",
            itemListElement: featuredPeople.map((person, index) => ({
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": "Person",
                name: person.name,
                url: new URL(`/biografias/${person.slug}`, siteUrl).toString(),
                image: person.portrait ? new URL(person.portrait.src, siteUrl).toString() : undefined,
                jobTitle: person.role,
                homeLocation: { "@type": "Place", name: person.country },
                ...(person.organizationUrl ? { sameAs: person.organizationUrl } : {}),
              },
            })),
          },
        ],
      }} />
      <header className="archive-masthead entities-masthead">
        <span className="section-kicker">O ECOSSISTEMA EM CONTEXTO</span>
        <div className="archive-masthead-row"><div><h1>Nomes que<br /><em>movem mercados.</em></h1><p>Perfis de pessoas, organizações, empresas e produtos que ajudam a explicar as mudanças no continente.</p></div></div>
      </header>
      {featuredPeople.length > 0 && (
        <section className="african-lights" aria-labelledby="african-lights-title">
          <div className="african-lights-heading">
            <div>
              <span className="section-kicker">RETRATOS · PERCURSOS · CONTEXTO</span>
              <h2 id="african-lights-title">Luzes <em>Africanas.</em></h2>
              <p>Uma seleção editorial de pessoas cujas trajetórias ajudam a compreender os mercados e as ideias em movimento no continente. Não é um ranking, nem uma distinção comprável.</p>
            </div>
            <span className="african-lights-mark" aria-hidden="true">✳</span>
          </div>
          <div className="african-lights-grid">
            {featuredPeople.map((person, index) => (
              <article className="african-light-card" key={person.slug}>
                <Link className="african-light-portrait" href={`/biografias/${person.slug}`} aria-label={`Ler a biografia de ${person.name}`}>
                  {person.portrait ? (
                    <Image
                      src={person.portrait.src}
                      alt={person.portrait.alt}
                      fill
                      sizes="(max-width: 760px) 100vw, (max-width: 1000px) 50vw, 25vw"
                    />
                  ) : (
                    <span aria-hidden="true">{person.monogram}</span>
                  )}
                  <span className="african-light-index">0{index + 1} / PERFIL</span>
                </Link>
                <div className="african-light-copy">
                  <div className="african-light-meta"><span>{person.country}</span><span>{person.field}</span></div>
                  <h3><Link href={`/biografias/${person.slug}`}>{person.name}</Link></h3>
                  <p className="african-light-role">{person.role}</p>
                  <p className="african-light-spotlight">{person.spotlight}</p>
                  <div className="african-light-links">
                    <Link href={`/biografias/${person.slug}`} className="text-link">Ler biografia <ArrowUpRight size={14} /></Link>
                    {person.contactUrl || person.organizationUrl ? (
                      <a href={person.contactUrl ?? person.organizationUrl} target="_blank" rel="noopener noreferrer" aria-label={`${person.contactUrl ? "Contacto oficial" : "Site oficial"} de ${person.organization ?? person.name}`}>
                        <span>{person.contactUrl ? "Contacto oficial" : "Site oficial"}</span><ExternalLink size={13} />
                      </a>
                    ) : (
                      <span className="african-light-unavailable">Contacto institucional não confirmado</span>
                    )}
                  </div>
                  {person.sources?.[0] && (
                    <p className="african-light-source">
                      Contexto: <a href={person.sources[0].url} target="_blank" rel="noopener noreferrer">{person.sources[0].publisher ?? person.sources[0].title}</a>
                    </p>
                  )}
                  {person.portrait && (
                    <p className="african-light-credit">
                      Imagem: <a href={person.portrait.sourceUrl} target="_blank" rel="noopener noreferrer">{person.portrait.credit}</a> · {person.portrait.license}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
          <p className="african-lights-disclosure">As realizações são resumidas a partir das fontes ligadas a cada perfil. Quando o canal oficial de contacto não pôde ser confirmado, isso é indicado no próprio cartão.</p>
        </section>
      )}
      {entities.length === 0 ? <p className="workspace-empty">Ainda não há entidades publicadas.</p> : (
        <section className="entity-directory" aria-labelledby="entity-directory-title">
          <div className="section-heading"><div><span className="section-kicker">ORGANIZAÇÕES · EMPRESAS · PRODUTOS</span><h2 id="entity-directory-title">O ecossistema<br /><em>em perspetiva.</em></h2></div></div>
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
        </section>
      )}
    </section>
  );
}
