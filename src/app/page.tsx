import { ArrowDownRight, ArrowRight, ArrowUpRight, MoveUpRight } from "lucide-react";
import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { HomeHeroCarousel } from "@/components/home-hero-carousel";
import { ProfileCard } from "@/components/profile-card";
import { ScrollReveal } from "@/components/scroll-reveal";
import { imageForCategory } from "@/lib/content";
import { getPublishedArticles, getPublishedBiographies } from "@/lib/public-content";
import { localizeCategory, localizeCountry, translate } from "@/lib/i18n";
import { getLocale } from "@/lib/locale.server";
import {
  hasEnglishArticleCopy,
  hasEnglishBiographyCopy,
  localizeArticle,
  localizeBiography,
} from "@/lib/localized-editorial";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [publishedArticles, biographies, locale] = await Promise.all([
    getPublishedArticles(),
    getPublishedBiographies(),
    getLocale(),
  ]);
  const [lead, ...latestArticles] = publishedArticles;
  const digitalEconomyArticle = publishedArticles.find(
    (article) => article.slug === "inclusao-digital-africa-uso-internet-movel",
  );
  const gsmaSource = digitalEconomyArticle?.sources?.find((source) => source.publisher === "GSMA");
  const carouselStories = [
    ...publishedArticles.slice(0, 3).map((article) => {
      const localizedArticle = localizeArticle(article, locale);
      return {
        href: `/artigos/${article.slug}`,
        title: localizedArticle.title,
        description: localizedArticle.standfirst,
        image: article.image,
        imageAlt: localizedArticle.imageAlt,
        ...(article.slug === "softedge-ia-angolana-akira" ? { imageTreatment: "partner-logo" as const } : {}),
        label: article.partnerName
          ? `${locale === "en" ? "PARTNERSHIP FEATURE" : "PARCERIA DIVULGADA"} · ${localizeCategory(article.category, locale)}`
          : localizeCategory(article.category, locale),
        byline: localizedArticle.author,
        date: localizedArticle.date,
        isOriginalLanguage: locale === "en" && !hasEnglishArticleCopy(article.slug),
      };
    }),
    ...biographies.slice(0, 1).map((profile) => {
      const localizedProfile = localizeBiography(profile, locale);
      return {
        href: `/biografias/${profile.slug}`,
        title: profile.name,
        description: localizedProfile.summary,
        image: profile.portrait?.src ?? imageForCategory[profile.field] ?? imageForCategory.Tecnologia,
        imageAlt: localizedProfile.portrait?.alt ?? `${profile.name}, ${locale === "en" ? "biographical profile" : "perfil biográfico"}`,
        label: profile.partnerName
          ? `${locale === "en" ? "PARTNERSHIP PROFILE" : "PERFIL EM PARCERIA"} · ${localizeCountry(localizedProfile.country, locale)}`
          : locale === "en" ? `${localizeCountry(localizedProfile.country, locale)} · ${localizeCategory(profile.field, locale)}` : `${profile.country} · ${profile.field}`,
        byline: locale === "en" ? "Kioo Africa Editorial" : "Redação Kioo Africa",
        date: "",
        isOriginalLanguage: locale === "en" && !hasEnglishBiographyCopy(profile.slug),
      };
    }),
  ];

  return (
    <>
      <div className="home-scroll-progress" aria-hidden="true"><span /></div>
      <section className="home-hero">
        <div className="hero-topline">
          <span className="eyebrow"><span className="eyebrow-dot" /> {translate(locale, "watchContinent")}</span>
          <span className="hero-edition">VOL. 01 <span>—</span> {translate(locale, "edition")} 026</span>
        </div>
        <HomeHeroCarousel locale={locale} items={carouselStories.length > 0 ? carouselStories : [{
            href: "/artigos",
            title: locale === "en" ? "African people, ideas and markets" : "Pessoas, mercados e ideias africanas",
            description: locale === "en" ? "Independent stories to understand what is changing across the continent." : "Histórias independentes para compreender o que está a mudar no continente.",
            image: imageForCategory.Mercados,
            imageAlt: "Mercados e cidades africanas",
            label: "KIOO AFRICA",
            byline: "Kioo Africa",
            date: "",
          }]} />
        <div className="hero-bottom">
          <a href="#destaque" className="scroll-cue"><ArrowDownRight size={15} /> {translate(locale, "discoverChanges")}</a>
          <div className="ticker" aria-label="Os nossos temas">
            <span>{translate(locale, "markets")}</span><i /><span>{translate(locale, "technology")}</span><i /><span>{translate(locale, "ideas")}</span><i /><span>{translate(locale, "culture")}</span><i /><span>{translate(locale, "people")}</span>
          </div>
        </div>
      </section>
      <ScrollReveal
        className="featured-section section-pad"
        id="destaque"
        selector=".section-heading, .lead-article, .briefing"
      >
        <div className="section-heading">
          <div>
            <span className="section-kicker">
              {lead?.partnerName
                ? (locale === "en" ? "PARTNERSHIP HIGHLIGHT" : "DESTAQUE DE PARCERIA")
                : translate(locale, "editorsPick")} <span>✳</span>
            </span>
            <h2>{locale === "en" ? <>The continent<br className="mobile-break" /> in <em>context.</em></> : <>O continente<br className="mobile-break" /> em <em>contexto.</em></>}</h2>
          </div>
          <Link className="text-link heading-link" href="/artigos">{translate(locale, "allStories")} <ArrowRight size={15} /></Link>
        </div>
        <div className="featured-layout">
          {lead ? <div className="lead-article"><ArticleCard article={lead} featured locale={locale} /></div> : <div className="lead-article workspace-empty"><p>{locale === "en" ? "The newsroom is preparing the next story." : "A próxima história está a ser preparada pela redação."}</p></div>}
          <aside className="briefing">
            <div className="briefing-top">
              <span className="briefing-overline">{translate(locale, "startingPoint")}</span>
              <span className="briefing-symbol">✳</span>
            </div>
            <h3>{locale === "en" ? <>Context changes<br />everything.</> : <>O contexto muda<br />tudo.</>}</h3>
            <p>{translate(locale, "contextBriefing")}</p>
            <Link href="/sobre" className="briefing-link">{translate(locale, "ourApproach")} <MoveUpRight size={15} /></Link>
            <div className="briefing-index"><span>01</span><span>—</span><span>{translate(locale, "editorialNote")}</span></div>
          </aside>
        </div>
      </ScrollReveal>

      {digitalEconomyArticle && gsmaSource && (
        <ScrollReveal
          className="market-lens section-pad"
          aria-labelledby="market-lens-title"
          selector=".market-lens-heading, .market-metric, .market-source"
        >
          <div className="market-lens-heading">
            <div>
              <span className="section-kicker">{translate(locale, "dataInContext")} <span>✳</span> GSMA · 2025</span>
              <h2 id="market-lens-title">{locale === "en" ? <>The digital economy<br /><em>beyond the signal.</em></> : <>A economia digital<br />para lá do <em>sinal.</em></>}</h2>
              <p>{translate(locale, "mobileAccessContext")}</p>
            </div>
            <Link className="text-link market-lens-link" href={`/artigos/${digitalEconomyArticle.slug}`}>
              {translate(locale, "readFullAnalysis")} <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="market-metrics" aria-label={translate(locale, "mobileAccessIndicators")}>
            <article className="market-metric">
              <span className="metric-index">01 / {translate(locale, "access")}</span>
              <strong>{translate(locale, "almostOneBillion")}</strong>
              <p>{translate(locale, "mobileInternetGap")}</p>
            </article>
            <article className="market-metric">
              <span className="metric-index">02 / {translate(locale, "economy")}</span>
              <strong>{locale === "en" ? "US$ 240 billion" : "US$ 240 mil milhões"}</strong>
              <p>{translate(locale, "mobileEconomyContribution")}</p>
            </article>
            <article className="market-metric market-metric-highlight">
              <span className="metric-index">03 / {translate(locale, "scale")}</span>
              <strong>{locale === "en" ? "7.8% of GDP" : "7,8% do PIB"}</strong>
              <p>{translate(locale, "gdpContribution")}</p>
            </article>
          </div>
          <div className="market-source">
            <span>{translate(locale, "estimatesNote")}</span>
            <a href={gsmaSource.url} target="_blank" rel="noreferrer">
              {translate(locale, "gsmaSource")} {gsmaSource.publisher} — {gsmaSource.title} <ArrowUpRight size={13} />
            </a>
          </div>
        </ScrollReveal>
      )}

      <ScrollReveal
        className="latest-section section-pad"
        selector=".section-heading, .article-card, .latest-bottom"
      >
        <div className="section-heading section-heading-dark">
          <div>
            <span className="section-kicker">{translate(locale, "ideasInMotion")}</span>
            <h2>{locale === "en" ? <>What to keep<br className="mobile-break" /> <em>an eye on.</em></> : <>O que vale<br className="mobile-break" /> <em>acompanhar.</em></>}</h2>
          </div>
          <Link className="text-link heading-link" href="/artigos">{translate(locale, "allArticles")} <ArrowRight size={15} /></Link>
        </div>
        <div className="article-grid">
          {latestArticles.map((article) => <ArticleCard key={article.slug} article={article} locale={locale} />)}
        </div>
        <div className="latest-bottom"><span>{translate(locale, "readingWithPerspective")}</span><Link href="/artigos">{translate(locale, "moreStories")} <ArrowUpRight size={14} /></Link></div>
      </ScrollReveal>

      <ScrollReveal
        className="people-section section-pad"
        selector=".section-heading, .profile-card"
      >
        <div className="section-heading">
          <div>
            <span className="section-kicker">{translate(locale, "peopleChangingTheGame")} <span>✳</span></span>
            <h2>{locale === "en" ? <>Ideas with a<br className="mobile-break" /> <em>face and a story.</em></> : <>Ideias com<br className="mobile-break" /> <em>rosto e história.</em></>}</h2>
          </div>
          <Link className="text-link heading-link" href="/biografias">{translate(locale, "allBiographies")} <ArrowRight size={15} /></Link>
        </div>
        <div className="profile-grid">
          {biographies.map((profile) => <ProfileCard key={profile.slug} profile={profile} locale={locale} />)}
        </div>
      </ScrollReveal>

      <ScrollReveal
        className="contribute-band"
        selector=".contribute-copy, .contribute-note"
      >
        <div className="contribute-orbit" aria-hidden="true"><span>✳</span></div>
        <div className="contribute-copy">
          <span className="section-kicker">{translate(locale, "bestIdeasTogether")}</span>
          <h2>{locale === "en" ? <>Have a story<br />that needs <em>room?</em></> : <>Tem uma história<br />que precisa <em>de espaço?</em></>}</h2>
          <p>{translate(locale, "seekingVoices")}</p>
          <Link className="button button-light" href="/publicar">{translate(locale, "shareIdea")} <ArrowUpRight size={16} /></Link>
        </div>
        <div className="contribute-note"><span>✳</span> {translate(locale, "newsroomListens")}</div>
      </ScrollReveal>
    </>
  );
}
