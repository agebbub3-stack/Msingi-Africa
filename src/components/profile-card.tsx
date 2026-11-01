import { ArrowUpRight, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Biography } from "@/lib/content";
import { localizeCategory, localizeCountry, translate, type Locale } from "@/lib/i18n";
import { localizeBiography } from "@/lib/localized-editorial";

export function ProfileCard({ profile, locale = "en" }: { profile: Biography; locale?: Locale }) {
  const localizedProfile = localizeBiography(profile, locale);
  return (
    <article className={`profile-card profile-${localizedProfile.accent}`}>
      <Link
        className={`profile-art${localizedProfile.portrait ? " profile-art-photographic" : ""}`}
        href={`/biografias/${localizedProfile.slug}`}
        aria-label={locale === "en" ? `Read ${localizedProfile.name}'s biography` : `Ler a biografia de ${localizedProfile.name}`}
      >
        {localizedProfile.portrait ? (
          <Image
            src={localizedProfile.portrait.src}
            alt={localizedProfile.portrait.alt}
            fill
            sizes="(max-width: 760px) 100vw, 33vw"
            className="profile-art-image"
          />
        ) : (
          <>
            <span className="profile-orbit orbit-one" />
            <span className="profile-orbit orbit-two" />
            <span className="profile-monogram">{localizedProfile.monogram}</span>
          </>
        )}
        {localizedProfile.partnerName && localizedProfile.partnerLogoUrl && (
          <span className="profile-partner-mark">
            <Image src={localizedProfile.partnerLogoUrl} alt="" width={24} height={24} />
            <span>{locale === "en" ? "PARTNERSHIP" : "PARCERIA"} · {localizedProfile.partnerName}</span>
          </span>
        )}
        <span className="profile-art-caption">{locale === "en" ? "PEOPLE · IDEAS · IMPACT" : "PESSOAS · IDEIAS · IMPACTO"}</span>
        <span className="profile-art-country">{localizeCountry(localizedProfile.country, locale)}</span>
        <span className="profile-art-arrow"><ArrowUpRight size={17} /></span>
      </Link>
      <div className="profile-card-copy">
        {localizedProfile.isSponsored && (
          <p className="profile-partnership-label">
            {locale === "en" ? "DISCLOSED PARTNERSHIP" : "PARCERIA IDENTIFICADA"}
          </p>
        )}
        {localizedProfile.portrait && (
          <p className="portrait-credit">
            {translate(locale, "photoCredit")} <a href={localizedProfile.portrait.sourceUrl} target="_blank" rel="noopener noreferrer">{localizedProfile.portrait.credit}</a>
            {" · "}
            <a href={localizedProfile.portrait.licenseUrl} target="_blank" rel="noopener noreferrer">{localizedProfile.portrait.license}</a>
          </p>
        )}
        <div className="profile-location"><MapPin size={13} /> {localizeCountry(localizedProfile.country, locale)} <span>·</span> {localizeCategory(localizedProfile.field, locale)}</div>
        <h3><Link href={`/biografias/${localizedProfile.slug}`}>{localizedProfile.name}</Link></h3>
        <p className="profile-role">{localizedProfile.role}</p>
        <p className="profile-summary">{localizedProfile.summary}</p>
        <Link className="profile-card-link" href={`/biografias/${localizedProfile.slug}`}>
          {translate(locale, "readBiography")} <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
