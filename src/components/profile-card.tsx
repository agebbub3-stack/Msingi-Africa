import { ArrowUpRight, MapPin } from "lucide-react";
import Link from "next/link";
import type { Biography } from "@/lib/content";

export function ProfileCard({ profile }: { profile: Biography }) {
  return (
    <article className={`profile-card profile-${profile.accent}`}>
      <Link
        className="profile-art"
        href={`/biografias/${profile.slug}`}
        aria-label={`Ler a biografia de ${profile.name}`}
      >
        <span className="profile-orbit orbit-one" />
        <span className="profile-orbit orbit-two" />
        <span className="profile-monogram">{profile.monogram}</span>
        <span className="profile-art-caption">PESSOAS · IDEIAS · IMPACTO</span>
        <span className="profile-art-arrow"><ArrowUpRight size={17} /></span>
      </Link>
      <div className="profile-card-copy">
        <div className="profile-location"><MapPin size={13} /> {profile.country} <span>·</span> {profile.field}</div>
        <h3><Link href={`/biografias/${profile.slug}`}>{profile.name}</Link></h3>
        <p className="profile-role">{profile.role}</p>
        <p className="profile-summary">{profile.summary}</p>
      </div>
    </article>
  );
}
