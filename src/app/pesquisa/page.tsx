import type { Metadata } from "next";
import { Search } from "lucide-react";
import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { getPublicEntities, searchPublishedArticles } from "@/lib/public-content";

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
  const [results, entities] = query
    ? await Promise.all([searchPublishedArticles(query), getPublicEntities()])
    : [[], await getPublicEntities()];
  const normalizedQuery = query.toLocaleLowerCase("pt");
  const matchingEntities = entities.filter((entity) =>
    `${entity.name} ${entity.description}`.toLocaleLowerCase("pt").includes(normalizedQuery),
  );

  return (
    <section className="archive-content section-pad search-page">
      <header className="search-page-header">
        <span className="section-kicker">PESQUISA COM CONTEXTO</span>
        <h1>O que procura<br /><em>saber?</em></h1>
        <p>Pesquise tendências, empresas, ideias ou pessoas ligadas aos mercados africanos.</p>
        <form className="search-page-form" action="/pesquisa">
          <label className="sr-only" htmlFor="market-search">Pesquisar Msingi Africa</label>
          <Search size={18} aria-hidden="true" />
          <input id="market-search" name="q" type="search" defaultValue={query} maxLength={100} placeholder="Ex.: investimento em Angola" />
          <button type="submit" className="button button-dark">Pesquisar</button>
        </form>
      </header>
      {query && <div className="search-results-heading"><span className="section-kicker">{results.length + matchingEntities.length} RESULTADOS</span><h2>Resultados para “{query}”</h2></div>}
      {matchingEntities.length > 0 && <section className="search-entity-results"><h2>Entidades e produtos</h2><ul>{matchingEntities.map((entity) => <li key={entity.slug}><Link href={`/entidades/${entity.slug}`}>{entity.name}</Link><span>{entity.description}</span></li>)}</ul></section>}
      {results.length > 0
        ? <div className="article-grid archive-grid">{results.map((article) => <ArticleCard key={article.slug} article={article} />)}</div>
        : query && matchingEntities.length === 0
          ? <p className="workspace-empty">Ainda não encontrámos uma história com essas palavras. Experimente perguntar de outra forma ou explorar os temas.</p>
          : !query ? <p className="workspace-empty">Escreva uma pergunta ou tema para começar a pesquisa.</p> : null}
    </section>
  );
}
