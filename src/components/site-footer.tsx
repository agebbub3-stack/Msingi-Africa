import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Brand } from "@/components/brand";
import { translate, type Locale } from "@/lib/i18n";
import { Newsletter } from "@/components/newsletter";
import { KIOO_FACEBOOK_URL } from "@/lib/social-links";

export function SiteFooter({ locale }: { locale: Locale }) {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-intro">
          <Brand light />
          <p>{translate(locale, "footerDescription")}</p>
          <span className="footer-independent"><span /> {translate(locale, "independent")}</span>
        </div>
        <div className="footer-links">
          <div>
            <span className="footer-label">{translate(locale, "explore")}</span>
            <Link href="/artigos">{translate(locale, "articles")}</Link>
            <Link href="/biografias">{translate(locale, "biographies")}</Link>
            <Link href="/entidades">{translate(locale, "entities")}</Link>
            <Link href="/autores">{translate(locale, "authors")}</Link>
            <Link href="/planos">{translate(locale, "plans")}</Link>
            <Link href="/pesquisa">{translate(locale, "search")}</Link>
            <Link href="/sobre">{translate(locale, "about")}</Link>
          </div>
          <div>
            <span className="footer-label">{translate(locale, "participate")}</span>
            <Link href="/publicar">{translate(locale, "submitProposal")}</Link>
            <Link href="/painel">{translate(locale, "creatorArea")} <ArrowUpRight size={13} /></Link>
            <Link href="/contacto">{translate(locale, "contactEditorial")} <ArrowUpRight size={13} /></Link>
            <Link href="/newsletter/cancelar">{translate(locale, "cancelNewsletter")}</Link>
            <Link href="/sobre#principios">{translate(locale, "editorialPrinciples")}</Link>
            <a href={KIOO_FACEBOOK_URL} target="_blank" rel="noopener noreferrer">Facebook · Kioo Africa Angola <ArrowUpRight size={13} /></a>
          </div>
        </div>
        <div className="footer-newsletter">
          <span className="footer-label">{translate(locale, "newsletterLabel")}</span>
          <h3>{translate(locale, "newsletterTitle")}</h3>
          <Newsletter locale={locale} />
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Kioo Africa. {translate(locale, "rights")}</span>
        <span>{translate(locale, "footerSignoff")}</span>
      </div>
    </footer>
  );
}
