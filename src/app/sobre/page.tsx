import type { Metadata } from "next";
import { ArrowDown, ArrowUpRight, Eye, Layers3, Search, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { getLocale } from "@/lib/locale.server";
import { createPageMetadata } from "@/lib/page-metadata";

export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return createPageMetadata({
    locale,
    kind: "about",
    path: "/sobre",
    eyebrow: locale === "en" ? "INDEPENDENT · AFRICAN-ROOTED" : "INDEPENDENTE · COM RAÍZES EM ÁFRICA",
    title: locale === "en" ? "About Kioo Africa" : "Kioo Africa | Quem somos",
    description: locale === "en"
      ? "Kioo Africa is an independent digital editorial initiative covering African markets, technology, culture, research and biographies. Its official Facebook page is Kioo Africa Angola."
      : "A Kioo Africa é uma iniciativa editorial digital independente sobre mercados africanos, tecnologia, cultura, pesquisa e biografias. A página oficial no Facebook é Kioo Africa Angola.",
  });
}

export default async function AboutPage() {
  const locale = await getLocale();
  const en = locale === "en";
  const principles = en
    ? [
        { icon: <Search size={20} />, number: "01", title: "We investigate before we repeat.", text: "Every story begins with questions, identifiable sources and attention to context. We seek primary data and local experience; when information is uncertain, we say so." },
        { icon: <Eye size={20} />, number: "02", title: "Plurality is part of the method.", text: "Africa is neither a single market nor a single story. We make room for differences between countries, sectors and communities, alongside people who know each context." },
        { icon: <ShieldCheck size={20} />, number: "03", title: "Rigour is not for sale.", text: "The newsroom decides what to publish. A paid partnership may fund distribution and clearly labelled sponsored content; it cannot buy favourable coverage, editorial biographies or conclusions." },
      ]
    : [
        { icon: <Search size={20} />, number: "01", title: "Investigamos antes de repetir.", text: "Cada história começa com perguntas, fontes identificáveis e atenção ao contexto. Procuramos dados primários e experiências locais; quando a informação é incerta, dizemos." },
        { icon: <Eye size={20} />, number: "02", title: "A pluralidade é parte do método.", text: "África não é um mercado único nem uma única narrativa. Damos espaço às diferenças entre países, setores e comunidades, com as pessoas que conhecem cada contexto." },
        { icon: <ShieldCheck size={20} />, number: "03", title: "O rigor não está à venda.", text: "A redação decide o que publicar. Uma parceria paga pode financiar distribuição e conteúdo patrocinado identificado; não compra cobertura favorável, biografias editoriais ou conclusões." },
      ];
  return (
    <>
      <section className="about-masthead">
        <div className="about-masthead-copy">
          <span className="section-kicker"><span className="about-live-dot" /> {en ? "AN INDEPENDENT MOVEMENT, ROOTED IN AFRICA" : "UM MOVIMENTO INDEPENDENTE, COM RAÍZES EM ÁFRICA"}</span>
          <h1>{en ? <>An idea that<br />crossed <em>borders.</em></> : <>Uma ideia que<br />cruzou <em>fronteiras.</em></>}</h1>
          <p className="about-hero-description">{en
            ? "We began with a conviction shared by university students: African stories deserve to be researched, told and understood from the continent's own realities."
            : "Nascemos da convicção de estudantes universitários de que as histórias africanas merecem ser pesquisadas, contadas e compreendidas a partir das próprias realidades do continente."}</p>
          <div className="about-hero-actions">
            <Link href="#origens" className="button button-light">{en ? "Discover our roots" : "Conheça as nossas raízes"} <ArrowDown size={15} /></Link>
            <span>{en ? "INDEPENDENCE · RESEARCH · PERSPECTIVE" : "INDEPENDÊNCIA · PESQUISA · PERSPECTIVA"}</span>
          </div>
        </div>
        <div className="about-origin-visual" aria-hidden="true">
          <div className="about-origin-orbit about-origin-orbit-outer" />
          <div className="about-origin-orbit about-origin-orbit-inner" />
          <span className="about-origin-star">✳</span>
          <span className="about-origin-mark">K</span>
          <span className="about-origin-visual-caption">{en ? <>ONE CONTINENT<br />MANY PERSPECTIVES</> : <>UM CONTINENTE<br />MUITAS PERSPETIVAS</>}</span>
        </div>
        <div className="about-hero-footer">
          <span>{en ? "OUR ROOTS" : "AS NOSSAS RAÍZES"}</span>
          <div><span>{en ? "SOUTH AFRICA" : "ÁFRICA DO SUL"}</span><i /><span>ANGOLA</span><i /><span>UGANDA</span></div>
          <span>{en ? "A CONVERSATION WITHOUT BORDERS" : "UMA CONVERSA SEM FRONTEIRAS"} <ArrowDown size={13} /></span>
        </div>
      </section>
      <section className="about-origin" id="origens" aria-labelledby="about-origin-title">
        <div className="about-origin-heading">
          <span className="section-kicker">{en ? "WHERE WE COME FROM · WHERE WE ARE GOING" : "DE ONDE VIEMOS · PARA ONDE VAMOS"}</span>
          <h2 id="about-origin-title">{en ? <>Three starting points.<br /><em>One shared conviction.</em></> : <>Três pontos de partida.<br /><em>Uma convicção comum.</em></>}</h2>
        </div>
        <div className="about-origin-story">
          <span className="about-origin-number">{en ? "01 / OUR ORIGINS" : "01 / AS ORIGENS"}</span>
          {en ? <>
            <p><strong>Kioo Africa is an independent digital editorial initiative</strong> covering African markets, business, technology, culture, research and biographies. It began with university students in <strong>South Africa, Angola and Uganda</strong> who shared a concern: too often, the continent was explained by others while its own ideas, research and voices were pushed to the margins.</p>
            <p>An independent movement grew from those students coming together. What began as a desire to research, exchange ideas and make room for African perspectives became an editorial initiative with a broader mission: to bring knowledge, people and markets closer without erasing the differences that make each reality unique.</p>
            <p>That origin still guides our work. For us, growth means deeper research, a wider conversation and earning the trust of people seeking to understand Africa with greater rigour — not speaking on behalf of a diverse continent.</p>
          </> : <>
            <p><strong>A Kioo Africa é uma iniciativa editorial digital independente</strong> sobre mercados africanos, negócios, tecnologia, cultura, pesquisa e biografias. A sua história começa com estudantes universitários na <strong>África do Sul, em Angola e no Uganda</strong> que partilhavam a mesma inquietação: demasiadas vezes, o continente era explicado por outros — e as suas próprias ideias, investigação e vozes ficavam à margem.</p>
            <p>Da aproximação entre esses estudantes nasceu um movimento independente. O que começou como vontade de pesquisar, dialogar e dar espaço a perspetivas africanas foi consolidado numa iniciativa editorial com uma missão mais ampla: aproximar conhecimento, pessoas e mercados sem apagar as diferenças que fazem cada realidade única.</p>
            <p>Hoje, essa origem continua a orientar o nosso trabalho. Crescer, para nós, significa aprofundar a pesquisa, ampliar a conversa e ganhar a confiança de quem procura compreender África com mais rigor — não falar em nome de um continente diverso.</p>
          </>}
        </div>
        <div className="about-origin-countries" aria-label="Países de origem do movimento">
          <article><span>01</span><strong>{en ? "South Africa" : "África do Sul"}</strong><small>{en ? "ROOT · STUDENT INITIATIVE" : "RAIZ · INICIATIVA ESTUDANTIL"}</small></article>
          <article><span>02</span><strong>Angola</strong><small>{en ? "ROOT · STUDENT INITIATIVE" : "RAIZ · INICIATIVA ESTUDANTIL"}</small></article>
          <article><span>03</span><strong>Uganda</strong><small>{en ? "ROOT · STUDENT INITIATIVE" : "RAIZ · INICIATIVA ESTUDANTIL"}</small></article>
        </div>
      </section>
      <section className="about-manifesto">
        <div className="manifesto-index"><span>{en ? "02 — THE MEANING" : "02 — O SIGNIFICADO"}</span><span>{en ? <>A MIRROR<br />FOR MOVING FORWARD.</> : <>UM ESPELHO<br />PARA AVANÇAR.</>}</span></div>
        <div>
          <p className="manifesto-quote">{en ? <>An independent lens<br /><em>on Africa.</em></> : <>Uma lente independente<br /><em>sobre África.</em></>}</p>
          <p className="manifesto-copy">{en
            ? "Kioo means “mirror” in Swahili. For us, it is an editorial metaphor: reflecting African markets, ideas and journeys with context, local voices and rigour — showing what is changing and who is shaping it."
            : "Kioo significa “espelho” em suaíli. Para nós, é uma metáfora editorial: refletir mercados, ideias e percursos africanos com contexto, vozes locais e rigor — mostrando também o que está a mudar e quem o transforma."}</p>
        </div>
      </section>
      <section className="about-principles section-pad" id="principios">
        <div className="section-heading"><div><span className="section-kicker">{en ? "OUR RESPONSIBILITY" : "A NOSSA RESPONSABILIDADE"}</span><h2>{en ? <>The method is<br /><em>part of the story.</em></> : <>O método é<br /><em>parte da história.</em></>}</h2></div><span className="principle-side-note">{en ? <>OUR PRINCIPLES<br />DO NOT CHANGE WITH THE SUBJECT.</> : <>OS PRINCÍPIOS NÃO<br />MUDAM COM O TEMA.</>}</span></div>
        <div className="principle-list">{principles.map((principle) => <article className="principle-row" key={principle.number}><span className="principle-icon">{principle.icon}</span><span className="principle-number">{principle.number}</span><div><h3>{principle.title}</h3><p>{principle.text}</p></div><ArrowUpRight className="principle-arrow" size={18} /></article>)}</div>
        <div className="funding-note"><span>✳</span><p><strong>{en ? "How we are funded." : "Como nos sustentamos."}</strong> {en
          ? "Readers, advertising and clearly labelled partnerships may fund our work. Funding never determines story selection, research findings or inclusion in an editorial biography."
          : "Leitores, publicidade e parcerias identificadas podem financiar a operação. O financiamento nunca determina a seleção das histórias, o resultado da pesquisa ou a inclusão de uma pessoa numa biografia editorial."}</p></div>
      </section>
      <section className="about-method">
        <div><span className="section-kicker">{en ? "A METHOD, NOT A GUESS" : "UM MÉTODO, NÃO UM PALPITE"}</span><h2>{en ? <>Research begins<br /><em>by listening.</em></> : <>Pesquisa que começa<br /><em>por ouvir.</em></>}</h2></div>
        <div className="method-steps">
          <div><span>{en ? "01 / LISTEN" : "01 / OUVIR"}</span><p>{en ? "We speak with people who live and work in each market." : "Conversamos com as pessoas que vivem e trabalham em cada mercado."}</p></div>
          <div><span>{en ? "02 / VERIFY" : "02 / VERIFICAR"}</span><p>{en ? "We seek independent sources and make clear where information comes from." : "Procuramos fontes independentes e deixamos claro de onde vêm as informações."}</p></div>
          <div><span>{en ? "03 / EXPLAIN" : "03 / EXPLICAR"}</span><p>{en ? "We connect facts to context — and context to real life." : "Ligamos os factos ao contexto — e o contexto à vida real."}</p></div>
        </div>
      </section>
      <section className="about-scope section-pad">
        <div className="about-scope-heading"><span className="section-kicker">{en ? "WHAT WE FOLLOW" : "O QUE ACOMPANHAMOS"}</span><h2>{en ? <>One diverse continent.<br /><em>Many realities.</em></> : <>Um continente diverso.<br /><em>Muitas realidades.</em></>}</h2></div>
        <div className="about-scope-grid">
          <article><span>01 / {en ? "MARKETS" : "MERCADOS"}</span><h3>{en ? "Economies in transition." : "Economias em transformação."}</h3><p>{en ? "Business, investment, trade and public policy — always attentive to differences between countries and sectors." : "Negócios, investimento, comércio e políticas públicas — sempre com atenção às diferenças entre países e setores."}</p></article>
          <article><span>02 / {en ? "TECHNOLOGY" : "TECNOLOGIA"}</span><h3>{en ? "Innovation in context." : "Inovação com contexto."}</h3><p>{en ? "Infrastructure, companies and digital skills, including who can access and participate in these advances." : "Infraestrutura, empresas e competências digitais, incluindo quem consegue aceder e participar nesses avanços."}</p></article>
          <article><span>03 / {en ? "CULTURE" : "CULTURA"}</span><h3>{en ? "Ideas that create value." : "Ideias que criam valor."}</h3><p>{en ? "Media, creative industries and people widening the circulation of African stories and knowledge." : "Media, indústrias criativas e as pessoas que ampliam a circulação de histórias e conhecimento africanos."}</p></article>
          <article><span>04 / {en ? "JOURNEYS" : "PERCURSOS"}</span><h3>{en ? "Biographies without shortcuts." : "Biografias sem atalhos."}</h3><p>{en ? "Source-based profiles explaining decisions, work and context without confusing promotion with reporting." : "Perfis baseados em fontes, que explicam decisões, trabalho e contexto sem confundir promoção com reportagem."}</p></article>
        </div>
      </section>
      <section className="about-corrections">
        <div><span className="section-kicker">{en ? "EDITORIAL TRANSPARENCY" : "TRANSPARÊNCIA EDITORIAL"}</span><h2>{en ? <>Accuracy is<br /><em>ongoing work.</em></> : <>Precisão é um<br /><em>trabalho contínuo.</em></>}</h2></div>
        <div className="about-corrections-copy">
          <p>{en ? "We cite sources and seek to distinguish facts, estimates and analysis. When an organisation reports a figure, we identify that source instead of presenting it as our own research." : "Indicamos as fontes e procuramos separar factos, estimativas e análise. Quando um dado é reportado por uma organização, identificamos essa origem em vez de o apresentar como investigação própria."}</p>
          <p>{en ? "If you find a factual error or have relevant documentation, contact the newsroom. We review correction requests and update content transparently when warranted." : "Se encontrar um erro factual ou tiver documentação relevante, escreva à redação. Analisamos pedidos de correção e, quando procedem, atualizamos o conteúdo com clareza."}</p>
          <Link className="text-link" href="/contacto">{en ? "Contact the newsroom" : "Contactar a redação"} <ArrowUpRight size={14} /></Link>
        </div>
      </section>
      <section className="reference-note">
        <span className="section-kicker">{en ? "WHAT INFORMED OUR WORK" : "O QUE ESTUDÁMOS"}</span>
        <p>{en ? <>We studied TechCabal&apos;s journalism and article submissions, the separation between advertising and the newsroom in its <a href="https://techcabal.com/standards-and-policies/" target="_blank" rel="noreferrer">editorial policies</a>, Disrupt Africa&apos;s <a href="https://disruptafrica.com/research/" target="_blank" rel="noreferrer">research reports</a>, the magazine and subscription experience of <a href="https://www.african.business/" target="_blank" rel="noreferrer">African Business</a>, the news hierarchy of <a href="https://www.forbesafrica.com/" target="_blank" rel="noreferrer">Forbes Africa</a>, and the independent publishing tools of <a href="https://substack.com/" target="_blank" rel="noreferrer">Substack</a>. Kioo has its own identity: it is not an extension of these publications, and its editorial selection remains independent of any purchase.</> : <>Estudámos o jornalismo e os envios de artigos da <a href="https://techcabal.com/about/" target="_blank" rel="noreferrer">TechCabal</a>, a separação entre publicidade e redação nas <a href="https://techcabal.com/standards-and-policies/" target="_blank" rel="noreferrer">políticas editoriais</a>, os <a href="https://disruptafrica.com/research/" target="_blank" rel="noreferrer">relatórios de pesquisa da Disrupt Africa</a>, a experiência de revista e assinatura da <a href="https://www.african.business/" target="_blank" rel="noreferrer">African Business</a>, a hierarquia de notícias da <a href="https://www.forbesafrica.com/" target="_blank" rel="noreferrer">Forbes Africa</a> e as ferramentas de publicação independente da <a href="https://substack.com/" target="_blank" rel="noreferrer">Substack</a>. A Kioo é uma identidade própria: não é uma extensão dessas publicações e mantém a seleção editorial independente de qualquer compra.</>}</p>
      </section>
      <section className="about-invite"><Layers3 size={25} /><div><span className="section-kicker">{en ? "AN OPEN CONVERSATION" : "UMA CONVERSA ABERTA"}</span><h2>{en ? <>The stories still missing<br />can start with you.</> : <>As histórias que faltam<br />podem começar consigo.</>}</h2></div><Link href="/publicar" className="button button-dark">{en ? "Contact the newsroom" : "Fale com a redação"} <ArrowUpRight size={15} /></Link></section>
    </>
  );
}
