import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ProfileCard } from "@/components/profile-card";
import { getPublishedBiographies } from "@/lib/public-content";

export const metadata: Metadata = {
  title: "Biografias de África",
  description: "As pessoas, os percursos e as ideias que estão a transformar os mercados e a cultura africana.",
};

export const dynamic = "force-dynamic";

export default async function BiographiesPage() {
  const biographies = await getPublishedBiographies();
  return (
    <>
      <section className="bio-masthead">
        <span className="section-kicker">PESSOAS QUE FAZEM ACONTECER <span>✳</span></span>
        <div className="bio-masthead-layout">
          <div><h1>O impacto<br />tem <em>muitos nomes.</em></h1><p>Retratos de quem transforma o seu campo de atuação — e as comunidades que crescem consigo.</p></div>
          <div className="bio-big-number"><span>01 — ∞</span><p>CADA PERCURSO<br />ABRE UM CAMINHO.</p><ArrowUpRight size={22} /></div>
        </div>
      </section>
      <section className="people-section section-pad bio-archive">
        <div className="archive-label-row"><span>EM DESTAQUE</span><span>{String(biographies.length).padStart(2, "0")} PERCURSOS</span></div>
        <div className="profile-grid">
          {biographies.map((profile) => <ProfileCard key={profile.slug} profile={profile} />)}
        </div>
        <div className="bio-suggest"><div><span className="section-kicker">UMA VOZ QUE MERECE SER OUVIDA?</span><h2>Estamos sempre à procura de histórias que nos façam pensar.</h2></div><Link className="button button-dark" href="/publicar">Sugira um perfil <ArrowUpRight size={15} /></Link></div>
      </section>
    </>
  );
}
