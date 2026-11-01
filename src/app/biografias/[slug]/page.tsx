import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleInteractions } from "@/components/article-interactions";
import { ArticleMarkdown } from "@/components/article-markdown";
import { ArticleCard } from "@/components/article-card";
import { JsonLd } from "@/components/json-ld";
import { ProfileCard } from "@/components/profile-card";
import { getPublishedArticle, getPublishedBiographies } from "@/lib/public-content";
import { getStorySeo } from "@/lib/story-seo";
import { articles as editorialArticles, biographies as editorialBiographies } from "@/lib/content";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getPublishedArticle(slug, "biography");
  if (!profile) return { title: "Perfil não encontrado", robots: { index: false, follow: false } };
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://msingi.africa";
  const seo = getStorySeo(profile);
  const canonical = profile.canonicalUrl?.trim() || `/biografias/${profile.slug}`;
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: { canonical: new URL(canonical, siteUrl).toString() },
    openGraph: {
      type: "profile",
      title: seo.title,
      description: seo.description,
      url: new URL(canonical, siteUrl).toString(),
      images: [{ url: profile.image, alt: profile.imageAlt }],
    },
    twitter: { card: "summary_large_image", title: seo.title, description: seo.description, images: [profile.image] },
  };
}

export default async function BiographyPage({ params }: Props) {
  const { slug } = await params;
  const [profile, biographies] = await Promise.all([
    getPublishedArticle(slug, "biography"),
    getPublishedBiographies(),
  ]);
  if (!profile) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://msingi.africa";
  const pageUrl = new URL(`/biografias/${slug}`, siteUrl).toString();
  const relatedProfiles = biographies.filter((item) => item.slug !== slug).slice(0, 3);
  const editorialProfile = editorialBiographies.find((item) => item.slug === slug);
  const relatedArticleSlugs = new Set(editorialProfile?.relatedArticleSlugs ?? []);
  const relatedArticles = editorialArticles.filter((item) => relatedArticleSlugs.has(item.slug));
  const portrait = editorialProfile?.portrait;
  const seo = getStorySeo(profile);

  return (
    <article className="person-page">
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        name: profile.title,
        description: seo.description,
        keywords: seo.keywords,
        url: pageUrl,
        datePublished: profile.publishedAt ?? undefined,
        dateModified: profile.modifiedAt ?? undefined,
        mainEntity: {
          "@type": "Person",
          name: profile.title,
          description: seo.description,
          jobTitle: profile.personRole ?? undefined,
          knowsAbout: profile.personField ?? profile.category,
          url: pageUrl,
          ...(profile.image ? { image: profile.image } : {}),
          homeLocation: profile.personCountry ? { "@type": "Place", name: profile.personCountry } : undefined,
          ...(editorialProfile?.organization ? {
            worksFor: {
              "@type": "Organization",
              name: editorialProfile.organization,
              ...(editorialProfile.organizationUrl ? { url: editorialProfile.organizationUrl } : {}),
            },
          } : {}),
        },
        publisher: { "@type": "Organization", name: "Msingi Africa", url: siteUrl },
      }} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Biografias", item: new URL("/biografias", siteUrl).toString() },
          { "@type": "ListItem", position: 3, name: profile.title, item: pageUrl },
        ],
      }} />
      <div className="story-breadcrumb"><Link href="/biografias"><ArrowLeft size={14} /> Todas as biografias</Link><span> / </span><span>Retratos</span></div>
      <section className="person-hero">
        {portrait ? (
          <figure className="person-portrait">
            <div className="person-portrait-image">
              <Image src={portrait.src} alt={portrait.alt} fill sizes="(max-width: 800px) 100vw, 42vw" loading="eager" />
              <span className="person-portrait-index">MS / PROFILE</span>
            </div>
            <figcaption>
              Foto: <a href={portrait.sourceUrl} target="_blank" rel="noopener noreferrer">{portrait.credit}</a>
              {" · "}
              <a href={portrait.licenseUrl} target="_blank" rel="noopener noreferrer">{portrait.license}</a>
            </figcaption>
          </figure>
        ) : (
          <div className="person-art profile-sage"><span className="profile-orbit orbit-one" /><span className="profile-orbit orbit-two" /><span className="person-monogram">{profile.title.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase()}</span><span className="profile-art-caption">PESSOAS · IDEIAS · IMPACTO</span><span className="person-portrait-index">MS / PROFILE</span></div>
        )}
        <div className="person-intro">
          <span className="section-kicker">UM PERCURSO, MUITAS POSSIBILIDADES</span>
          <h1>{profile.title}</h1>
          <p className="person-role">{profile.personRole ?? "Uma história em perspetiva"}</p>
          <p className="person-summary">{profile.standfirst}</p>
          <div className="person-tags"><span><MapPin size={14} /> {profile.personCountry ?? "África"}</span><span>{profile.personField ?? profile.category}</span></div>
          <div className="person-quote"><span>“</span><p>Uma história que nos ajuda a olhar de novo para o que é possível.</p></div>
        </div>
      </section>
      <section className="person-story">
        <aside><span>O PERCURSO</span><span>UMA BIOGRAFIA<br />MS / JOURNAL</span><Link href="/publicar">Sugira outra história <ArrowUpRight size={14} /></Link></aside>
        <div className="person-body">
          <ArticleMarkdown content={profile.markdown ?? ""} />
          {profile.sources && profile.sources.length > 0 && (
            <section className="article-sources">
              <h2>Fontes e referências</h2>
              <ol>{profile.sources.map((source) => (
                <li key={`${source.url}-${source.title}`}>
                  <a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a>
                  {source.publisher && <span> · {source.publisher}</span>}
                </li>
              ))}</ol>
            </section>
          )}
          <div className="story-disclosure"><span>✳</span><p>Este perfil foi revisto pela redação. A publicação biográfica não está à venda. <Link href="/sobre#principios">Conheça os nossos princípios.</Link></p></div>
        </div>
      </section>
      <div className="section-pad"><ArticleInteractions articleId={profile.id} title={profile.title} /></div>
      {relatedArticles.length > 0 && (
        <section className="related-stories section-pad">
          <div className="section-heading">
            <div><span className="section-kicker">CONTEXTO E LEITURAS</span><h2>Histórias que<br />cruzam este <em>percurso.</em></h2></div>
            <Link href="/artigos" className="text-link">Todos os artigos <ArrowUpRight size={15} /></Link>
          </div>
          <div className="article-grid">{relatedArticles.map((article) => <ArticleCard key={article.slug} article={article} />)}</div>
        </section>
      )}
      <section className="people-section section-pad person-related">
        <div className="section-heading"><div><span className="section-kicker">OUTRAS PESSOAS, NOVAS IDEIAS</span><h2>Mais percursos<br />para <em>descobrir.</em></h2></div><Link className="text-link" href="/biografias">Todas as biografias <ArrowUpRight size={15} /></Link></div>
        <div className="profile-grid">{relatedProfiles.map((item) => <ProfileCard key={item.slug} profile={item} />)}</div>
      </section>
    </article>
  );
}
