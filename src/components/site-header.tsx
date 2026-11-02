"use client";

import {
  ArrowUpRight,
  BookOpenText,
  ChevronDown,
  Landmark,
  Menu,
  MessageCircle,
  Search,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Brand } from "@/components/brand";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { translate, type Locale } from "@/lib/i18n";

const discoveryLinks = [
  { title: "articles", description: "articlesDescription", href: "/artigos", icon: BookOpenText },
  { title: "biographies", description: "biographiesDescription", href: "/biografias", icon: UsersRound },
  { title: "entities", description: "entitiesDescription", href: "/entidades", icon: Landmark },
  { title: "debates", description: "debatesDescription", href: "/debates", icon: MessageCircle },
  { title: "authors", description: "authorsDescription", href: "/autores", icon: UserRound },
] as const;

export function SiteHeader({ locale }: { locale: Locale }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const pathname = usePathname();
  const navigationRef = useRef<HTMLElement>(null);
  const exploreButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isExploreOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !navigationRef.current?.contains(event.target)) {
        setIsExploreOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setIsExploreOpen(false);
      exploreButtonRef.current?.focus();
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isExploreOpen]);

  function closeNavigation() {
    setIsOpen(false);
    setIsExploreOpen(false);
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <Brand />
        <button
          className="mobile-menu-button"
          type="button"
          aria-label={translate(locale, isOpen ? "closeMenu" : "openMenu")}
          aria-expanded={isOpen}
          aria-controls="primary-navigation"
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <nav
          ref={navigationRef}
          id="primary-navigation"
          className={`primary-navigation${isOpen ? " navigation-open" : ""}`}
          aria-label={locale === "en" ? "Main navigation" : "Navegação principal"}
        >
          <div className={`nav-explore${isExploreOpen ? " nav-explore-open" : ""}`}>
            <button
              ref={exploreButtonRef}
              className={`nav-link nav-explore-trigger${discoveryLinks.some((link) => pathname.startsWith(link.href)) ? " nav-link-active" : ""}`}
              type="button"
              aria-expanded={isExploreOpen}
              aria-controls="explore-navigation"
              onClick={() => setIsExploreOpen((open) => !open)}
            >
              {translate(locale, "explore")} <ChevronDown size={14} aria-hidden="true" />
            </button>
            <div
              id="explore-navigation"
              className="nav-explore-panel"
              aria-label={translate(locale, "explore")}
              hidden={!isExploreOpen}
            >
              <p className="nav-explore-heading">{translate(locale, "exploreHeading")}</p>
              <div className="nav-explore-links">
                {discoveryLinks.map(({ description, href, icon: Icon, title }) => {
                  const isActive = pathname === href || pathname.startsWith(`${href}/`);
                  const label = translate(locale, title);
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`nav-explore-link${isActive ? " nav-explore-link-active" : ""}`}
                      aria-current={isActive ? "page" : undefined}
                      onClick={closeNavigation}
                    >
                      <span className="nav-explore-icon"><Icon size={17} aria-hidden="true" /></span>
                      <span><strong>{label}</strong><small>{translate(locale, description)}</small></span>
                      <ArrowUpRight size={14} className="nav-explore-arrow" aria-hidden="true" />
                    </Link>
                  );
                })}
              </div>
              <Link className="nav-explore-search" href="/pesquisa" onClick={closeNavigation}>
                <Search size={14} aria-hidden="true" /> {translate(locale, "searchAll")}
                <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </div>
          {[
            { label: translate(locale, "plans"), href: "/planos" },
            { label: translate(locale, "about"), href: "/sobre" },
          ].map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link${isActive ? " nav-link-active" : ""}`}
              aria-current={isActive ? "page" : undefined}
              onClick={closeNavigation}
            >
              {link.label}
            </Link>
            );
          })}
          <Link
            href="/pesquisa"
            className={`nav-link nav-icon-link${pathname.startsWith("/pesquisa") ? " nav-link-active" : ""}`}
            aria-label={translate(locale, "search")}
            onClick={closeNavigation}
          >
            <Search size={16} /><span className="nav-optional-label">{translate(locale, "search")}</span>
          </Link>
          <ThemeToggle locale={locale} />
          <LanguageSwitcher locale={locale} />
          <Link
            href="/painel"
            className={`nav-link nav-account-link${pathname.startsWith("/entrar") || pathname.startsWith("/painel") ? " nav-link-active" : ""}`}
            onClick={closeNavigation}
          >
            <UserRound size={15} /><span>{translate(locale, "dashboard")}</span>
          </Link>
          <Link
            href="/publicar"
            className="nav-cta"
            onClick={closeNavigation}
          >
            {translate(locale, "shareStory")} <ArrowUpRight size={15} strokeWidth={1.8} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
