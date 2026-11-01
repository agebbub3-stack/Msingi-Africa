"use client";

import { ArrowLeft, ArrowUpRight, Check, ChevronDown, Info, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { type FormEvent, useState } from "react";
import { promotionPackages } from "@/lib/paid-promotions";
import type { Locale } from "@/lib/i18n";

type ProposalType = "opinion" | "profile" | "sponsored";
type ProposalDetails = { name: string; email: string; title: string; idea: string };

export function PublishForm({ locale }: { locale: Locale }) {
  const en = locale === "en";
  const [proposalType, setProposalType] = useState<ProposalType>("opinion");
  const [selectedPackage, setSelectedPackage] = useState<string>("sponsored-story");
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const selectedPromotion = promotionPackages.find((promotion) => promotion.id === selectedPackage) ?? promotionPackages[1];
  const packageCopy = en
    ? {
        "sponsored-note": {
          name: "Brand note",
          description: "A sponsored introduction to your brand.",
          includes: ["Short sponsored format", "One client-provided image", "Clearly labelled as sponsored"],
        },
        "sponsored-story": {
          name: "Sponsored story",
          description: "A branded article presented transparently.",
          includes: ["Sponsored article up to 800 words", "Dedicated page on the site", "Partnership clearly disclosed"],
        },
        "sponsored-feature": {
          name: "Campaign feature",
          description: "A sponsored campaign with wider distribution.",
          includes: ["Sponsored article up to 800 words", "Newsletter feature", "Campaign placement for seven days"],
        },
      }
    : null;

  async function submitProposal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
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
          const errorMessage = en
            ? "We could not start the payment. Check your proposal and try again."
            : result && typeof result === "object" && "error" in result && typeof result.error === "string"
            ? result.error
            : "Não foi possível iniciar o pagamento.";
          setNotice(errorMessage);
          return;
        }

        window.location.assign(result.checkoutUrl);
      } catch (error) {
        setNotice(en ? "We could not start the payment. Check your connection and try again." : "Não foi possível iniciar o pagamento. Verifique a ligação e tente novamente.");
        console.error("Could not start the sponsored-content checkout.", error);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    const kindLabel = proposalType === "profile"
      ? "Sugestão de perfil (seleção editorial gratuita)"
      : "Artigo de opinião (avaliação editorial gratuita)";
    setIsSubmitting(true);
    setNotice("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject: `${kindLabel}: ${title}`.slice(0, 140),
          message: `Nome: ${name}\nE-mail: ${email}\nTipo: ${kindLabel}\nTítulo ou pessoa: ${title}\n\nProposta / referências:\n${idea}`,
          website: String(formData.get("website") ?? ""),
        }),
      });
      const result = await response.json() as { error?: string; message?: string };
      setNotice(en
        ? (response.ok ? "Your proposal has been sent to the editorial team." : "We could not submit your proposal. Please try again.")
        : result.message ?? result.error ?? "Não foi possível enviar a proposta.");
      if (response.ok) form.reset();
    } catch (error) {
      console.error("Could not send editorial proposal.", error);
      setNotice(en ? "We could not submit your proposal. Check your connection and try again." : "Não foi possível enviar a proposta. Verifique a ligação e tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <section className="submit-masthead publish-masthead">
        <div className="publish-masthead-copy">
          <Link href="/" className="back-home"><ArrowLeft size={14} /> {en ? "Back to homepage" : "Voltar à página inicial"}</Link>
          <span className="section-kicker">{en ? "A GOOD IDEA DESERVES A GOOD CONVERSATION" : "UMA IDEIA BOA MERECE UMA BOA CONVERSA"}</span>
          <h1>{en ? <>The next story<br />could <em>start here.</em></> : <>A próxima história<br />pode <em>começar aqui.</em></>}</h1>
          <p>{en ? "Pitch an article, suggest someone for a profile, or discuss a partnership. Tell us more." : "Quer propor um artigo, sugerir alguém para um perfil ou conversar sobre uma parceria? Conte-nos mais."}</p>
          <div className="publish-hero-actions">
            <Link href="#proposal-form" className="button button-light">{en ? "Start a proposal" : "Começar proposta"} <ArrowUpRight size={16} /></Link>
            <span>{en ? "Free editorial review · paid promotion is optional" : "Avaliação editorial gratuita · divulgação paga é opcional"}</span>
          </div>
        </div>
        <aside className="publish-route-card" aria-label={en ? "How proposals are reviewed" : "Como as propostas são avaliadas"}>
          <span className="publish-route-kicker">{en ? "A CLEAR EDITORIAL ROUTE" : "UM PERCURSO EDITORIAL CLARO"}</span>
          <ol>
            <li><span>01</span><div><strong>{en ? "Send your idea" : "Envie a sua ideia"}</strong><small>{en ? "A short pitch is enough to begin." : "Uma proposta breve é suficiente para começar."}</small></div></li>
            <li><span>02</span><div><strong>{en ? "Editorial review" : "Avaliação editorial"}</strong><small>{en ? "Every story is assessed independently." : "Cada proposta é avaliada de forma independente."}</small></div></li>
            <li><span>03</span><div><strong>{en ? "Hear from our team" : "Receba uma resposta"}</strong><small>{en ? "We will contact you about next steps." : "A equipa contacta-o sobre os próximos passos."}</small></div></li>
          </ol>
          <p>{en ? "Payment never guarantees editorial approval or coverage." : "O pagamento nunca garante aprovação nem cobertura editorial."}</p>
        </aside>
      </section>
      <section className="submit-layout section-pad publish-layout">
        <form id="proposal-form" className="proposal-form" onSubmit={submitProposal}>
          <div className="publish-form-intro">
            <span className="section-kicker">{en ? "YOUR STORY STARTS HERE" : "A SUA HISTÓRIA COMEÇA AQUI"}</span>
            <h2>{en ? "Tell us what you have in mind." : "Conte-nos o que tem em mente."}</h2>
            <p>{en ? "Choose an editorial proposal or a clearly labelled sponsored placement. They follow separate review paths." : "Escolha uma proposta editorial ou uma divulgação patrocinada claramente identificada. São percursos de avaliação distintos."}</p>
          </div>
          <div className="form-section-head"><span>01</span><div><h2>{en ? "Choose your path" : "O ponto de partida"}</h2><p>{en ? "What would you like to propose?" : "Que tipo de proposta tem em mente?"}</p></div></div>
          <label className="field-label" htmlFor="proposal-type">{en ? "Proposal type" : "Tipo de proposta"}</label>
          <div className="select-wrap"><select id="proposal-type" name="type" value={proposalType} onChange={(event) => { setProposalType(event.target.value as ProposalType); setNotice(""); }}><option value="opinion">{en ? "Opinion article · free editorial review" : "Artigo de opinião · avaliação editorial gratuita"}</option><option value="profile">{en ? "Suggest a person · independent editorial selection" : "Sugerir uma pessoa · seleção editorial gratuita"}</option><option value="sponsored">{en ? "Sponsored promotion · paid package" : "Divulgação patrocinada · orçamento pago"}</option></select><ChevronDown size={16} aria-hidden="true" /></div>
          <div className={`editorial-disclosure${proposalType === "sponsored" ? " disclosure-sponsored" : ""}`}><Info size={17} /><p>{proposalType === "sponsored" ? (en
            ? <><strong>Commercial partnership:</strong> paid promotional content is subject to suitability review and clearly labelled as sponsored. It does not include an independent editorial biography and does not guarantee approval or results. Payment applies to the submitted proposal; rejected proposals are refunded.</>
            : <><strong>Parceria comercial:</strong> conteúdo publicitário pago, sujeito a análise de adequação e identificado como “Patrocinado”. Não inclui perfil biográfico editorial nem garante aprovação ou resultados. O pagamento confirmado refere-se à proposta enviada; se a redação a recusar, o valor será reembolsado.</>)
            : proposalType === "profile" ? (en
              ? <><strong>Editorial suggestion:</strong> biography selection is independent, based on editorial merit, and never depends on payment.</>
              : <><strong>Sugestão editorial:</strong> a seleção de pessoas para biografias é independente, baseada em mérito editorial e nunca depende de pagamento.</>)
              : (en
                ? <><strong>Editorial contribution:</strong> opinion articles are reviewed for free. Payment does not buy editorial priority or guarantee publication.</>
                : <><strong>Contribuição editorial:</strong> a avaliação de artigos de opinião é gratuita. Pagar não dá prioridade editorial e não garante publicação.</>)}</p></div>
          {proposalType === "sponsored" && <div className="package-picker" aria-label={en ? "Choose a sponsored promotion package" : "Escolha um pacote de divulgação patrocinada"}>{promotionPackages.map((promotion) => {
            const copy = packageCopy?.[promotion.id];
            return <button key={promotion.id} type="button" className={`package-option${promotion.id === selectedPackage ? " package-option-active" : ""}${"featured" in promotion && promotion.featured ? " package-option-featured" : ""}`} aria-pressed={promotion.id === selectedPackage} onClick={() => setSelectedPackage(promotion.id)}>{("featured" in promotion && promotion.featured) && <span className="package-featured-label">{en ? "MOST POPULAR" : "MAIS ESCOLHIDO"}</span>}<span className="package-price">US${promotion.price}</span><strong>{copy?.name ?? promotion.name}</strong><span className="package-description">{copy?.description ?? promotion.description}</span><span className="package-includes">{(copy?.includes ?? promotion.includes).join(" · ")}</span></button>;
          })}</div>}
          {proposalType === "sponsored" && <div className="selected-package-summary" aria-live="polite"><span>{en ? "Selected package" : "Pacote selecionado"}</span><strong>US${selectedPromotion.price} · {packageCopy?.[selectedPromotion.id].name ?? selectedPromotion.name}</strong><p>{en ? "You will review this amount before completing secure checkout with Flutterwave." : "O valor será apresentado novamente antes de concluir o pagamento seguro pela Flutterwave."}</p></div>}
          <div className="form-section-head form-section-second"><span>02</span><div><h2>{en ? "Tell us about the idea" : "Conte-nos a ideia"}</h2><p>{en ? "A strong pitch is specific and grounded in context." : "Uma boa proposta é específica e tem contexto."}</p></div></div>
          <label className="field-label" htmlFor="proposal-title">{proposalType === "profile" ? (en ? "Suggested person or profile" : "Pessoa ou perfil sugerido") : (en ? "Working title" : "Título provisório")} <span>*</span></label>
          <input className="form-input" id="proposal-title" name="title" placeholder={proposalType === "profile" ? (en ? "Who should we know about?" : "Quem devemos conhecer?") : (en ? "What would you like to write about?" : "Sobre o que gostaria de escrever?")} required maxLength={140} />
          <label className="field-label" htmlFor="proposal-idea">{en ? "Summary or reference links" : "Resumo ou ligação de referência"} <span>*</span></label>
          <textarea className="form-input form-textarea" id="proposal-idea" name="idea" placeholder={en ? "Why does this story matter now? Include useful sources, data or links." : "O que torna esta história relevante agora? Inclua fontes, dados ou ligações úteis."} required rows={5} maxLength={3300} />
          <div className="form-section-head form-section-second"><span>03</span><div><h2>{en ? "About you" : "Quem é você?"}</h2><p>{en ? "We will use these details only to respond to your proposal." : "Usaremos estes dados apenas para responder à sua proposta."}</p></div></div>
          <div className="form-inline-fields"><div><label className="field-label" htmlFor="proposal-name">{en ? "Name" : "Nome"} <span>*</span></label><input className="form-input" id="proposal-name" name="name" autoComplete="name" placeholder={en ? "Your name" : "O seu nome"} required maxLength={100} /></div><div><label className="field-label" htmlFor="proposal-email">{en ? "Email" : "E-mail"} <span>*</span></label><input className="form-input" id="proposal-email" name="email" type="email" autoComplete="email" placeholder={en ? "you@example.com" : "voce@exemplo.com"} required maxLength={254} /></div></div>
          <label className="contact-honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
          <button type="submit" className="button button-dark submit-button" disabled={isSubmitting}>{isSubmitting ? proposalType === "sponsored" ? (en ? "Preparing checkout…" : "A preparar checkout…") : (en ? "Sending proposal…" : "A enviar proposta…") : proposalType === "sponsored" ? (en ? `Continue to secure payment · US$${selectedPromotion.price}` : `Continuar para pagamento · US$${selectedPromotion.price}`) : (en ? "Submit proposal" : "Enviar proposta")} <ArrowUpRight size={16} /></button>
          <p className="form-notice" role="status" aria-live="polite">{notice}</p>
          <p className="form-privacy"><ShieldCheck size={14} /> {proposalType === "sponsored"
            ? (en ? "Payment is processed in USD by Flutterwave. Your proposal is saved and reviewed by the newsroom after payment confirmation." : "Pagamento em USD pela Flutterwave. A proposta é guardada automaticamente e analisada pela redação após a confirmação.")
            : (en ? "Proposals go directly to the newsroom for review. Submission does not guarantee publication." : "A proposta é enviada diretamente à redação para avaliação. O envio não confirma nem garante publicação.")}</p>
        </form>
        <aside className="submit-aside">
          <div className="submit-aside-card"><span className="section-kicker">{en ? "BEFORE YOU SUBMIT" : "ANTES DE ENVIAR"}</span><h2>{en ? <>Good reporting.<br />No shortcuts.</> : <>Boa apuração.<br />Sem atalhos.</>}</h2><ul><li><Check size={15} /> {en ? "Include verifiable facts and sources" : "Inclua factos e fontes verificáveis"}</li><li><Check size={15} /> {en ? "Bring an original perspective" : "Traga uma perspetiva própria"}</li><li><Check size={15} /> {en ? "Explain why it matters now" : "Explique por que importa agora"}</li></ul><Link href="/sobre#principios">{en ? "Our editorial principles" : "Os nossos princípios editoriais"} <ArrowUpRight size={14} /></Link></div>
          <div className="submit-help"><Mail size={17} /><p>{en ? "Prefer to talk? " : "Prefere falar connosco? "}<Link href="/contacto">{en ? "Contact the newsroom" : "Contacte a redação"}</Link></p></div>
        </aside>
      </section>
    </>
  );
}
