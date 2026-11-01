import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { getPublicAuthors } from "@/lib/public-content";
import { getLocale } from "@/lib/locale.server";
import { createPageMetadata } from "@/lib/page-metadata";

export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return createPageMetadata({
    locale,
    kind: "authors",
    path: "/autores",
    eyebrow: locale === "en" ? "LOCAL KNOWLEDGE · DISTINCT VOICES" : "CONHECIMENTO LOCAL · VOZES PRÓPRIAS",
    title: locale === "en" ? "African markets contributors" : "Autores e colaboradores",
    description: locale === "en"
      ? "Meet the authors and contributors sharing perspectives on African markets."
      : "Conheça os autores e colaboradores que partilham perspetivas sobre os mercados africanos.",
  });
}

export default async function AuthorsPage() {
  const [authors, locale] = await Promise.all([getPublicAuthors(), getLocale()]);
  const en = locale === "en";
  return (
    <section className="archive-content section-pad authors-page">
      <header className="archive-masthead entities-masthead">
        <span className="section-kicker">{en ? "VOICES WITH LOCAL EXPERIENCE" : "VOZES COM EXPERIÊNCIA LOCAL"}</span>
        <div className="archive-masthead-row"><div>
          <h1>{en ? <>Who tells<br /><em>the story matters.</em></> : <>Quem conta<br /><em>também importa.</em></>}</h1>
          <p>{en
            ? "Authors and creators bringing knowledge, context and ideas to the conversation."
            : "Autores e criadores que contribuem com conhecimento, contexto e ideias para a conversa."}</p>
        </div></div>
      </header>
      {authors.length === 0 ? <p className="workspace-empty">{en ? "Contributor profiles will appear as the community grows." : "Os perfis de autor serão apresentados à medida que a comunidade crescer."}</p> : (
        <div className="author-grid">{authors.map((author) => (
          <article className="author-card" key={author.slug}>
            <span className="byline-avatar" aria-hidden="true">{author.name.slice(0, 1).toUpperCase()}</span>
            <h2><Link href={`/autores/${author.slug}`}>{author.name}</Link></h2>
            {author.countryCode && <span className="profile-location"><MapPin size={13} /> {author.countryCode}</span>}
            <p>{author.biography || (en ? "Kioo Africa author and contributor." : "Autor e colaborador da Kioo Africa.")}</p>
            <span className="author-count">{author.articleCount} {author.articleCount === 1
              ? (en ? "published article" : "artigo publicado")
              : (en ? "published articles" : "artigos publicados")}</span>
            <Link className="text-link" href={`/autores/${author.slug}`}>{en ? "View profile" : "Ver perfil"} <ArrowUpRight size={14} /></Link>
          </article>
        ))}</div>
      )}
    </section>
  );
}
