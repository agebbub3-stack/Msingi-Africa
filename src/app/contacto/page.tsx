import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { JsonLd } from "@/components/json-ld";
import { getLocale } from "@/lib/locale.server";
import { createPageMetadata } from "@/lib/page-metadata";
import { KIOO_ANGOLA_FACEBOOK_URL, KIOO_FACEBOOK_URL } from "@/lib/social-links";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return createPageMetadata({
    locale,
    kind: "contact",
    path: "/contacto",
    eyebrow: locale === "en" ? "TALK TO THE NEWSROOM" : "FALE COM A REDAÇÃO",
    title: locale === "en" ? "Contact Kioo Africa" : "Contactar a redação",
    description: locale === "en"
      ? "Send a message to the Kioo Africa research and editorial team."
      : "Envie uma mensagem à equipa de pesquisa e redação da Kioo Africa.",
  });
}

export default async function ContactPage() {
  const locale = await getLocale();
  const en = locale === "en";
  const siteUrl = getSiteUrl();
  return (
    <section className="dashboard-page section-pad contact-page">
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "@id": new URL("/contacto#webpage", siteUrl).toString(),
        url: new URL("/contacto", siteUrl).toString(),
        name: en ? "Contact Kioo Africa" : "Contactar a redação da Kioo Africa",
        about: { "@id": `${siteUrl.origin}#organization` },
        publisher: { "@id": `${siteUrl.origin}#organization` },
      }} />
      <header className="dashboard-header">
        <span className="section-kicker">{en ? "AN OPEN CONVERSATION" : "UMA CONVERSA ABERTA"}</span>
        <h1>{en ? <>Talk to the<br /><em>newsroom.</em></> : <>Fale com a<br /><em>redação.</em></>}</h1>
        <p>{en
          ? "Editorial questions, corrections, partnerships or simply a good idea: we are here to listen."
          : "Questões editoriais, correções, parcerias ou simplesmente uma boa ideia: estamos disponíveis para ouvir."}</p>
      </header>
      <div className="contact-layout">
        <aside className="contact-context" aria-label={en ? "Information on contacting the newsroom" : "Informações para contactar a redação"}>
          <span className="section-kicker">{en ? "BEFORE YOU WRITE" : "ANTES DE ESCREVER"}</span>
          <h2>{en ? "A message with context helps us respond better." : "Uma mensagem com contexto ajuda-nos a responder melhor."}</h2>
          <div className="contact-context-item">
            <span>01</span>
            <div><h3>{en ? "Editorial corrections" : "Correções editoriais"}</h3><p>{en ? "Include the article URL and the passage that needs review." : "Indique o endereço do artigo e o trecho que merece revisão."}</p></div>
          </div>
          <div className="contact-context-item">
            <span>02</span>
            <div><h3>{en ? "Pitches and sources" : "Propostas e fontes"}</h3><p>{en ? "Share the idea, its relevance and the sources available." : "Partilhe a ideia, a relevância para o tema e as fontes disponíveis."}</p></div>
          </div>
          <div className="contact-context-item">
            <span>03</span>
            <div><h3>{en ? "Partnerships" : "Parcerias"}</h3><p>{en ? "Describe the organisation and your goals so we can direct your enquiry." : "Descreva a organização e o objetivo para encaminharmos a conversa."}</p></div>
          </div>
          <div className="contact-context-item">
            <span>04</span>
            <div>
              <h3>{en ? "Follow Kioo Africa on Facebook" : "Siga a Kioo Africa no Facebook"}</h3>
              <p><a href={KIOO_FACEBOOK_URL} target="_blank" rel="noopener noreferrer">{en ? "Kioo Africa · Official page" : "Kioo Africa · Página oficial"} <span aria-hidden="true">↗</span></a></p>
              <p><a href={KIOO_ANGOLA_FACEBOOK_URL} target="_blank" rel="noopener noreferrer">{en ? "Kioo Africa Angola · Official page" : "Kioo Africa Angola · Página oficial"} <span aria-hidden="true">↗</span></a></p>
            </div>
          </div>
        </aside>
        <ContactForm locale={locale} />
      </div>
    </section>
  );
}
