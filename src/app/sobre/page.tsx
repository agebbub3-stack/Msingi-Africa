import type { Metadata } from "next";
import { ArrowUpRight, Eye, Layers3, Search, ShieldCheck } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Quem somos",
  description: "Conheça a missão, o método de pesquisa e os princípios editoriais independentes da Msingi Africa.",
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
        <span className="section-kicker">UMA REDAÇÃO INDEPENDENTE. UMA CURIOSIDADE SEM FRONTEIRAS.</span>
        <h1>Mais contexto.<br />Menos <em>atalhos.</em></h1>
        <div className="about-lede"><span>MS / ABOUT</span><p>Somos a Msingi Africa: um grupo independente de pesquisa e jornalismo que acompanha as ideias, os negócios e as pessoas a transformar os mercados africanos.</p></div>
        <div className="about-asterisk" aria-hidden="true">✳</div>
      </section>
      <section className="about-manifesto">
        <div className="manifesto-index"><span>01 — MANIFESTO</span><span>FUNDAMENTO<br />PARA O DEBATE.</span></div>
        <div><p className="manifesto-quote">“Msingi” significa <em>fundamento.</em></p><p className="manifesto-copy">Escolhemos este nome porque acreditamos que decisões melhores começam com informação que explica, não apenas anuncia. A nossa missão é aproximar quem lê dos contextos que moldam o continente — com independência, respeito e curiosidade.</p></div>
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
        <p>Estudámos o jornalismo e os envios de artigos da <a href="https://techcabal.com/about/" target="_blank" rel="noreferrer">TechCabal</a>, a separação entre publicidade e redação nas <a href="https://techcabal.com/standards-and-policies/" target="_blank" rel="noreferrer">políticas editoriais</a>, os <a href="https://disruptafrica.com/research/" target="_blank" rel="noreferrer">relatórios de pesquisa da Disrupt Africa</a>, a experiência de revista e assinatura da <a href="https://www.african.business/" target="_blank" rel="noreferrer">African Business</a>, a hierarquia de notícias da <a href="https://www.forbesafrica.com/" target="_blank" rel="noreferrer">Forbes Africa</a> e as ferramentas de publicação independente da <a href="https://substack.com/" target="_blank" rel="noreferrer">Substack</a>. A Msingi é uma identidade própria: não é uma extensão dessas publicações e mantém a seleção editorial independente de qualquer compra.</p>
      </section>
      <section className="about-invite"><Layers3 size={25} /><div><span className="section-kicker">UMA CONVERSA ABERTA</span><h2>As histórias que faltam<br />podem começar consigo.</h2></div><Link href="/publicar" className="button button-dark">Fale com a redação <ArrowUpRight size={15} /></Link></section>
    </>
  );
}
