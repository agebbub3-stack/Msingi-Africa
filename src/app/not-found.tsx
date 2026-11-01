import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="not-found-page">
      <span className="section-kicker">MS / 404 · FORA DE CONTEXTO</span>
      <h1>Esta história<br /><em>ainda não existe.</em></h1>
      <p>O endereço mudou ou esta página já não está disponível. Há sempre outra perspetiva à espera.</p>
      <div>
        <Link href="/" className="button button-dark"><ArrowLeft size={15} /> Voltar à Msingi</Link>
        <Link href="/artigos" className="text-link">Explorar artigos <ArrowUpRight size={15} /></Link>
      </div>
    </section>
  );
}
