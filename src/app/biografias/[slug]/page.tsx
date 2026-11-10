import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, ExternalLink, MapPin, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleInteractions } from "@/components/article-interactions";
import { ArticleMarkdown } from "@/components/article-markdown";
import { ArticleCard } from "@/components/article-card";
import { JsonLd } from "@/components/json-ld";
import { ProfileCard } from "@/components/profile-card";
import { ReadingProgress } from "@/components/reading-progress";
import { getApprovedArticleComments, getPublishedArticle, getPublishedBiographies } from "@/lib/public-content";
import { getStorySeo } from "@/lib/story-seo";
import { articles as editorialArticles, biographies as editorialBiographies } from "@/lib/content";
import { getLocale } from "@/lib/locale.server";
import { localizeCategory } from "@/lib/i18n";
import { hasContentForLocale, localizeArticle } from "@/lib/localized-editorial";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [profile, locale] = await Promise.all([getPublishedArticle(slug, "biography"), getLocale()]);
  if (!profile) return { title: "Perfil não encontrado", robots: { index: false, follow: false } };
  if (!hasContentForLocale(profile, locale)) {
    return {
      title: locale === "en" ? "This biography is not available in English yet" : "Esta biografia ainda não está disponível em português",
      description: locale === "en"
        ? "Switch to Portuguese to read this biography in its original language."
        : "Mude para inglês para ler esta biografia na sua língua original.",
      robots: { index: false, follow: true },
    };
  }
  const siteUrl = getSiteUrl();
  const localizedProfile = localizeArticle(profile, locale);
  const seo = getStorySeo(localizedProfile);
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
      images: [{ url: localizedProfile.image, alt: localizedProfile.imageAlt }],
    },
    twitter: { card: "summary_large_image", title: seo.title, description: seo.description, images: [localizedProfile.image] },
  };
}

export default async function BiographyPage({ params }: Props) {
  const { slug } = await params;
  const [profile, biographies, locale] = await Promise.all([
    getPublishedArticle(slug, "biography"),
    getPublishedBiographies(),
    getLocale(),
  ]);
  if (!profile) notFound();
  const en = locale === "en";
  if (!hasContentForLocale(profile, locale)) {
    return (
      <section className="archive-content section-pad language-unavailable">
        <span className="section-kicker">KIOO AFRICA · {en ? "LANGUAGE" : "IDIOMA"}</span>
        <h1>{en ? "This biography is not available in English yet." : "Esta biografia ainda não está disponível em português."}</h1>
        <p>{en
          ? "Choose Portuguese in the language menu to read it in its original language."
          : "Escolha English no menu de idioma para ler esta biografia na sua língua original."}</p>
        <Link className="button button-dark" href="/biografias">{en ? "Explore available biographies" : "Explorar biografias disponíveis"} <ArrowUpRight size={15} /></Link>
      </section>
    );
  }
  const localizedProfile = localizeArticle(profile, locale);

  const siteUrl = getSiteUrl();
  const pageUrl = new URL(`/biografias/${slug}`, siteUrl).toString();
  const relatedProfiles = biographies
    .filter((item) => item.slug !== slug && hasContentForLocale(item, locale))
    .slice(0, 3);
  const editorialProfile = editorialBiographies.find((item) => item.slug === slug);
  const relatedArticleSlugs = new Set(editorialProfile?.relatedArticleSlugs ?? []);
  const relatedArticles = editorialArticles.filter((item) =>
    relatedArticleSlugs.has(item.slug) && hasContentForLocale(item, locale),
  );
  const portrait = editorialProfile?.portrait;
  const profileLinks = [
    ...(editorialProfile?.organizationUrl
      ? [{ href: editorialProfile.organizationUrl, label: en ? "Official website" : "Site oficial" }]
      : []),
    ...(editorialProfile?.contactUrl
      ? [{ href: editorialProfile.contactUrl, label: en ? "Contact" : "Contacto" }]
      : []),
    ...[...new Set(editorialProfile?.sameAs ?? [])]
      .filter((url) => url !== editorialProfile?.organizationUrl && url !== editorialProfile?.contactUrl)
      .map((url) => {
        const host = new URL(url).hostname.replace(/^www\./, "");
        const label = host === "github.com" ? "GitHub"
          : host === "x.com" ? "X"
            : host === "linkedin.com" ? "LinkedIn"
              : en ? "Public profile" : "Perfil público";
        return { href: url, label };
      }),
  ];
  const seo = getStorySeo(localizedProfile);
  const initialComments = profile.id
    ? await getApprovedArticleComments(profile.id)
    : { comments: [], totalCount: 0 };

  return (
    <article className="person-page">
      <ReadingProgress />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        name: localizedProfile.title,
        inLanguage: en ? "en" : "pt-AO",
        description: seo.description,
        keywords: seo.keywords,
        url: pageUrl,
        datePublished: profile.publishedAt ?? undefined,
        dateModified: profile.modifiedAt ?? undefined,
        mainEntity: {
          "@type": "Person",
          name: localizedProfile.title,
          ...(editorialProfile?.alternateName ? { alternateName: editorialProfile.alternateName } : {}),
          description: seo.description,
          jobTitle: localizedProfile.personRole ?? undefined,
          knowsAbout: localizedProfile.personField ?? localizedProfile.category,
          url: pageUrl,
          ...(editorialProfile?.sameAs?.length ? { sameAs: editorialProfile.sameAs } : {}),
          ...(portrait?.src ? { image: new URL(portrait.src, siteUrl).toString() } : {}),
          homeLocation: localizedProfile.personCountry ? { "@type": "Place", name: localizedProfile.personCountry } : undefined,
          ...(editorialProfile?.organization ? {
            worksFor: {
              "@type": "Organization",
              name: editorialProfile.organization,
              ...(editorialProfile.organizationUrl ? { url: editorialProfile.organizationUrl } : {}),
            },
          } : {}),
        },
        publisher: { "@type": "Organization", name: "Kioo Africa", url: siteUrl.origin },
      }} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: en ? "Home" : "Início", item: siteUrl.origin },
          { "@type": "ListItem", position: 2, name: en ? "Biographies" : "Biografias", item: new URL("/biografias", siteUrl).toString() },
          { "@type": "ListItem", position: 3, name: localizedProfile.title, item: pageUrl },
        ],
      }} />
      <div className="story-breadcrumb"><Link href="/biografias"><ArrowLeft size={14} /> {en ? "All biographies" : "Todas as biografias"}</Link><span> / </span><span>{en ? "Profiles" : "Retratos"}</span></div>
      <section className="person-hero">
        {portrait ? (
          <figure className="person-portrait">
            <div className="person-portrait-image">
              <Image src={portrait.src} alt={portrait.alt} fill sizes="(max-width: 800px) 100vw, 42vw" loading="eager" />
              <span className="person-portrait-index">KIOO / PROFILE</span>
            </div>
            <figcaption>
              {en ? "Photo:" : "Foto:"} <a href={portrait.sourceUrl} target="_blank" rel="noopener noreferrer">{portrait.credit}</a>
              {" · "}
              <a href={portrait.licenseUrl} target="_blank" rel="noopener noreferrer">{portrait.license}</a>
            </figcaption>
          </figure>
        ) : (
          <div className={`person-art profile-${editorialProfile?.accent ?? "sage"}`}>
            <span className="person-monogram">
              {editorialProfile?.monogram ?? profile.title.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase()}
            </span>
            {profile.isSponsored && profile.partnerName && profile.partnerLogoUrl && (
              <span className="profile-partner-mark">
                <Image src={profile.partnerLogoUrl} alt="" width={24} height={24} />
                <span>{en ? "PARTNERSHIP" : "PARCERIA"} · {profile.partnerName}</span>
              </span>
            )}
            <span className="profile-art-caption">{en ? "PEOPLE · IDEAS · IMPACT" : "PESSOAS · IDEIAS · IMPACTO"}</span>
            <span className="person-portrait-index">{en ? "KIOO / PROFILE" : "KIOO / PERFIL"}</span>
          </div>
        )}
        <div className="person-intro">
          <span className="section-kicker">{en ? "ONE JOURNEY, MANY POSSIBILITIES" : "UM PERCURSO, MUITAS POSSIBILIDADES"}</span>
          <h1>{localizedProfile.title}</h1>
          <p className="person-role">{localizedProfile.personRole ?? (en ? "A story in perspective" : "Uma história em perspetiva")}</p>
          <p className="person-summary">{localizedProfile.standfirst}</p>
          <div className="person-tags"><span><MapPin size={14} /> {localizedProfile.personCountry ?? (en ? "Africa" : "África")}</span><span>{localizeCategory(localizedProfile.personField ?? localizedProfile.category, locale)}</span></div>
          {profileLinks.length > 0 && (
            <nav className="person-links" aria-label={en ? "Public links" : "Ligações públicas"}>
              {profileLinks.map(({ href, label }) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer">
                  {label} <ExternalLink size={13} aria-hidden="true" />
                </a>
              ))}
            </nav>
          )}
        </div>
      </section>
      <section className="person-story">
        <aside><span>{en ? "THE JOURNEY" : "O PERCURSO"}</span><span>{en ? <>A BIOGRAPHY<br />KIOO / JOURNAL</> : <>UMA BIOGRAFIA<br />KIOO / JOURNAL</>}</span><Link href="/publicar">{en ? "Suggest another story" : "Sugira outra história"} <ArrowUpRight size={14} /></Link></aside>
        <div className="person-body">
          <ArticleMarkdown content={localizedProfile.markdown ?? ""} />
          {localizedProfile.sources && localizedProfile.sources.length > 0 && (
            <section className="article-sources">
              <h2>{en ? "Sources and references" : "Fontes e referências"}</h2>
              <ol>{localizedProfile.sources.map((source) => (
                <li key={`${source.url}-${source.title}`}>
                  <a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a>
                  {source.publisher && <span> · {source.publisher}</span>}
                </li>
              ))}</ol>
            </section>
          )}
          <div className={`story-disclosure${profile.isSponsored ? " disclosure-sponsored" : ""}`}><ShieldCheck size={16} aria-hidden="true" /><p>{profile.isSponsored
            ? localizedProfile.sponsorDisclosure ?? (en ? "This profile contains a disclosed partnership." : "Este perfil identifica uma parceria.")
            : en
              ? "This editorial profile is based on the references listed above. "
              : "Este perfil editorial baseia-se nas referências indicadas acima. "}
            <Link href="/sobre#principios">{en ? "Read our principles." : "Conheça os nossos princípios."}</Link>
          </p></div>
        </div>
      </section>
      <div className="section-pad">
        <ArticleInteractions
          articleId={profile.id}
          title={localizedProfile.title}
          shareUrl={pageUrl}
          returnPath={`/biografias/${profile.slug}`}
          initialComments={initialComments.comments}
          initialCommentCount={initialComments.totalCount}
          locale={locale}
        />
      </div>
      {relatedArticles.length > 0 && (
        <section className="related-stories section-pad">
          <div className="section-heading">
            <div><span className="section-kicker">{en ? "CONTEXT AND READING" : "CONTEXTO E LEITURAS"}</span><h2>{en ? <>Stories that<br />cross this <em>journey.</em></> : <>Histórias que<br />cruzam este <em>percurso.</em></>}</h2></div>
            <Link href="/artigos" className="text-link">{en ? "All articles" : "Todos os artigos"} <ArrowUpRight size={15} /></Link>
          </div>
          <div className="article-grid">{relatedArticles.map((article) => <ArticleCard key={article.slug} article={article} locale={locale} />)}</div>
        </section>
      )}
      <section className="people-section section-pad person-related">
        <div className="section-heading"><div><span className="section-kicker">{en ? "OTHER PEOPLE, NEW IDEAS" : "OUTRAS PESSOAS, NOVAS IDEIAS"}</span><h2>{en ? <>More journeys<br />to <em>discover.</em></> : <>Mais percursos<br />para <em>descobrir.</em></>}</h2></div><Link className="text-link" href="/biografias">{en ? "All biographies" : "Todas as biografias"} <ArrowUpRight size={15} /></Link></div>
        <div className="profile-grid">{relatedProfiles.map((item) => <ProfileCard key={item.slug} profile={item} locale={locale} />)}</div>
      </section>
    </article>
  );
}
