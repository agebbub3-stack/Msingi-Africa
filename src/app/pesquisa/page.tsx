import type { Metadata } from "next";
import { Search } from "lucide-react";
import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { ProfileCard } from "@/components/profile-card";
import { getPublicEntities, getPublishedBiographies, searchPublishedArticles } from "@/lib/public-content";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Pesquisar artigos e mercados",
  description: "Encontre artigos, pessoas, entidades e tendências sobre os mercados africanos.",
  alternates: { canonical: "/pesquisa" },
};

type Props = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const query = q.trim().slice(0, 100);
  const [results, entities, biographies] = await Promise.all([
    query ? searchPublishedArticles(query) : Promise.resolve([]),
    getPublicEntities(),
    query ? getPublishedBiographies() : Promise.resolve([]),
  ]);
  const normalize = (value: string) => value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase("pt");
  const normalizedQuery = normalize(query);
  const matchingEntities = query ? entities.filter((entity) =>
    normalize(`${entity.name} ${entity.description}`).includes(normalizedQuery),
  ) : [];
  const matchingBiographies = query ? biographies.filter((profile) =>
    normalize(`${profile.name} ${profile.summary} ${profile.country} ${profile.field} ${profile.role} ${profile.body.join(" ")}`)
      .includes(normalizedQuery),
  ) : [];
  const totalResults = results.length + matchingEntities.length + matchingBiographies.length;

  return (
    <section className="archive-content section-pad search-page">
      <header className="search-page-header">
        <span className="section-kicker">PESQUISA COM CONTEXTO</span>
        <h1>O que procura<br /><em>saber?</em></h1>
        <p>Pesquise tendências, empresas, ideias ou pessoas ligadas aos mercados africanos.</p>
        <form className="search-page-form" action="/pesquisa">
          <label className="sr-only" htmlFor="market-search">Pesquisar Bantaba Africa</label>
          <Search size={18} aria-hidden="true" />
          <input id="market-search" name="q" type="search" defaultValue={query} maxLength={100} placeholder="Ex.: investimento em Angola" />
          <button type="submit" className="button button-dark">Pesquisar</button>
        </form>
        {!query && (
          <nav className="search-suggestions" aria-label="Pesquisas sugeridas">
            <span>Explore:</span>
            <Link href="/pesquisa?q=Angola">Angola</Link>
            <Link href="/pesquisa?q=tecnologia">Tecnologia</Link>
            <Link href="/pesquisa?q=empreendedorismo">Empreendedorismo</Link>
          </nav>
        )}
      </header>
      {query && <div className="search-results-heading" aria-live="polite"><span className="section-kicker">{totalResults} {totalResults === 1 ? "RESULTADO" : "RESULTADOS"} · {results.length} ARTIGOS · {matchingBiographies.length} PERFIS · {matchingEntities.length} ENTIDADES</span><h2>Resultados para “{query}”</h2></div>}
      {matchingEntities.length > 0 && <section className="search-entity-results"><h2>Entidades e produtos</h2><ul>{matchingEntities.map((entity) => <li key={entity.slug}><Link href={`/entidades/${entity.slug}`}>{entity.name}</Link><span>{entity.description}</span></li>)}</ul></section>}
      {matchingBiographies.length > 0 && (
        <section className="search-profile-results" aria-labelledby="search-profiles-title">
          <h2 id="search-profiles-title">Pessoas e biografias</h2>
          <div className="profile-grid">
            {matchingBiographies.map((profile) => <ProfileCard key={profile.slug} profile={profile} />)}
          </div>
        </section>
      )}
      {results.length > 0 && (
        <section className="search-article-results" aria-labelledby="search-articles-title">
          <h2 id="search-articles-title">Artigos e análises</h2>
          <div className="article-grid archive-grid">{results.map((article) => <ArticleCard key={article.slug} article={article} />)}</div>
        </section>
      )}
      {query && totalResults === 0 && <p className="workspace-empty">Ainda não encontrámos resultados para estas palavras. Experimente uma pessoa, organização, país ou tema diferente.</p>}
    </section>
  );
}
