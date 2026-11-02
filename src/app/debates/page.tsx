import type { Metadata } from "next";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import Link from "next/link";
import { getPublishedArticles } from "@/lib/public-content";
import { getLocale } from "@/lib/locale.server";
import { createPageMetadata } from "@/lib/page-metadata";
import { localizeArticle } from "@/lib/localized-editorial";
import { localizeCategory } from "@/lib/i18n";

export const dynamic = "force-dynamic";

const debatePrompts: Record<string, { pt: string; en: string }> = {
  "afcfta-integracao-mercados-africanos": {
    pt: "Que barreira prática mais dificulta a expansão de pequenos negócios para outros países africanos?",
    en: "Which practical barrier most limits small businesses expanding into other African countries?",
  },
  "desert-to-power-energia-solar-sahel": {
    pt: "Como medir se um grande projeto de energia também melhora o acesso e a fiabilidade para as comunidades?",
    en: "How should a major energy project be measured against access and reliability for communities?",
  },
  "africa-cdc-seguranca-sanitaria-capacidade-local": {
    pt: "Que capacidades de saúde pública devem ser financiadas de forma contínua, mesmo entre emergências?",
    en: "Which public-health capabilities should receive sustained funding between emergencies?",
  },
  "ashesi-educacao-lideranca-empreendedorismo-africa": {
    pt: "Que competências devem definir uma educação superior preparada para os desafios locais?",
    en: "Which skills should define higher education prepared for local challenges?",
  },
  "industria-africana-valor-acrescentado-producao-local": {
    pt: "Que indicadores mostram que a produção local está a criar valor partilhado, e não apenas escala?",
    en: "Which indicators show local production is creating shared value, not just scale?",
  },
  "capital-africano-novas-rotas": {
    pt: "Como pode o financiamento de longo prazo apoiar empresas sem transferir riscos desproporcionais para os fundadores?",
    en: "How can long-term finance support businesses without shifting disproportionate risk onto founders?",
  },
  "inclusao-digital-africa-uso-internet-movel": {
    pt: "Que medidas ajudam a converter cobertura de rede em acesso digital útil e acessível?",
    en: "What helps turn network coverage into useful and affordable digital access?",
  },
  "energia-limpa-africa-acesso-economico": {
    pt: "Como equilibrar energia acessível, fiabilidade e metas de transição energética em cada país?",
    en: "How can countries balance affordable energy, reliability and transition goals?",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const en = locale === "en";
  return createPageMetadata({
    locale,
    kind: "debates",
    path: "/debates",
    eyebrow: en ? "COMMUNITY · IDEAS IN CONTEXT" : "COMUNIDADE · IDEIAS EM CONTEXTO",
    title: en ? "African markets discussion forum" : "Fórum de debates sobre África",
    description: en
      ? "Join moderated discussions about African markets, public policy, technology and the ideas shaping the continent."
      : "Participe em conversas moderadas sobre mercados africanos, políticas públicas, tecnologia e ideias que transformam o continente.",
  });
}

export default async function DebatesPage() {
  const [articles, locale] = await Promise.all([getPublishedArticles(), getLocale()]);
  const en = locale === "en";
  const discussions = articles.flatMap((article) => {
    const prompt = debatePrompts[article.slug];
    return prompt ? [{ article, question: en ? prompt.en : prompt.pt }] : [];
  });

  return (
    <>
      <section className="debates-masthead">
        <span className="section-kicker">{en ? "A SPACE FOR EXCHANGE · WITH CONTEXT" : "UM ESPAÇO DE TROCA · COM CONTEXTO"}</span>
        <div className="debates-masthead-copy">
          <div>
            <h1>{en ? <>Ideas move<br />through <em>conversation.</em></> : <>As ideias avançam<br />na <em>conversa.</em></>}</h1>
            <p>{en
              ? "Discuss the questions behind the stories. Read the reporting, share a perspective and keep the exchange respectful."
              : "Debata as perguntas por trás das histórias. Leia a reportagem, partilhe uma perspetiva e ajude a manter uma conversa respeitosa."}</p>
          </div>
          <div className="debates-masthead-note">
            <MessageCircle size={20} aria-hidden="true" />
            <span>{en ? "Moderated conversations" : "Conversas moderadas"}</span>
            <small>{en ? "Read freely · Sign in to participate" : "Leitura livre · Inicie sessão para participar"}</small>
          </div>
        </div>
      </section>
      <section className="debates-list section-pad" aria-labelledby="debates-list-title">
        <div className="section-heading">
          <div>
            <span className="section-kicker">{en ? "OPEN DISCUSSIONS" : "CONVERSAS ABERTAS"}</span>
            <h2 id="debates-list-title">{en ? <>The questions<br />worth <em>discussing.</em></> : <>Perguntas que<br />merecem <em>debate.</em></>}</h2>
          </div>
          <Link className="text-link" href="/artigos">{en ? "Explore all stories" : "Explorar artigos"} <ArrowUpRight size={14} /></Link>
        </div>
        {discussions.length > 0 ? (
          <div className="debate-list">
            {discussions.map(({ article, question }, index) => (
              <article className="debate-card" key={article.slug}>
                <span className="debate-card-index">{String(index + 1).padStart(2, "0")}</span>
                <div className="debate-card-content">
                  <span className="section-kicker">{localizeCategory(article.category, locale)}</span>
                  <h3>{question}</h3>
                  <p>{en ? "Based on" : "A partir de"}: <Link href={`/artigos/${article.slug}`}>{localizeArticle(article, locale).title}</Link></p>
                </div>
                <Link className="debate-card-link" href={`/artigos/${article.slug}#comentarios`}>
                  <MessageCircle size={16} aria-hidden="true" />
                  <span>{en ? "Join the discussion" : "Participar no debate"}</span>
                  <ArrowUpRight size={15} aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <p className="debates-empty">{en
            ? "New discussions will appear as sourced stories are published."
            : "Novas conversas surgirão à medida que publicarmos histórias com fontes."}</p>
        )}
        <p className="debates-guidelines">{en
          ? "Comments are reviewed before publication. Be specific, discuss ideas rather than people, and support factual claims with sources."
          : "Os comentários são revistos antes da publicação. Seja concreto, debata ideias sem atacar pessoas e apoie afirmações factuais em fontes."}</p>
      </section>
    </>
  );
}
