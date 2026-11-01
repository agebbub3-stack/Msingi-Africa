import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { getPublicAuthors } from "@/lib/public-content";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Autores e colaboradores",
  description: "Conheça os autores e colaboradores que partilham perspetivas sobre os mercados africanos.",
  alternates: { canonical: "/autores" },
};

export default async function AuthorsPage() {
  const authors = await getPublicAuthors();
  return (
    <section className="archive-content section-pad authors-page">
      <header className="archive-masthead entities-masthead"><span className="section-kicker">VOZES COM EXPERIÊNCIA LOCAL</span><div className="archive-masthead-row"><div><h1>Quem conta<br /><em>também importa.</em></h1><p>Autores e criadores que contribuem com conhecimento, contexto e ideias para a conversa.</p></div></div></header>
      {authors.length === 0 ? <p className="workspace-empty">Os perfis de autor serão apresentados à medida que a comunidade crescer.</p> : (
        <div className="author-grid">{authors.map((author) => (
          <article className="author-card" key={author.slug}>
            <span className="byline-avatar" aria-hidden="true">{author.name.slice(0, 1).toUpperCase()}</span>
            <h2><Link href={`/autores/${author.slug}`}>{author.name}</Link></h2>
            {author.countryCode && <span className="profile-location"><MapPin size={13} /> {author.countryCode}</span>}
            <p>{author.biography || "Autor e colaborador da Msingi Africa."}</p>
            <span className="author-count">{author.articleCount} {author.articleCount === 1 ? "artigo publicado" : "artigos publicados"}</span>
            <Link className="text-link" href={`/autores/${author.slug}`}>Ver perfil <ArrowUpRight size={14} /></Link>
          </article>
        ))}</div>
      )}
    </section>
  );
}
