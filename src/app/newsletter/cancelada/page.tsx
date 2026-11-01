import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CheckCircle2, CircleAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "Preferências da newsletter",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ status?: string }> };

export default async function UnsubscribeResultPage({ searchParams }: Props) {
  const { status } = await searchParams;
  const success = status === "success";
  return (
    <section className="newsletter-result-page" aria-labelledby="newsletter-result-title">
      <div className={`newsletter-result-card${success ? " newsletter-result-success" : " newsletter-result-invalid"}`}>
        <div className="newsletter-result-topline">
          <span>BA / NEWSLETTER</span>
          <span>{success ? "PREFERÊNCIAS ATUALIZADAS" : "LIGAÇÃO NÃO RECONHECIDA"}</span>
        </div>
        <div className="newsletter-result-icon" aria-hidden="true">
          {success ? <CheckCircle2 size={25} strokeWidth={1.5} /> : <CircleAlert size={25} strokeWidth={1.5} />}
        </div>
        <span className="newsletter-result-kicker">A sua caixa de entrada, as suas escolhas</span>
        <h1 id="newsletter-result-title">
          {success
            ? <>A sua escolha,<br /><em>respeitada.</em></>
            : <>Esta ligação<br /><em>já não é válida.</em></>}
        </h1>
        <p className="newsletter-result-description">
          {success
            ? "A inscrição foi cancelada. Não enviaremos mais a newsletter Bantaba Africa para este endereço."
            : "A ligação expirou ou não corresponde a um pedido válido. Pode pedir uma nova ligação segura para gerir a inscrição."}
        </p>
        <div className="newsletter-result-actions">
          {success ? (
            <Link className="newsletter-result-link" href="/">
              <ArrowLeft size={15} /> Voltar à Bantaba Africa
            </Link>
          ) : (
            <Link className="button button-light" href="/newsletter/cancelar">
              Pedir nova ligação <ArrowUpRight size={15} />
            </Link>
          )}
        </div>
        <div className="newsletter-result-footer">
          <span>BANTABA AFRICA</span>
          <span>PESSOAS, IDEIAS E MERCADOS AFRICANOS</span>
        </div>
      </div>
    </section>
  );
}
