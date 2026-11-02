"use client";

import { ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ArticleCard } from "@/components/article-card";
import type { Article } from "@/lib/content";
import { localizeCategory, translate, type Locale } from "@/lib/i18n";
import { hasContentForLocale, localizeArticle } from "@/lib/localized-editorial";

export function ArticlesArchive({ articles, locale = "en" }: { articles: Article[]; locale?: Locale }) {
  const visibleArticles = locale === "en"
    ? articles.filter((article) => hasContentForLocale(article, locale))
    : articles;
  const [activeTopic, setActiveTopic] = useState("");
  const [query, setQuery] = useState("");
  const topics = [...new Set(visibleArticles.map((article) => article.category))];
  const normalizedQuery = query.trim().toLocaleLowerCase(locale);
  const filteredArticles = visibleArticles.filter((article) => {
    const localizedArticle = localizeArticle(article, locale);
    const matchesTopic = !activeTopic || article.category === activeTopic;
    const matchesQuery =
      !normalizedQuery ||
      `${localizedArticle.title} ${localizedArticle.standfirst} ${localizedArticle.author} ${localizeCategory(article.category, locale)} ${article.title} ${article.standfirst} ${article.seoKeywords?.join(" ")}`
        .toLocaleLowerCase(locale)
        .includes(normalizedQuery);
    return matchesTopic && matchesQuery;
  });

  return (
    <>
      <section className="archive-masthead">
        <span className="section-kicker">{locale === "en" ? "OUR READ OF THE CONTINENT" : "A NOSSA LEITURA DO CONTINENTE"}</span>
        <div className="archive-masthead-row">
          <div>
            <h1>{locale === "en" ? <>Stories<br />with <em>perspective.</em></> : <>Histórias<br />com <em>perspetiva.</em></>}</h1>
            <p>{locale === "en"
              ? "Independent journalism, analysis and ideas to understand what is changing across African markets."
              : "Jornalismo independente, análise e ideias que nos ajudam a entender o que está a mudar nos mercados africanos."}</p>
          </div>
          <div className="archive-edition-stamp"><span>KIOO / 01</span><span>{locale === "en" ? <>ONE CONTINENT<br />IN MOTION</> : <>UM CONTINENTE<br />EM MOVIMENTO</>}</span><span>54° AFRICA</span></div>
        </div>
        <div className="archive-stats">
          <span>{locale === "en" ? "ARTICLES" : "ARTIGOS"} <b>{String(visibleArticles.length).padStart(2, "0")}</b></span>
          <span>{locale === "en" ? "CONTEXT" : "CONTEXTO"} <b>{locale === "en" ? "WITHOUT BORDERS" : "SEM FRONTEIRAS"}</b></span>
          <span>{locale === "en" ? "EDITION" : "EDIÇÃO"} <b>{locale === "en" ? "PAN-AFRICAN" : "PAN-AFRICANA"}</b></span>
        </div>
      </section>
      <section className="archive-content section-pad">
        <div className="archive-tools">
          <div className="topic-list" aria-label={locale === "en" ? "Filter articles by topic" : "Filtrar artigos por tema"}>
            <button type="button" className={`topic-chip${activeTopic === "" ? " topic-chip-active" : ""}`} onClick={() => setActiveTopic("")} aria-pressed={activeTopic === ""}>{translate(locale, "allTopics")}</button>
            {topics.map((topic) => <button key={topic} type="button" className={`topic-chip${activeTopic === topic ? " topic-chip-active" : ""}`} onClick={() => setActiveTopic(topic)} aria-pressed={activeTopic === topic}>{localizeCategory(topic, locale)}</button>)}
          </div>
          <label className="search-field"><Search size={16} /><span className="sr-only">{locale === "en" ? "Search articles" : "Pesquisar artigos"}</span><input type="search" placeholder={translate(locale, "searchPlaceholder")} value={query} onChange={(event) => setQuery(event.target.value)} /></label>
        </div>
        {filteredArticles.length > 0 ? (
          <div className="article-grid archive-grid">
            {filteredArticles.map((article) => <ArticleCard key={article.slug} article={article} locale={locale} />)}
          </div>
        ) : (
          <div className="empty-search">
            <span>✳</span>
            <h2>{translate(locale, "emptyArticleSearch")}</h2>
            <p>{translate(locale, "tryAnotherSearch")}</p>
            <button className="button button-dark" onClick={() => { setActiveTopic(""); setQuery(""); }}>
              {locale === "en" ? "See all articles" : "Ver todos os artigos"} <ArrowRight size={15} />
            </button>
          </div>
        )}
        <div className="archive-invite">
          <span>✳</span>
          <div>
            <h2>{locale === "en" ? "A perspective we have not heard yet?" : "Perspetiva que ainda não lemos?"}</h2>
            <p>{locale === "en" ? "The best conversations also begin with a good question." : "As melhores conversas também começam com uma boa pergunta."}</p>
          </div>
          <Link href="/painel">{locale === "en" ? "Create a contributor profile" : "Crie um perfil de autor"} <ArrowRight size={15} /></Link>
        </div>
      </section>
    </>
  );
}
