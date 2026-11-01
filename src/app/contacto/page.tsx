import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contactar a redação",
  description: "Envie uma mensagem à equipa de pesquisa e redação da Msingi Africa.",
  alternates: { canonical: "/contacto" },
};

export default function ContactPage() {
  return (
    <section className="dashboard-page section-pad">
      <header className="dashboard-header">
        <span className="section-kicker">UMA CONVERSA ABERTA</span>
        <h1>Fale com a<br /><em>redação.</em></h1>
        <p>Questões editoriais, correções, parcerias ou simplesmente uma boa ideia: estamos disponíveis para ouvir.</p>
      </header>
      <ContactForm />
    </section>
  );
}
