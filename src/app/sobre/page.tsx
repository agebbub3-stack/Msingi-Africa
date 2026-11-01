import type { Metadata } from "next";
import { ArrowDown, ArrowUpRight, Eye, Layers3, Search, ShieldCheck } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Quem somos",
  description: "Conheça a Kioo Africa, uma iniciativa editorial independente com raízes em Angola, África do Sul e Uganda, dedicada a pesquisa e jornalismo rigorosos.",
};

const principles = [
  { icon: <Search size={20} />, number: "01", title: "Investigamos antes de repetir.", text: "Cada história começa com perguntas, fontes identificáveis e atenção ao contexto. Procuramos dados primários e experiências locais; quando a informação é incerta, dizemos." },
  { icon: <Eye size={20} />, number: "02", title: "A pluralidade é parte do método.", text: "África não é um mercado único nem uma única narrativa. Damos espaço às diferenças entre países, setores e comunidades, com as pessoas que conhecem cada contexto." },
  { icon: <ShieldCheck size={20} />, number: "03", title: "O rigor não está à venda.", text: "A redação decide o que publicar. Uma parceria paga pode financiar distribuição e conteúdo patrocinado identificado; não compra cobertura favorável, biografias editoriais ou conclusões." },
];

export default function AboutPage() {
  return (
    <>
      <section className="about-masthead">
        <div className="about-masthead-copy">
          <span className="section-kicker"><span className="about-live-dot" /> UM MOVIMENTO INDEPENDENTE, COM RAÍZES EM ÁFRICA</span>
          <h1>Uma ideia que<br />cruzou <em>fronteiras.</em></h1>
          <p className="about-hero-description">Nascemos da convicção de estudantes universitários de que as histórias africanas merecem ser pesquisadas, contadas e compreendidas a partir das próprias realidades do continente.</p>
          <div className="about-hero-actions">
            <Link href="#origens" className="button button-light">Conheça as nossas raízes <ArrowDown size={15} /></Link>
            <span>INDEPENDÊNCIA · PESQUISA · PERSPECTIVA</span>
          </div>
        </div>
        <div className="about-origin-visual" aria-hidden="true">
          <div className="about-origin-orbit about-origin-orbit-outer" />
          <div className="about-origin-orbit about-origin-orbit-inner" />
          <span className="about-origin-star">✳</span>
          <span className="about-origin-mark">K</span>
          <span className="about-origin-visual-caption">UM CONTINENTE<br />MUITAS PERSPETIVAS</span>
        </div>
        <div className="about-hero-footer">
          <span>AS NOSSAS RAÍZES</span>
          <div><span>ÁFRICA DO SUL</span><i /><span>ANGOLA</span><i /><span>UGANDA</span></div>
          <span>UMA CONVERSA SEM FRONTEIRAS <ArrowDown size={13} /></span>
        </div>
      </section>
      <section className="about-origin" id="origens" aria-labelledby="about-origin-title">
        <div className="about-origin-heading">
          <span className="section-kicker">DE ONDE VIEMOS · PARA ONDE VAMOS</span>
          <h2 id="about-origin-title">Três pontos de partida.<br /><em>Uma convicção comum.</em></h2>
        </div>
        <div className="about-origin-story">
          <span className="about-origin-number">01 / AS ORIGENS</span>
          <p>A história da Kioo Africa começa com estudantes universitários na <strong>África do Sul, em Angola e no Uganda</strong>. Em contextos diferentes, partilhavam a mesma inquietação: demasiadas vezes, o continente era explicado por outros — e as suas próprias ideias, investigação e vozes ficavam à margem.</p>
          <p>Da aproximação entre esses estudantes nasceu um movimento independente. O que começou como vontade de pesquisar, dialogar e dar espaço a perspetivas africanas foi consolidado numa iniciativa editorial com uma missão mais ampla: aproximar conhecimento, pessoas e mercados sem apagar as diferenças que fazem cada realidade única.</p>
          <p>Hoje, essa origem continua a orientar o nosso trabalho. Crescer, para nós, significa aprofundar a pesquisa, ampliar a conversa e ganhar a confiança de quem procura compreender África com mais rigor — não falar em nome de um continente diverso.</p>
        </div>
        <div className="about-origin-countries" aria-label="Países de origem do movimento">
          <article><span>01</span><strong>África do Sul</strong><small>RAIZ · INICIATIVA ESTUDANTIL</small></article>
          <article><span>02</span><strong>Angola</strong><small>RAIZ · INICIATIVA ESTUDANTIL</small></article>
          <article><span>03</span><strong>Uganda</strong><small>RAIZ · INICIATIVA ESTUDANTIL</small></article>
        </div>
      </section>
      <section className="about-manifesto">
        <div className="manifesto-index"><span>02 — O SIGNIFICADO</span><span>UM ESPELHO<br />PARA AVANÇAR.</span></div>
        <div><p className="manifesto-quote">Uma lente independente<br /><em>sobre África.</em></p><p className="manifesto-copy">Kioo significa “espelho” em suaíli. Para nós, é uma metáfora editorial: refletir mercados, ideias e percursos africanos com contexto, vozes locais e rigor — mostrando também o que está a mudar e quem o transforma.</p></div>
      </section>
      <section className="about-principles section-pad" id="principios">
        <div className="section-heading"><div><span className="section-kicker">A NOSSA RESPONSABILIDADE</span><h2>O método é<br /><em>parte da história.</em></h2></div><span className="principle-side-note">OS PRINCÍPIOS NÃO<br />MUDAM COM O TEMA.</span></div>
        <div className="principle-list">{principles.map((principle) => <article className="principle-row" key={principle.number}><span className="principle-icon">{principle.icon}</span><span className="principle-number">{principle.number}</span><div><h3>{principle.title}</h3><p>{principle.text}</p></div><ArrowUpRight className="principle-arrow" size={18} /></article>)}</div>
        <div className="funding-note"><span>✳</span><p><strong>Como nos sustentamos.</strong> Leitores, publicidade e parcerias identificadas podem financiar a operação. O financiamento nunca determina a seleção das histórias, o resultado da pesquisa ou a inclusão de uma pessoa numa biografia editorial.</p></div>
      </section>
      <section className="about-method">
        <div><span className="section-kicker">UM MÉTODO, NÃO UM PALPITE</span><h2>Pesquisa que começa<br /><em>por ouvir.</em></h2></div>
        <div className="method-steps"><div><span>01 / OUVIR</span><p>Conversamos com as pessoas que vivem e trabalham em cada mercado.</p></div><div><span>02 / VERIFICAR</span><p>Procuramos fontes independentes e deixamos claro de onde vêm as informações.</p></div><div><span>03 / EXPLICAR</span><p>Ligamos os factos ao contexto — e o contexto à vida real.</p></div></div>
      </section>
      <section className="about-scope section-pad">
        <div className="about-scope-heading"><span className="section-kicker">O QUE ACOMPANHAMOS</span><h2>Um continente diverso.<br /><em>Muitas realidades.</em></h2></div>
        <div className="about-scope-grid">
          <article><span>01 / MERCADOS</span><h3>Economias em transformação.</h3><p>Negócios, investimento, comércio e políticas públicas — sempre com atenção às diferenças entre países e setores.</p></article>
          <article><span>02 / TECNOLOGIA</span><h3>Inovação com contexto.</h3><p>Infraestrutura, empresas e competências digitais, incluindo quem consegue aceder e participar nesses avanços.</p></article>
          <article><span>03 / CULTURA</span><h3>Ideias que criam valor.</h3><p>Media, indústrias criativas e as pessoas que ampliam a circulação de histórias e conhecimento africanos.</p></article>
          <article><span>04 / PERCURSOS</span><h3>Biografias sem atalhos.</h3><p>Perfis baseados em fontes, que explicam decisões, trabalho e contexto sem confundir promoção com reportagem.</p></article>
        </div>
      </section>
      <section className="about-corrections">
        <div><span className="section-kicker">TRANSPARÊNCIA EDITORIAL</span><h2>Precisão é um<br /><em>trabalho contínuo.</em></h2></div>
        <div className="about-corrections-copy">
          <p>Indicamos as fontes e procuramos separar factos, estimativas e análise. Quando um dado é reportado por uma organização, identificamos essa origem em vez de o apresentar como investigação própria.</p>
          <p>Se encontrar um erro factual ou tiver documentação relevante, escreva à redação. Analisamos pedidos de correção e, quando procedem, atualizamos o conteúdo com clareza.</p>
          <Link className="text-link" href="/publicar">Contactar a redação <ArrowUpRight size={14} /></Link>
        </div>
      </section>
      <section className="reference-note">
        <span className="section-kicker">O QUE ESTUDÁMOS</span>
        <p>Estudámos o jornalismo e os envios de artigos da <a href="https://techcabal.com/about/" target="_blank" rel="noreferrer">TechCabal</a>, a separação entre publicidade e redação nas <a href="https://techcabal.com/standards-and-policies/" target="_blank" rel="noreferrer">políticas editoriais</a>, os <a href="https://disruptafrica.com/research/" target="_blank" rel="noreferrer">relatórios de pesquisa da Disrupt Africa</a>, a experiência de revista e assinatura da <a href="https://www.african.business/" target="_blank" rel="noreferrer">African Business</a>, a hierarquia de notícias da <a href="https://www.forbesafrica.com/" target="_blank" rel="noreferrer">Forbes Africa</a> e as ferramentas de publicação independente da <a href="https://substack.com/" target="_blank" rel="noreferrer">Substack</a>. A Kioo é uma identidade própria: não é uma extensão dessas publicações e mantém a seleção editorial independente de qualquer compra.</p>
      </section>
      <section className="about-invite"><Layers3 size={25} /><div><span className="section-kicker">UMA CONVERSA ABERTA</span><h2>As histórias que faltam<br />podem começar consigo.</h2></div><Link href="/publicar" className="button button-dark">Fale com a redação <ArrowUpRight size={15} /></Link></section>
    </>
  );
}
