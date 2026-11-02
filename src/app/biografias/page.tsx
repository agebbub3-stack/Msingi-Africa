import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ProfileCard } from "@/components/profile-card";
import { getPublishedBiographies } from "@/lib/public-content";
import { getLocale } from "@/lib/locale.server";
import { createPageMetadata } from "@/lib/page-metadata";
import { hasContentForLocale } from "@/lib/localized-editorial";

export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return createPageMetadata({
    locale,
    kind: "biographies",
    path: "/biografias",
    eyebrow: locale === "en" ? "PEOPLE · IDEAS · IMPACT" : "PESSOAS · IDEIAS · IMPACTO",
    title: locale === "en" ? "African biographies and journeys" : "Biografias de África",
    description: locale === "en"
      ? "The people, journeys and ideas transforming African markets and culture."
      : "As pessoas, os percursos e as ideias que estão a transformar os mercados e a cultura africana.",
  });
}

export default async function BiographiesPage() {
  const [biographies, locale] = await Promise.all([getPublishedBiographies(), getLocale()]);
  const en = locale === "en";
  const visibleBiographies = en
    ? biographies.filter((profile) => hasContentForLocale(profile, locale))
    : biographies;
  return (
    <>
      <section className="bio-masthead">
        <span className="section-kicker">{en ? "PEOPLE MAKING THINGS HAPPEN" : "PESSOAS QUE FAZEM ACONTECER"} <span>✳</span></span>
        <div className="bio-masthead-layout">
          <div>
            <h1>{en ? <>Impact<br />has <em>many names.</em></> : <>O impacto<br />tem <em>muitos nomes.</em></>}</h1>
            <p>{en
              ? "Profiles of people shaping their fields — and the communities growing alongside them."
              : "Retratos de quem transforma o seu campo de atuação — e as comunidades que crescem consigo."}</p>
          </div>
          <div className="bio-big-number"><span>01 — ∞</span><p>{en ? <>EVERY JOURNEY<br />OPENS A PATH.</> : <>CADA PERCURSO<br />ABRE UM CAMINHO.</>}</p><ArrowUpRight size={22} /></div>
        </div>
      </section>
      <section className="people-section section-pad bio-archive">
        <div className="archive-label-row">        <span>{en ? "FEATURED" : "EM DESTAQUE"}</span><span>{String(visibleBiographies.length).padStart(2, "0")} {en ? "JOURNEYS" : "PERCURSOS"}</span></div>
        <div className="profile-grid">
          {visibleBiographies.map((profile) => <ProfileCard key={profile.slug} profile={profile} locale={locale} />)}
        </div>
        <div className="bio-suggest">
          <div>
            <span className="section-kicker">{en ? "A VOICE THAT DESERVES TO BE HEARD?" : "UMA VOZ QUE MERECE SER OUVIDA?"}</span>
            <h2>{en ? "We are always looking for stories that make us think." : "Estamos sempre à procura de histórias que nos façam pensar."}</h2>
          </div>
          <Link className="button button-dark" href="/publicar">{en ? "Suggest a profile" : "Sugira um perfil"} <ArrowUpRight size={15} /></Link>
        </div>
      </section>
    </>
  );
}
