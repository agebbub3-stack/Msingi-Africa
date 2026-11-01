"use client";

import { ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArticleCard } from "@/components/article-card";
import type { Article } from "@/lib/content";

export function ArticlesArchive({ articles }: { articles: Article[] }) {
  const [activeTopic, setActiveTopic] = useState("Todos");
  const [query, setQuery] = useState("");
  const topics = ["Todos", ...new Set(articles.map((article) => article.category))];
  const filteredArticles = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("pt");
    return articles.filter((article) => {
      const matchesTopic = activeTopic === "Todos" || article.category === activeTopic;
      const matchesQuery =
        !normalizedQuery ||
        `${article.title} ${article.standfirst} ${article.author} ${article.category} ${article.seoKeywords?.join(" ")}`
          .toLocaleLowerCase("pt")
          .includes(normalizedQuery);
      return matchesTopic && matchesQuery;
    });
  }, [activeTopic, articles, query]);

  return (
    <>
      <section className="archive-masthead">
        <span className="section-kicker">A NOSSA LEITURA DO CONTINENTE</span>
        <div className="archive-masthead-row">
          <div><h1>Histórias<br />com <em>perspetiva.</em></h1><p>Jornalismo independente, análise e ideias que nos ajudam a entender o que está a mudar nos mercados africanos.</p></div>
          <div className="archive-edition-stamp"><span>MS / 01</span><span>UM CONTINENTE<br />EM MOVIMENTO</span><span>54° AFRICA</span></div>
        </div>
        <div className="archive-stats"><span>ARTIGOS <b>{String(articles.length).padStart(2, "0")}</b></span><span>CONTEXTO <b>SEM FRONTEIRAS</b></span><span>EDIÇÃO <b>PAN-AFRICANA</b></span></div>
      </section>
      <section className="archive-content section-pad">
        <div className="archive-tools">
          <div className="topic-list" aria-label="Filtrar artigos por tema">
            {topics.map((topic) => <button key={topic} type="button" className={`topic-chip${activeTopic === topic ? " topic-chip-active" : ""}`} onClick={() => setActiveTopic(topic)} aria-pressed={activeTopic === topic}>{topic}</button>)}
          </div>
          <label className="search-field"><Search size={16} /><span className="sr-only">Pesquisar artigos</span><input type="search" placeholder="Pesquisar..." value={query} onChange={(event) => setQuery(event.target.value)} /></label>
        </div>
        {filteredArticles.length > 0 ? (
          <div className="article-grid archive-grid">
            {filteredArticles.map((article) => <ArticleCard key={article.slug} article={article} />)}
          </div>
        ) : (
          <div className="empty-search"><span>✳</span><h2>Nenhuma história com esse filtro.</h2><p>Experimente outra pesquisa ou explore todos os temas.</p><button className="button button-dark" onClick={() => { setActiveTopic("Todos"); setQuery(""); }}>Ver todos os artigos <ArrowRight size={15} /></button></div>
        )}
        <div className="archive-invite"><span>✳</span><div><h2>Perspetiva que ainda não lemos?</h2><p>As melhores conversas também começam com uma boa pergunta.</p></div><Link href="/painel">Crie um perfil de autor <ArrowRight size={15} /></Link></div>
      </section>
    </>
  );
}
