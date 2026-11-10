"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { ProfileCard } from "@/components/profile-card";
import type { Biography } from "@/lib/content";
import { localizeCategory, localizeCountry, type Locale } from "@/lib/i18n";
import { localizeBiography } from "@/lib/localized-editorial";

export function BiographiesArchive({
  profiles,
  locale,
}: {
  profiles: Biography[];
  locale: Locale;
}) {
  const [activeField, setActiveField] = useState("");
  const [query, setQuery] = useState("");
  const fields = [...new Set(profiles.map((profile) => profile.field))];
  const normalizedQuery = query.trim().toLocaleLowerCase(locale);
  const filteredProfiles = profiles.filter((profile) => {
    const localizedProfile = localizeBiography(profile, locale);
    const matchesField = !activeField || profile.field === activeField;
    const searchableText = [
      localizedProfile.name,
      localizedProfile.role,
      localizedProfile.summary,
      localizeCategory(profile.field, locale),
      localizeCountry(localizedProfile.country, locale),
    ].join(" ").toLocaleLowerCase(locale);
    return matchesField && (!normalizedQuery || searchableText.includes(normalizedQuery));
  });

  return (
    <>
      <div className="bio-archive-tools">
        <label className="search-field bio-search-field">
          <Search size={16} aria-hidden="true" />
          <span className="sr-only">{locale === "en" ? "Search profiles" : "Pesquisar perfis"}</span>
          <input
            type="search"
            placeholder={locale === "en" ? "Search people, fields or countries" : "Pesquisar pessoas, áreas ou países"}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <div className="topic-list bio-field-list" role="group" aria-label={locale === "en" ? "Filter profiles by field" : "Filtrar perfis por área"}>
          <button
            type="button"
            className={`topic-chip${activeField === "" ? " topic-chip-active" : ""}`}
            onClick={() => setActiveField("")}
            aria-pressed={activeField === ""}
          >
            {locale === "en" ? "All fields" : "Todas as áreas"}
          </button>
          {fields.map((field) => (
            <button
              key={field}
              type="button"
              className={`topic-chip${activeField === field ? " topic-chip-active" : ""}`}
              onClick={() => setActiveField(field)}
              aria-pressed={activeField === field}
            >
              {localizeCategory(field, locale)}
            </button>
          ))}
        </div>
      </div>
      <div className="archive-label-row bio-results-count" aria-live="polite">
        <span>{locale === "en" ? "EDITORIAL PROFILES" : "PERFIS EDITORIAIS"}</span>
        <span>{String(filteredProfiles.length).padStart(2, "0")} {locale === "en" ? "OF" : "DE"} {String(profiles.length).padStart(2, "0")} {locale === "en" ? "PROFILES" : "PERCURSOS"}</span>
      </div>
      {filteredProfiles.length > 0 ? (
        <div className="profile-grid">
          {filteredProfiles.map((profile) => <ProfileCard key={profile.slug} profile={profile} locale={locale} />)}
        </div>
      ) : (
        <div className="empty-search bio-empty-search" role="status">
          <h2>{locale === "en" ? "No profiles match this search." : "Não encontrámos perfis com esta pesquisa."}</h2>
          <p>{locale === "en" ? "Try another name, country or field." : "Tente outro nome, país ou área."}</p>
          <button
            className="button button-dark"
            type="button"
            onClick={() => {
              setActiveField("");
              setQuery("");
            }}
          >
            {locale === "en" ? "Clear filters" : "Limpar filtros"}
          </button>
        </div>
      )}
    </>
  );
}
