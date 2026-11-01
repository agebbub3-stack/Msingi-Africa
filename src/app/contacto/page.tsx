import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contactar a redação",
  description: "Envie uma mensagem à equipa de pesquisa e redação da Msingi Africa.",
  alternates: { canonical: "/contacto" },
};

export default function ContactPage() {
  return (
    <section className="dashboard-page section-pad contact-page">
      <header className="dashboard-header">
        <span className="section-kicker">UMA CONVERSA ABERTA</span>
        <h1>Fale com a<br /><em>redação.</em></h1>
        <p>Questões editoriais, correções, parcerias ou simplesmente uma boa ideia: estamos disponíveis para ouvir.</p>
      </header>
      <div className="contact-layout">
        <aside className="contact-context" aria-label="Informações para contactar a redação">
          <span className="section-kicker">ANTES DE ESCREVER</span>
          <h2>Uma mensagem com contexto ajuda-nos a responder melhor.</h2>
          <div className="contact-context-item">
            <span>01</span>
            <div><h3>Correções editoriais</h3><p>Indique o endereço do artigo e o trecho que merece revisão.</p></div>
          </div>
          <div className="contact-context-item">
            <span>02</span>
            <div><h3>Propostas e fontes</h3><p>Partilhe a ideia, a relevância para o tema e as fontes disponíveis.</p></div>
          </div>
          <div className="contact-context-item">
            <span>03</span>
            <div><h3>Parcerias</h3><p>Descreva a organização e o objetivo para encaminharmos a conversa.</p></div>
          </div>
        </aside>
        <ContactForm />
      </div>
    </section>
  );
}
