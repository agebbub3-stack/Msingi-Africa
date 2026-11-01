import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight, Check, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { promotionPackages } from "@/lib/paid-promotions";

export const metadata: Metadata = {
  title: "Planos para autores e marcas",
  description:
    "Compare a participação editorial gratuita, a assinatura Creator Plus e os pacotes de conteúdo patrocinado da Bantaba Africa.",
  alternates: { canonical: "/planos" },
};

const creatorFeatures = [
  "Submeta artigos e biografias para revisão editorial",
  "Crie um perfil público de autor",
  "Acompanhe o estado das suas submissões",
];

export default function PlansPage() {
  return (
    <div className="plans-page">
      <header className="plans-masthead">
        <span className="section-kicker">PARTICIPAR, COM CLAREZA</span>
        <h1>Uma boa história<br />não depende de <em>um plano.</em></h1>
        <p>As decisões editoriais são independentes. Os planos de autor facilitam o envio de fontes; os pacotes pagos são publicidade, sempre identificada.</p>
      </header>

      <section className="section-pad plans-content" aria-labelledby="creator-plans-title">
        <div className="section-heading">
          <div><span className="section-kicker">PARA AUTORES</span><h2 id="creator-plans-title">A sua voz, <em>bem apurada.</em></h2></div>
          <p>Todos os conteúdos passam por revisão. Pagar não garante aprovação nem publicação.</p>
        </div>
        <div className="plan-grid">
          <article className="plan-card">
            <span className="plan-eyebrow">PARA COMEÇAR</span>
            <h3>Gratuito</h3>
            <p className="plan-price">US$ 0 <span>/ sempre</span></p>
            <p className="plan-description">Participe na conversa e envie uma proposta editorial à redação.</p>
            <ul>{creatorFeatures.map((feature) => <li key={feature}><Check size={16} />{feature}</li>)}</ul>
            <p className="plan-footnote">As submissões gratuitas não podem incluir ligações externas ou fontes no texto.</p>
            <Link className="button button-secondary" href="/publicar">Enviar uma proposta <ArrowRight size={15} /></Link>
          </article>

          <article className="plan-card plan-card-featured">
            <span className="plan-eyebrow">PARA QUEM INVESTIGA</span>
            <h3>Creator Plus</h3>
            <p className="plan-price">US$ 5 <span>/ mês</span></p>
            <p className="plan-description">Submeta trabalhos com ligações e referências verificáveis.</p>
            <ul>
              {creatorFeatures.map((feature) => <li key={feature}><Check size={16} />{feature}</li>)}
              <li><Check size={16} />Adicione até 20 fontes HTTPS a cada submissão</li>
              <li><Check size={16} />Inclua ligações externas no artigo</li>
            </ul>
            <p className="plan-footnote">A assinatura é gerida no painel do autor e pode ser cancelada.</p>
            <Link className="button button-dark" href="/entrar?callbackURL=%2Fpainel">Conhecer Creator Plus <ArrowUpRight size={15} /></Link>
          </article>
        </div>
      </section>

      <section className="section-pad sponsored-plans" aria-labelledby="sponsored-plans-title">
        <div className="section-heading">
          <div><span className="section-kicker">PARA MARCAS E ORGANIZAÇÕES</span><h2 id="sponsored-plans-title">Comunicação <em>transparente.</em></h2></div>
          <p>Conteúdo patrocinado é comercial, passa por análise de adequação e nunca é apresentado como reportagem independente.</p>
        </div>
        <div className="sponsored-plan-grid">
          {promotionPackages.map((promotion) => (
            <article className="sponsored-plan-card" key={promotion.id}>
              <span className="plan-eyebrow">CONTEÚDO PATROCINADO</span>
              <h3>{promotion.name}</h3>
              <p className="plan-price">US${promotion.price} <span>/ proposta</span></p>
              <p className="plan-description">{promotion.description}</p>
              <ul>{promotion.includes.map((item) => <li key={item}><Check size={15} />{item}</li>)}</ul>
              <Link className="text-link" href="/publicar#proposal-type">Ver proposta <ArrowUpRight size={15} /></Link>
            </article>
          ))}
        </div>
        <p className="plans-disclosure"><ShieldCheck size={16} /> O pagamento cobre a avaliação da proposta comercial. Se for recusada, o valor é reembolsado. Não se vendem biografias nem decisões editoriais.</p>
      </section>
    </div>
  );
}
