import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight, Check, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { promotionPackages } from "@/lib/paid-promotions";
import { getLocale } from "@/lib/locale.server";
import { createPageMetadata } from "@/lib/page-metadata";

export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return createPageMetadata({
    locale,
    kind: "plans",
    path: "/planos",
    eyebrow: locale === "en" ? "CREATOR & BRAND OPTIONS" : "OPÇÕES PARA AUTORES E MARCAS",
    title: locale === "en" ? "Plans for creators and brands" : "Planos para autores e marcas",
    description: locale === "en"
      ? "Compare free editorial submissions, the Creator Plus subscription and Kioo Africa's sponsored-content packages."
      : "Compare a participação editorial gratuita, a assinatura Creator Plus e os pacotes de conteúdo patrocinado da Kioo Africa.",
  });
}

export default async function PlansPage() {
  const locale = await getLocale();
  const en = locale === "en";
  const creatorFeatures = en
    ? ["Submit articles and biographies for editorial review", "Create a public contributor profile", "Track the status of your submissions"]
    : ["Submeta artigos e biografias para revisão editorial", "Crie um perfil público de autor", "Acompanhe o estado das suas submissões"];
  const packageTranslations: Record<string, { name: string; description: string; includes: string[] }> = en
    ? {
        "sponsored-note": {
          name: "Brand note",
          description: "A sponsored introduction to your brand.",
          includes: ["Short sponsored format", "One client-supplied image", "Clearly labelled as sponsored"],
        },
        "sponsored-story": {
          name: "Sponsored story",
          description: "A brand article presented transparently.",
          includes: ["Sponsored article up to 800 words", "Dedicated page on the website", "Clear partnership disclosure"],
        },
        "sponsored-feature": {
          name: "Campaign feature",
          description: "A sponsored campaign with wider distribution.",
          includes: ["Sponsored article up to 800 words", "Newsletter feature", "Campaign placement for seven days"],
        },
      }
    : {};
  return (
    <div className="plans-page">
      <header className="plans-masthead">
        <span className="section-kicker">{en ? "PARTICIPATE WITH CLARITY" : "PARTICIPAR, COM CLAREZA"}</span>
        <h1>{en ? <>A good story<br />does not need <em>a plan.</em></> : <>Uma boa história<br />não depende de <em>um plano.</em></>}</h1>
        <p>{en
          ? "Editorial decisions are independent. Creator plans make it easier to include sources; paid packages are advertising and always labelled."
          : "As decisões editoriais são independentes. Os planos de autor facilitam o envio de fontes; os pacotes pagos são publicidade, sempre identificada."}</p>
      </header>

      <section className="section-pad plans-content" aria-labelledby="creator-plans-title">
        <div className="section-heading">
          <div><span className="section-kicker">{en ? "FOR CREATORS" : "PARA AUTORES"}</span><h2 id="creator-plans-title">{en ? <>Your voice, <em>well researched.</em></> : <>A sua voz, <em>bem apurada.</em></>}</h2></div>
          <p>{en ? "Every submission is reviewed. Payment does not guarantee approval or publication." : "Todos os conteúdos passam por revisão. Pagar não garante aprovação nem publicação."}</p>
        </div>
        <div className="plan-grid">
          <article className="plan-card">
            <span className="plan-eyebrow">{en ? "A PLACE TO START" : "PARA COMEÇAR"}</span>
            <h3>{en ? "Free" : "Gratuito"}</h3>
            <p className="plan-price">US$ 0 <span>{en ? "/ forever" : "/ sempre"}</span></p>
            <p className="plan-description">{en ? "Join the conversation and send an editorial proposal to the newsroom." : "Participe na conversa e envie uma proposta editorial à redação."}</p>
            <ul>{creatorFeatures.map((feature) => <li key={feature}><Check size={16} />{feature}</li>)}</ul>
            <p className="plan-footnote">{en ? "Free submissions cannot include external links or sources in the text." : "As submissões gratuitas não podem incluir ligações externas ou fontes no texto."}</p>
            <Link className="button button-secondary" href="/publicar">{en ? "Submit a proposal" : "Enviar uma proposta"} <ArrowRight size={15} /></Link>
          </article>

          <article className="plan-card plan-card-featured">
            <span className="plan-eyebrow">{en ? "FOR RESEARCHERS" : "PARA QUEM INVESTIGA"}</span>
            <h3>Creator Plus</h3>
            <p className="plan-price">US$ 5 <span>{en ? "/ month" : "/ mês"}</span></p>
            <p className="plan-description">{en ? "Submit work with links and verifiable references." : "Submeta trabalhos com ligações e referências verificáveis."}</p>
            <ul>
              {creatorFeatures.map((feature) => <li key={feature}><Check size={16} />{feature}</li>)}
              <li><Check size={16} />{en ? "Add up to 20 HTTPS sources to each submission" : "Adicione até 20 fontes HTTPS a cada submissão"}</li>
              <li><Check size={16} />{en ? "Include external links in your article" : "Inclua ligações externas no artigo"}</li>
            </ul>
            <p className="plan-footnote">{en ? "Manage or cancel your subscription in the creator dashboard." : "A assinatura é gerida no painel do autor e pode ser cancelada."}</p>
            <Link className="button button-dark" href="/entrar?callbackURL=%2Fpainel">{en ? "Explore Creator Plus" : "Conhecer Creator Plus"} <ArrowUpRight size={15} /></Link>
          </article>
        </div>
      </section>

      <section className="section-pad sponsored-plans" aria-labelledby="sponsored-plans-title">
        <div className="section-heading">
          <div><span className="section-kicker">{en ? "FOR BRANDS AND ORGANISATIONS" : "PARA MARCAS E ORGANIZAÇÕES"}</span><h2 id="sponsored-plans-title">{en ? <>Transparent <em>communication.</em></> : <>Comunicação <em>transparente.</em></>}</h2></div>
          <p>{en ? "Sponsored content is commercial, reviewed for suitability and never presented as independent reporting." : "Conteúdo patrocinado é comercial, passa por análise de adequação e nunca é apresentado como reportagem independente."}</p>
        </div>
        <div className="sponsored-plan-grid">
          {promotionPackages.map((promotion) => (
            <article className="sponsored-plan-card" key={promotion.id}>
              <span className="plan-eyebrow">{en ? "SPONSORED CONTENT" : "CONTEÚDO PATROCINADO"}</span>
              <h3>{packageTranslations[promotion.id]?.name ?? promotion.name}</h3>
              <p className="plan-price">US${promotion.price} <span>{en ? "/ proposal" : "/ proposta"}</span></p>
              <p className="plan-description">{packageTranslations[promotion.id]?.description ?? promotion.description}</p>
              <ul>{(packageTranslations[promotion.id]?.includes ?? promotion.includes).map((item) => <li key={item}><Check size={15} />{item}</li>)}</ul>
              <Link className="text-link" href="/publicar#proposal-type">{en ? "View proposal" : "Ver proposta"} <ArrowUpRight size={15} /></Link>
            </article>
          ))}
        </div>
        <p className="plans-disclosure"><ShieldCheck size={16} /> {en
          ? "Payment covers the review of a commercial proposal. If it is declined, the fee is refunded. Editorial biographies and decisions are never for sale."
          : "O pagamento cobre a avaliação da proposta comercial. Se for recusada, o valor é reembolsado. Não se vendem biografias nem decisões editoriais."}</p>
      </section>
    </div>
  );
}
