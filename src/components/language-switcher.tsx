"use client";

import { Check, ChevronDown, Globe2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { translate, type Locale } from "@/lib/i18n";

function persistLocale(locale: Locale) {
  document.cookie = `kioo-locale=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
  document.documentElement.lang = locale === "en" ? "en" : "pt";
}

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  function selectLocale(nextLocale: Locale) {
    persistLocale(nextLocale);
    setIsOpen(false);
    router.refresh();
  }

  return (
    <div className={`language-switcher${isOpen ? " language-switcher-open" : ""}`}>
      <button
        className="header-utility-button language-switcher-trigger"
        type="button"
        aria-label={translate(locale, "language")}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((open) => !open)}
      >
        <Globe2 size={16} aria-hidden="true" />
        <span>{locale.toUpperCase()}</span>
        <ChevronDown size={11} aria-hidden="true" />
      </button>
      {isOpen && (
        <div className="language-switcher-menu" role="menu" aria-label={translate(locale, "language")}>
          {(["pt", "en"] as const).map((option) => (
            <button
              key={option}
              type="button"
              role="menuitemradio"
              aria-checked={locale === option}
              onClick={() => selectLocale(option)}
            >
              <span>{option === "pt" ? "Português" : "English"}</span>
              {locale === option && <Check size={14} aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
