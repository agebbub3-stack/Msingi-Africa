import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Building2, ExternalLink, Package, UserRound } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { getPublicEntities, getPublishedBiographies } from "@/lib/public-content";
import { getLocale } from "@/lib/locale.server";
import { createPageMetadata } from "@/lib/page-metadata";
import { getSiteUrl } from "@/lib/site-url";
import { localizeEntity } from "@/lib/localized-entities";
import { localizeBiography } from "@/lib/localized-editorial";
import { localizeCategory, localizeCountry } from "@/lib/i18n";

export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const en = locale === "en";
  return createPageMetadata({
    locale,
    kind: "entities",
    path: "/entidades",
    eyebrow: locale === "en" ? "AFRICAN COMPANIES · PEOPLE · PRODUCTS" : "EMPRESAS · PESSOAS · PRODUTOS AFRICANOS",
    title: en ? "African companies, people and products" : "Empresas, pessoas e produtos africanos",
    description: en
      ? "Explore profiles and organisations connected to the stories and markets followed by Kioo Africa."
      : "Explore perfis e entidades ligadas às histórias e aos mercados acompanhados pela Kioo Africa.",
  });
}

const icons = { person: UserRound, company: Building2, organization: Building2, market: Building2, product: Package };

export default async function EntitiesPage() {
  const [entities, publishedBiographies, locale] = await Promise.all([
    getPublicEntities(),
    getPublishedBiographies(),
    getLocale(),
  ]);
  const en = locale === "en";
  const featuredPeople = publishedBiographies.filter((person) => person.spotlight && !person.isSponsored);
  const siteUrl = getSiteUrl();
  return (
    <section className="archive-content section-pad entities-page">
      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "ItemList",
            name: en ? "Kioo Africa organisations and products" : "Entidades e produtos Kioo Africa",
            itemListElement: entities.map((entity, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: new URL(`/entidades/${entity.slug}`, siteUrl).toString(),
              name: entity.name,
            })),
          },
          {
            "@type": "ItemList",
            name: en ? "African Lights — editorial profiles" : "Luzes Africanas — perfis editoriais",
            itemListElement: featuredPeople.map((person, index) => ({
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": "Person",
                name: person.name,
                url: new URL(`/biografias/${person.slug}`, siteUrl).toString(),
                image: person.portrait ? new URL(person.portrait.src, siteUrl).toString() : undefined,
                jobTitle: localizeBiography(person, locale).role,
                homeLocation: { "@type": "Place", name: localizeCountry(person.country, locale) },
                ...(person.organizationUrl ? { sameAs: person.organizationUrl } : {}),
              },
            })),
          },
        ],
      }} />
      <header className="archive-masthead entities-masthead">
        <span className="section-kicker">{en ? "THE ECOSYSTEM IN CONTEXT" : "O ECOSSISTEMA EM CONTEXTO"}</span>
        <div className="archive-masthead-row"><div>
          <h1>{en ? <>Names that<br /><em>move markets.</em></> : <>Nomes que<br /><em>movem mercados.</em></>}</h1>
          <p>{en
            ? "Profiles of people, organisations, companies and products that help explain change across the continent."
            : "Perfis de pessoas, organizações, empresas e produtos que ajudam a explicar as mudanças no continente."}</p>
        </div></div>
      </header>
      {featuredPeople.length > 0 && (
        <section className="african-lights" aria-labelledby="african-lights-title">
          <div className="african-lights-heading">
            <div>
              <span className="section-kicker">{en ? "PORTRAITS · JOURNEYS · CONTEXT" : "RETRATOS · PERCURSOS · CONTEXTO"}</span>
              <h2 id="african-lights-title">{en ? <>African <em>Lights.</em></> : <>Luzes <em>Africanas.</em></>}</h2>
              <p>{en
                ? "An editorial selection of people whose journeys help us understand the continent's markets and ideas in motion. It is neither a ranking nor a purchasable distinction."
                : "Uma seleção editorial de pessoas cujas trajetórias ajudam a compreender os mercados e as ideias em movimento no continente. Não é um ranking, nem uma distinção comprável."}</p>
            </div>
            <span className="african-lights-mark" aria-hidden="true">✳</span>
          </div>
          <div className="african-lights-grid">
            {featuredPeople.map((person, index) => {
              const localizedPerson = localizeBiography(person, locale);
              return (
              <article className="african-light-card" key={person.slug}>
                <Link className="african-light-portrait" href={`/biografias/${person.slug}`} aria-label={`${en ? "Read" : "Ler"} ${en ? `${person.name}'s biography` : `a biografia de ${person.name}`}`}>
                  {person.portrait ? (
                    <Image
                      src={person.portrait.src}
                      alt={localizedPerson.portrait?.alt ?? person.portrait.alt}
                      fill
                      sizes="(max-width: 760px) 100vw, (max-width: 1000px) 50vw, 25vw"
                    />
                  ) : (
                    <span aria-hidden="true">{person.monogram}</span>
                  )}
                  <span className="african-light-index">0{index + 1} / {en ? "PROFILE" : "PERFIL"}</span>
                </Link>
                <div className="african-light-copy">
                  <div className="african-light-meta"><span>{localizeCountry(person.country, locale)}</span><span>{localizeCategory(person.field, locale)}</span></div>
                  <h3><Link href={`/biografias/${person.slug}`}>{person.name}</Link></h3>
                  <p className="african-light-role">{localizedPerson.role}</p>
                  <p className="african-light-spotlight">{localizedPerson.spotlight}</p>
                  <div className="african-light-links">
                    <Link href={`/biografias/${person.slug}`} className="text-link">{en ? "Read biography" : "Ler biografia"} <ArrowUpRight size={14} /></Link>
                    {person.contactUrl || person.organizationUrl ? (
                      <a href={person.contactUrl ?? person.organizationUrl} target="_blank" rel="noopener noreferrer" aria-label={`${person.contactUrl ? (en ? "Official contact" : "Contacto oficial") : (en ? "Official website" : "Site oficial")} ${en ? "for" : "de"} ${person.organization ?? person.name}`}>
                        <span>{person.contactUrl ? (en ? "Official contact" : "Contacto oficial") : (en ? "Official website" : "Site oficial")}</span><ExternalLink size={13} />
                      </a>
                    ) : (
                      <span className="african-light-unavailable">{en ? "Institutional contact not confirmed" : "Contacto institucional não confirmado"}</span>
                    )}
                  </div>
                  {person.sources?.[0] && (
                    <p className="african-light-source">
                      {en ? "Context:" : "Contexto:"} <a href={person.sources[0].url} target="_blank" rel="noopener noreferrer">{person.sources[0].publisher ?? person.sources[0].title}</a>
                    </p>
                  )}
                  {person.portrait && (
                    <p className="african-light-credit">
                      {en ? "Image:" : "Imagem:"} <a href={person.portrait.sourceUrl} target="_blank" rel="noopener noreferrer">{person.portrait.credit}</a> · {person.portrait.license}
                    </p>
                  )}
                </div>
              </article>
              );
            })}
          </div>
          <p className="african-lights-disclosure">{en
            ? "Achievements are summarised from the sources linked to each profile. If an official contact channel could not be confirmed, this is stated on the card."
            : "As realizações são resumidas a partir das fontes ligadas a cada perfil. Quando o canal oficial de contacto não pôde ser confirmado, isso é indicado no próprio cartão."}</p>
        </section>
      )}
      {entities.length === 0 ? <p className="workspace-empty">{en ? "No organisations have been published yet." : "Ainda não há entidades publicadas."}</p> : (
        <section className="entity-directory" aria-labelledby="entity-directory-title">
          <div className="section-heading"><div><span className="section-kicker">{en ? "ORGANISATIONS · COMPANIES · PRODUCTS" : "ORGANIZAÇÕES · EMPRESAS · PRODUTOS"}</span><h2 id="entity-directory-title">{en ? <>The ecosystem<br /><em>in perspective.</em></> : <>O ecossistema<br /><em>em perspetiva.</em></>}</h2></div></div>
          <div className="entity-grid">{entities.map((sourceEntity) => {
          const entity = localizeEntity(sourceEntity, locale);
          const Icon = icons[entity.type];
          return (
            <article className="entity-card" key={entity.slug}>
              <span className="entity-icon"><Icon size={20} /></span>
              <span className="section-kicker">{(en ? ({ person: "PERSON", company: "COMPANY", organization: "ORGANISATION", market: "MARKET", product: "PRODUCT" } as const)[entity.type] : entity.type).toUpperCase()}{entity.verified ? (en ? " · VERIFIED" : " · VERIFICADO") : ""}</span>
              <h2><Link href={`/entidades/${entity.slug}`}>{entity.name}</Link></h2>
              <p>{entity.description}</p>
              <Link className="text-link" href={`/entidades/${entity.slug}`}>{en ? "View profile" : "Ver perfil"} <ArrowUpRight size={14} /></Link>
            </article>
          );
          })}</div>
        </section>
      )}
    </section>
  );
}
