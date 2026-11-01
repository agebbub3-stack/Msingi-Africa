import { ArrowUpRight, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Biography } from "@/lib/content";

export function ProfileCard({ profile }: { profile: Biography }) {
  return (
    <article className={`profile-card profile-${profile.accent}`}>
      <Link
        className={`profile-art${profile.portrait ? " profile-art-photographic" : ""}`}
        href={`/biografias/${profile.slug}`}
        aria-label={`Ler a biografia de ${profile.name}`}
      >
        {profile.portrait ? (
          <Image
            src={profile.portrait.src}
            alt={profile.portrait.alt}
            fill
            sizes="(max-width: 760px) 100vw, 33vw"
            className="profile-art-image"
          />
        ) : (
          <>
            <span className="profile-orbit orbit-one" />
            <span className="profile-orbit orbit-two" />
            <span className="profile-monogram">{profile.monogram}</span>
          </>
        )}
        <span className="profile-art-caption">PESSOAS · IDEIAS · IMPACTO</span>
        <span className="profile-art-arrow"><ArrowUpRight size={17} /></span>
      </Link>
      <div className="profile-card-copy">
        {profile.portrait && (
          <p className="portrait-credit">
            Foto: <a href={profile.portrait.sourceUrl} target="_blank" rel="noopener noreferrer">{profile.portrait.credit}</a>
            {" · "}
            <a href={profile.portrait.licenseUrl} target="_blank" rel="noopener noreferrer">{profile.portrait.license}</a>
          </p>
        )}
        <div className="profile-location"><MapPin size={13} /> {profile.country} <span>·</span> {profile.field}</div>
        <h3><Link href={`/biografias/${profile.slug}`}>{profile.name}</Link></h3>
        <p className="profile-role">{profile.role}</p>
        <p className="profile-summary">{profile.summary}</p>
      </div>
    </article>
  );
}
