import type { Metadata } from "next";
import { NewsletterUnsubscribe } from "@/components/newsletter-unsubscribe";

export const metadata: Metadata = {
  title: "Cancelar newsletter",
  description: "Peça uma ligação segura para cancelar a sua inscrição na newsletter Msingi Africa.",
  robots: { index: false, follow: false },
};

export default function UnsubscribePage() {
  return (
    <section className="account-page">
      <div className="account-card">
        <span className="section-kicker">PREFERÊNCIAS DA NEWSLETTER</span>
        <h1>A sua caixa,<br /><em>as suas escolhas.</em></h1>
        <p>Indique o endereço inscrito. Enviaremos uma ligação segura para cancelar a newsletter.</p>
        <NewsletterUnsubscribe />
      </div>
    </section>
  );
}
