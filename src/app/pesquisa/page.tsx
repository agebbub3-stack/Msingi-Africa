import type { Metadata } from "next";
import { Search } from "lucide-react";
import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { ProfileCard } from "@/components/profile-card";
import { getPublicEntities, getPublishedArticles, getPublishedBiographies, searchPublishedArticles } from "@/lib/public-content";
import { getLocale } from "@/lib/locale.server";
import { createPageMetadata } from "@/lib/page-metadata";
import { hasContentForLocale, localizeArticle, localizeBiography } from "@/lib/localized-editorial";
import { localizeEntity } from "@/lib/localized-entities";

export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    ...createPageMetadata({
      locale,
      kind: "search",
      path: "/pesquisa",
      eyebrow: locale === "en" ? "SEARCH WITH CONTEXT" : "PESQUISA COM CONTEXTO",
      title: locale === "en" ? "Search African stories and markets" : "Pesquisar artigos e mercados",
      description: locale === "en"
        ? "Find articles, people, organisations and trends across African markets."
        : "Encontre artigos, pessoas, entidades e tendências sobre os mercados africanos.",
    }),
    robots: { index: false, follow: true },
  };
}

type Props = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const query = q.trim().slice(0, 100);
  const locale = await getLocale();
  const [articles, entities, biographies] = await Promise.all([
    query ? (locale === "en" ? getPublishedArticles() : searchPublishedArticles(query)) : Promise.resolve([]),
    getPublicEntities(),
    query ? getPublishedBiographies() : Promise.resolve([]),
  ]);
  const en = locale === "en";
  const normalize = (value: string) => value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase("pt");
  const normalizedQuery = normalize(query);
  const results = query ? articles.filter((article) => {
    if (!hasContentForLocale(article, locale)) return false;
    const localizedArticle = localizeArticle(article, locale);
    return normalize(`${localizedArticle.title} ${localizedArticle.standfirst} ${localizedArticle.category} ${localizedArticle.author} ${localizedArticle.markdown ?? ""} ${localizedArticle.seoKeywords?.join(" ")}`)
      .includes(normalizedQuery);
  }) : [];
  const matchingEntities = query ? entities.map((entity) => localizeEntity(entity, locale)).filter((entity) =>
    normalize(`${entity.name} ${entity.description}`).includes(normalizedQuery),
  ) : [];
  const matchingBiographies = query ? biographies.map((profile) => localizeBiography(profile, locale)).filter((profile) =>
    hasContentForLocale(profile, locale)
      && normalize(`${profile.name} ${profile.summary} ${profile.country} ${profile.field} ${profile.role} ${profile.body.join(" ")}`)
        .includes(normalizedQuery),
  ) : [];
  const totalResults = results.length + matchingEntities.length + matchingBiographies.length;

  return (
    <section className="archive-content section-pad search-page">
      <header className="search-page-header">
        <span className="section-kicker">{en ? "SEARCH WITH CONTEXT" : "PESQUISA COM CONTEXTO"}</span>
        <h1>{en ? <>What are you<br /><em>looking for?</em></> : <>O que procura<br /><em>saber?</em></>}</h1>
        <p>{en ? "Search for trends, companies, ideas or people connected to African markets." : "Pesquise tendências, empresas, ideias ou pessoas ligadas aos mercados africanos."}</p>
        <form className="search-page-form" action="/pesquisa">
          <label className="sr-only" htmlFor="market-search">{en ? "Search Kioo Africa" : "Pesquisar Kioo Africa"}</label>
          <Search size={18} aria-hidden="true" />
          <input id="market-search" name="q" type="search" defaultValue={query} maxLength={100} placeholder={en ? "E.g. investment in Angola" : "Ex.: investimento em Angola"} />
          <button type="submit" className="button button-dark">{en ? "Search" : "Pesquisar"}</button>
        </form>
        {!query && (
          <nav className="search-suggestions" aria-label={en ? "Suggested searches" : "Pesquisas sugeridas"}>
            <span>{en ? "Explore:" : "Explore:"}</span>
            <Link href="/pesquisa?q=Angola">Angola</Link>
            <Link href="/pesquisa?q=tecnologia">Tecnologia</Link>
            <Link href="/pesquisa?q=empreendedorismo">Empreendedorismo</Link>
          </nav>
        )}
      </header>
      {query && <div className="search-results-heading" aria-live="polite"><span className="section-kicker">{totalResults} {totalResults === 1 ? (en ? "RESULT" : "RESULTADO") : (en ? "RESULTS" : "RESULTADOS")} · {results.length} {en ? "ARTICLES" : "ARTIGOS"} · {matchingBiographies.length} {en ? "PROFILES" : "PERFIS"} · {matchingEntities.length} {en ? "ENTITIES" : "ENTIDADES"}</span><h2>{en ? "Results for" : "Resultados para"} “{query}”</h2></div>}
      {matchingEntities.length > 0 && <section className="search-entity-results"><h2>{en ? "Organisations and products" : "Entidades e produtos"}</h2><ul>{matchingEntities.map((entity) => <li key={entity.slug}><Link href={`/entidades/${entity.slug}`}>{entity.name}</Link><span>{entity.description}</span></li>)}</ul></section>}
      {matchingBiographies.length > 0 && (
        <section className="search-profile-results" aria-labelledby="search-profiles-title">
          <h2 id="search-profiles-title">{en ? "People and biographies" : "Pessoas e biografias"}</h2>
          <div className="profile-grid">
            {matchingBiographies.map((profile) => <ProfileCard key={profile.slug} profile={profile} locale={locale} />)}
          </div>
        </section>
      )}
      {results.length > 0 && (
        <section className="search-article-results" aria-labelledby="search-articles-title">
          <h2 id="search-articles-title">{en ? "Articles and analysis" : "Artigos e análises"}</h2>
          <div className="article-grid archive-grid">{results.map((article) => <ArticleCard key={article.slug} article={article} locale={locale} />)}</div>
        </section>
      )}
      {query && totalResults === 0 && <p className="workspace-empty">{en
        ? "We could not find results for these words. Try a person, organisation, country or different topic."
        : "Ainda não encontrámos resultados para estas palavras. Experimente uma pessoa, organização, país ou tema diferente."}</p>}
    </section>
  );
}
