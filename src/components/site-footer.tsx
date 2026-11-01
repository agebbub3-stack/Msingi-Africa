import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Brand } from "@/components/brand";
import { Newsletter } from "@/components/newsletter";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-intro">
          <Brand light />
          <p>Ideias claras para entender o que está a mudar nos mercados africanos.</p>
          <span className="footer-independent"><span /> Jornalismo independente · Pesquisa original</span>
        </div>
        <div className="footer-links">
          <div>
            <span className="footer-label">Explore</span>
            <Link href="/artigos">Artigos</Link>
            <Link href="/biografias">Biografias</Link>
            <Link href="/entidades">Entidades</Link>
            <Link href="/autores">Autores</Link>
            <Link href="/planos">Planos</Link>
            <Link href="/pesquisa">Pesquisar</Link>
            <Link href="/sobre">A nossa missão</Link>
          </div>
          <div>
            <span className="footer-label">Participe</span>
            <Link href="/publicar">Enviar uma proposta</Link>
            <Link href="/painel">Área de autor <ArrowUpRight size={13} /></Link>
            <Link href="/contacto">Fale com a redação <ArrowUpRight size={13} /></Link>
            <Link href="/newsletter/cancelar">Cancelar newsletter</Link>
            <Link href="/sobre#principios">Princípios editoriais</Link>
          </div>
        </div>
        <div className="footer-newsletter">
          <span className="footer-label">A carta Kioo</span>
          <h3>O continente não cabe num só título.</h3>
          <Newsletter />
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Kioo Africa. Todos os direitos reservados.</span>
        <span>Feito para quem olha mais longe.</span>
      </div>
    </footer>
  );
}
