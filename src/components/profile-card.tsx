import { ArrowUpRight, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Biography } from "@/lib/content";
import { localizeCategory, localizeCountry, translate, type Locale } from "@/lib/i18n";

export function ProfileCard({ profile, locale = "en" }: { profile: Biography; locale?: Locale }) {
  return (
    <article className={`profile-card profile-${profile.accent}`}>
      <Link
        className={`profile-art${profile.portrait ? " profile-art-photographic" : ""}`}
        href={`/biografias/${profile.slug}`}
        aria-label={locale === "en" ? `Read ${profile.name}'s biography` : `Ler a biografia de ${profile.name}`}
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
        <span className="profile-art-caption">{locale === "en" ? "PEOPLE · IDEAS · IMPACT" : "PESSOAS · IDEIAS · IMPACTO"}</span>
        <span className="profile-art-country">{localizeCountry(profile.country, locale)}</span>
        <span className="profile-art-arrow"><ArrowUpRight size={17} /></span>
      </Link>
      <div className="profile-card-copy">
        {profile.portrait && (
          <p className="portrait-credit">
            {translate(locale, "photoCredit")} <a href={profile.portrait.sourceUrl} target="_blank" rel="noopener noreferrer">{profile.portrait.credit}</a>
            {" · "}
            <a href={profile.portrait.licenseUrl} target="_blank" rel="noopener noreferrer">{profile.portrait.license}</a>
          </p>
        )}
        <div className="profile-location"><MapPin size={13} /> {localizeCountry(profile.country, locale)} <span>·</span> {localizeCategory(profile.field, locale)}</div>
        <h3><Link href={`/biografias/${profile.slug}`}>{profile.name}</Link></h3>
        <p className="profile-role">{profile.role}</p>
        <p className="profile-summary">{profile.summary}</p>
        <Link className="profile-card-link" href={`/biografias/${profile.slug}`}>
          {translate(locale, "readBiography")} <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
