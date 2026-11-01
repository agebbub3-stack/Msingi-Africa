import { ArrowDownRight, ArrowRight, ArrowUpRight, Globe2, MoveUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { ProfileCard } from "@/components/profile-card";
import { getPublishedArticles, getPublishedBiographies } from "@/lib/public-content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [publishedArticles, biographies] = await Promise.all([getPublishedArticles(), getPublishedBiographies()]);
  const [lead, ...latestArticles] = publishedArticles;

  return (
    <>
      <section className="home-hero">
        <div className="hero-topline">
          <span className="eyebrow"><span className="eyebrow-dot" /> A OBSERVAR O CONTINENTE</span>
          <span className="hero-edition">VOL. 01 <span>—</span> EDIÇÃO 026</span>
        </div>
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="hero-kicker">UM CONTINENTE. <span>∞</span> HISTÓRIAS.</p>
            <h1>O que move <span>África</span><br />move o futuro.</h1>
            <p className="hero-description">
              Pessoas, mercados e ideias em transformação. Jornalismo independente para olhar o continente de mais perto — e o mundo de um novo ângulo.
            </p>
            <div className="hero-actions">
              <Link href="/artigos" className="button button-dark">Explorar as histórias <ArrowUpRight size={16} /></Link>
              <Link href="/sobre" className="text-link">Conheça a Msingi <ArrowRight size={15} /></Link>
            </div>
            <div className="hero-note">
              <span className="hero-note-line" />
              <p>“Msingi” significa <em>fundamento</em> em suaíli.<br />Acreditamos que boas histórias começam por aí.</p>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-image-frame">
              <Image
                src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=88"
                alt="Paisagem africana iluminada pelo sol ao fim da tarde"
                fill
                priority
                sizes="(max-width: 760px) 100vw, 52vw"
              />
              <div className="hero-image-shade" />
              <div className="hero-image-caption">
                <span>01° 17′ N · 36° 49′ E</span>
                <span>NAIROBI · QUÉNIA</span>
              </div>
            </div>
            <div className="hero-sticker"><Globe2 size={16} /><span>DE 54 PAÍSES,<br />UMA CONVERSA.</span></div>
            <span className="hero-vertical-label">PERSPECTIVAS QUE NOS APROXIMAM</span>
          </div>
        </div>
        <div className="hero-bottom">
          <a href="#destaque" className="scroll-cue"><ArrowDownRight size={15} /> DESCUBRA O QUE ESTÁ A MUDAR</a>
          <div className="ticker" aria-label="Os nossos temas">
            <span>MERCADOS</span><i /><span>TECNOLOGIA</span><i /><span>IDEIAS</span><i /><span>CULTURA</span><i /><span>PESSOAS</span>
          </div>
        </div>
      </section>

      <section className="featured-section section-pad" id="destaque">
        <div className="section-heading">
          <div>
            <span className="section-kicker">A ESCOLHA DA REDAÇÃO <span>✳</span></span>
            <h2>O continente<br className="mobile-break" /> em <em>contexto.</em></h2>
          </div>
          <Link className="text-link heading-link" href="/artigos">Todas as histórias <ArrowRight size={15} /></Link>
        </div>
        <div className="featured-layout">
          {lead ? <div className="lead-article"><ArticleCard article={lead} featured /></div> : <div className="lead-article workspace-empty"><p>A próxima história está a ser preparada pela redação.</p></div>}
          <aside className="briefing">
            <div className="briefing-top">
              <span className="briefing-overline">O PONTO DE PARTIDA</span>
              <span className="briefing-symbol">✳</span>
            </div>
            <h3>O contexto muda<br />tudo.</h3>
            <p>As grandes conversas sobre África são muitas vezes contadas de longe. Nós começamos mais perto: dos dados, das pessoas e das realidades que fazem cada mercado único.</p>
            <Link href="/sobre" className="briefing-link">A nossa forma de olhar <MoveUpRight size={15} /></Link>
            <div className="briefing-index"><span>01</span><span>—</span><span>NOTA EDITORIAL</span></div>
          </aside>
        </div>
      </section>

      <section className="latest-section section-pad">
        <div className="section-heading section-heading-dark">
          <div>
            <span className="section-kicker">IDEIAS EM MOVIMENTO</span>
            <h2>O que vale<br className="mobile-break" /> <em>acompanhar.</em></h2>
          </div>
          <Link className="text-link heading-link" href="/artigos">Ver todos os artigos <ArrowRight size={15} /></Link>
        </div>
        <div className="article-grid">
          {latestArticles.map((article) => <ArticleCard key={article.slug} article={article} />)}
        </div>
        <div className="latest-bottom"><span>LEITURA COM PERSPECTIVA, NÃO COM PRESSA.</span><Link href="/artigos">Mais histórias <ArrowUpRight size={14} /></Link></div>
      </section>

      <section className="people-section section-pad">
        <div className="section-heading">
          <div>
            <span className="section-kicker">QUEM ESTÁ A MUDAR O JOGO <span>✳</span></span>
            <h2>Ideias com<br className="mobile-break" /> <em>rosto e história.</em></h2>
          </div>
          <Link className="text-link heading-link" href="/biografias">Todas as biografias <ArrowRight size={15} /></Link>
        </div>
        <div className="profile-grid">
          {biographies.map((profile) => <ProfileCard key={profile.slug} profile={profile} />)}
        </div>
      </section>

      <section className="contribute-band">
        <div className="contribute-orbit" aria-hidden="true"><span>✳</span></div>
        <div className="contribute-copy">
          <span className="section-kicker">AS MELHORES IDEIAS COMEÇAM EM CONJUNTO</span>
          <h2>Tem uma história<br />que precisa <em>de espaço?</em></h2>
          <p>Procuramos vozes com perspetiva, experiência e algo novo a acrescentar à conversa.</p>
          <Link className="button button-light" href="/publicar">Partilhe a sua ideia <ArrowUpRight size={16} /></Link>
        </div>
        <div className="contribute-note"><span>✳</span> A NOSSA REDAÇÃO<br />COMEÇA POR OUVIR.</div>
      </section>
    </>
  );
}
