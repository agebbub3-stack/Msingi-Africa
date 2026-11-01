import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, MapPin } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import { JsonLd } from "@/components/json-ld";
import { getPublicAuthor } from "@/lib/public-content";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const author = await getPublicAuthor(slug);
  if (!author) return { title: "Autor não encontrado", robots: { index: false, follow: false } };
  return {
    title: author.name,
    description: author.biography || `Artigos e perspetivas de ${author.name} na Bantaba Africa.`,
    alternates: { canonical: `/autores/${slug}` },
    openGraph: { type: "profile", title: author.name, description: author.biography },
  };
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params;
  const author = await getPublicAuthor(slug);
  if (!author) notFound();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://msingi.africa";
  const url = new URL(`/autores/${slug}`, siteUrl).toString();
  return (
    <article className="author-detail section-pad">
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        url,
        mainEntity: {
          "@type": "Person",
          name: author.name,
          description: author.biography,
          ...(author.imageUrl ? { image: author.imageUrl } : {}),
          ...(author.countryCode ? { homeLocation: { "@type": "Place", addressCountry: author.countryCode } } : {}),
        },
        publisher: { "@type": "Organization", name: "Bantaba Africa", url: siteUrl },
      }} />
      <nav className="story-breadcrumb"><Link href="/autores"><ArrowLeft size={14} /> Todos os autores</Link><span> / </span><span>Perfil</span></nav>
      <header className="author-detail-header">
        <span className="byline-avatar" aria-hidden="true">{author.name.slice(0, 1).toUpperCase()}</span>
        <span className="section-kicker">AUTOR / MSINGI AFRICA</span>
        <h1>{author.name}</h1>
        {author.countryCode && <p className="profile-location"><MapPin size={14} /> {author.countryCode}</p>}
        <p>{author.biography || "Autor e colaborador da Bantaba Africa."}</p>
        {author.articleCount > 0 && <span className="author-count">{author.articleCount} {author.articleCount === 1 ? "artigo publicado" : "artigos publicados"}</span>}
      </header>
      <section className="entity-related">
        <div className="section-heading"><div><span className="section-kicker">PUBLICADO NA MSINGI</span><h2>Ideias com<br /><em>contexto.</em></h2></div><Link className="text-link" href="/artigos">Explorar artigos <ArrowUpRight size={14} /></Link></div>
        {author.articles.length > 0 ? <div className="article-grid">{author.articles.map((article) => <ArticleCard key={article.slug} article={article} />)}</div> : <p className="workspace-empty">Este autor ainda não tem artigos publicados.</p>}
      </section>
    </article>
  );
}
