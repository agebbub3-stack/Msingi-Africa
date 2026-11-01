"use client";

import { ArrowLeft, ArrowUpRight, Check, ChevronDown, Info, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { type FormEvent, useState } from "react";
import { promotionPackages } from "@/lib/paid-promotions";

type ProposalType = "opinion" | "profile" | "sponsored";
type ProposalDetails = { name: string; email: string; title: string; idea: string };

const editorialEmail = process.env.NEXT_PUBLIC_EDITORIAL_EMAIL || "editorial@msingi.africa";

export default function PublishPage() {
  const [proposalType, setProposalType] = useState<ProposalType>("opinion");
  const [selectedPackage, setSelectedPackage] = useState<string>("sponsored-story");
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitProposal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const title = String(formData.get("title") ?? "").trim();
    const idea = String(formData.get("idea") ?? "").trim();
    const details: ProposalDetails = { name, email, title, idea };

    if (proposalType === "sponsored") {
      setIsSubmitting(true);
      setNotice("");
      try {
        const response = await fetch("/api/payments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...details, packageId: selectedPackage }),
        });
        const result: unknown = await response.json();
        if (
          !response.ok ||
          !result ||
          typeof result !== "object" ||
          !("checkoutUrl" in result) ||
          typeof result.checkoutUrl !== "string" ||
          !("txRef" in result) ||
          typeof result.txRef !== "string"
        ) {
          const errorMessage = result && typeof result === "object" && "error" in result && typeof result.error === "string"
            ? result.error
            : "Não foi possível iniciar o pagamento.";
          setNotice(errorMessage);
          return;
        }

        window.location.assign(result.checkoutUrl);
      } catch (error) {
        setNotice("Não foi possível iniciar o pagamento. Verifique a ligação e tente novamente.");
        console.error("Could not start the sponsored-content checkout.", error);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    const kindLabel = proposalType === "profile"
      ? "Sugestão de perfil (seleção editorial gratuita)"
      : "Artigo de opinião (avaliação editorial gratuita)";
    const subject = encodeURIComponent(`Proposta Msingi: ${title}`);
    const body = encodeURIComponent(
      `${kindLabel}\n\nNome: ${name}\nE-mail: ${email}\nTítulo ou pessoa: ${title}\n\nProposta / ligação de referência:\n${idea}\n\nNota: esta mensagem é uma proposta, não uma confirmação de publicação ou pagamento.`,
    );
    setNotice("A sua aplicação de e-mail será aberta com a proposta preenchida. A redação responde após avaliação.");
    window.location.assign(`mailto:${editorialEmail}?subject=${subject}&body=${body}`);
  }

  return (
    <>
      <section className="submit-masthead">
        <Link href="/" className="back-home"><ArrowLeft size={14} /> Voltar à página inicial</Link>
        <span className="section-kicker">UMA IDEIA BOA MERECE UMA BOA CONVERSA</span>
        <h1>A próxima história<br />pode <em>começar aqui.</em></h1>
        <p>Quer propor um artigo, sugerir alguém para um perfil ou conversar sobre uma parceria? Conte-nos mais.</p>
      </section>
      <section className="submit-layout section-pad">
        <form className="proposal-form" onSubmit={submitProposal}>
          <div className="form-section-head"><span>01</span><div><h2>O ponto de partida</h2><p>Que tipo de proposta tem em mente?</p></div></div>
          <label className="field-label" htmlFor="proposal-type">Tipo de proposta</label>
          <div className="select-wrap"><select id="proposal-type" name="type" value={proposalType} onChange={(event) => { setProposalType(event.target.value as ProposalType); setNotice(""); }}><option value="opinion">Artigo de opinião · avaliação editorial gratuita</option><option value="profile">Sugerir uma pessoa · seleção editorial gratuita</option><option value="sponsored">Divulgação patrocinada · orçamento pago</option></select><ChevronDown size={16} aria-hidden="true" /></div>
          <div className={`editorial-disclosure${proposalType === "sponsored" ? " disclosure-sponsored" : ""}`}><Info size={17} /><p>{proposalType === "sponsored" ? <><strong>Parceria comercial:</strong> conteúdo publicitário pago, sujeito a análise de adequação e identificado como “Patrocinado”. Não inclui perfil biográfico editorial nem garante aprovação ou resultados. O pagamento confirmado refere-se à proposta enviada; se a redação a recusar, o valor será reembolsado.</> : proposalType === "profile" ? <><strong>Sugestão editorial:</strong> a seleção de pessoas para biografias é independente, baseada em mérito editorial e nunca depende de pagamento.</> : <><strong>Contribuição editorial:</strong> a avaliação de artigos de opinião é gratuita. Pagar não dá prioridade editorial e não garante publicação.</>}</p></div>
          {proposalType === "sponsored" && <div className="package-picker" aria-label="Escolha um pacote de divulgação patrocinada">{promotionPackages.map((promotion) => <button key={promotion.id} type="button" className={`package-option${promotion.id === selectedPackage ? " package-option-active" : ""}${"featured" in promotion && promotion.featured ? " package-option-featured" : ""}`} aria-pressed={promotion.id === selectedPackage} onClick={() => setSelectedPackage(promotion.id)}><span className="package-price">US${promotion.price}</span><strong>{promotion.name}</strong><span className="package-description">{promotion.description}</span><span className="package-includes">{promotion.includes.join(" · ")}</span></button>)}</div>}
          <div className="form-section-head form-section-second"><span>02</span><div><h2>Conte-nos a ideia</h2><p>Uma boa proposta é específica e tem contexto.</p></div></div>
          <label className="field-label" htmlFor="proposal-title">{proposalType === "profile" ? "Pessoa ou perfil sugerido" : "Título provisório"} <span>*</span></label>
          <input className="form-input" id="proposal-title" name="title" placeholder={proposalType === "profile" ? "Quem devemos conhecer?" : "Sobre o que gostaria de escrever?"} required maxLength={140} />
          <label className="field-label" htmlFor="proposal-idea">Resumo ou ligação de referência <span>*</span></label>
          <textarea className="form-input form-textarea" id="proposal-idea" name="idea" placeholder="O que torna esta história relevante agora? Inclua fontes, dados ou ligações úteis." required rows={5} maxLength={4000} />
          <div className="form-section-head form-section-second"><span>03</span><div><h2>Quem é você?</h2><p>Usaremos estes dados apenas para responder à sua proposta.</p></div></div>
          <div className="form-inline-fields"><div><label className="field-label" htmlFor="proposal-name">Nome <span>*</span></label><input className="form-input" id="proposal-name" name="name" autoComplete="name" placeholder="O seu nome" required maxLength={100} /></div><div><label className="field-label" htmlFor="proposal-email">E-mail <span>*</span></label><input className="form-input" id="proposal-email" name="email" type="email" autoComplete="email" placeholder="voce@exemplo.com" required maxLength={254} /></div></div>
          <button type="submit" className="button button-dark submit-button" disabled={isSubmitting}>{isSubmitting ? "A preparar checkout…" : proposalType === "sponsored" ? "Continuar para pagamento" : "Enviar proposta"} <ArrowUpRight size={16} /></button>
          <p className="form-notice" role="status" aria-live="polite">{notice}</p>
          <p className="form-privacy"><ShieldCheck size={14} /> {proposalType === "sponsored" ? "Pagamento em USD pela Flutterwave. A proposta é guardada automaticamente e analisada pela redação após a confirmação." : "Ao enviar, abre-se o seu e-mail. A proposta ainda não foi enviada nem publicada."}</p>
        </form>
        <aside className="submit-aside">
          <div className="submit-aside-card"><span className="section-kicker">ANTES DE ENVIAR</span><h2>Boa apuração.<br />Sem atalhos.</h2><ul><li><Check size={15} /> Inclua factos e fontes verificáveis</li><li><Check size={15} /> Traga uma perspetiva própria</li><li><Check size={15} /> Explique por que importa agora</li></ul><Link href="/sobre#principios">Os nossos princípios editoriais <ArrowUpRight size={14} /></Link></div>
          <div className="submit-help"><Mail size={17} /><p>Prefere falar connosco?<a href={`mailto:${editorialEmail}`}> {editorialEmail}</a></p></div>
        </aside>
      </section>
    </>
  );
}
