"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { translate, type Locale } from "@/lib/i18n";

const THEME_STORAGE_KEY = "kioo-theme";

function getThemeSnapshot() {
  return document.documentElement.dataset.theme === "dark";
}

function subscribeToTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

function applyTheme(isDark: boolean) {
  document.documentElement.dataset.theme = isDark ? "dark" : "light";
  window.localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
}

export function ThemeToggle({ locale }: { locale: Locale }) {
  const isDark = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, () => false);

  return (
    <button
      className="header-utility-button theme-toggle"
      type="button"
      aria-label={translate(locale, isDark ? "themeLight" : "themeDark")}
      title={translate(locale, isDark ? "themeLight" : "themeDark")}
      onClick={() => applyTheme(!isDark)}
    >
      {isDark ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
    </button>
  );
}
