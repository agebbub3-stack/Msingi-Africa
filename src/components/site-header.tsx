"use client";

import {
  ArrowUpRight,
  BookOpenText,
  ChevronDown,
  Landmark,
  Menu,
  Search,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Brand } from "@/components/brand";

const discoveryLinks = [
  {
    label: "Artigos e análise",
    description: "Ideias, mercados e tendências africanas.",
    href: "/artigos",
    icon: BookOpenText,
  },
  {
    label: "Biografias",
    description: "Pessoas a transformar o continente.",
    href: "/biografias",
    icon: UsersRound,
  },
  {
    label: "Entidades",
    description: "Empresas e organizações em foco.",
    href: "/entidades",
    icon: Landmark,
  },
  {
    label: "Autores",
    description: "Conheça quem assina as histórias.",
    href: "/autores",
    icon: UserRound,
  },
];

export function SiteHeader() {
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
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
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
          aria-label="Navegação principal"
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
              Explorar <ChevronDown size={14} aria-hidden="true" />
            </button>
            <div
              id="explore-navigation"
              className="nav-explore-panel"
              aria-label="Explorar a Bantaba Africa"
              hidden={!isExploreOpen}
            >
              <p className="nav-explore-heading">IDEIAS QUE MOVEM ÁFRICA</p>
              <div className="nav-explore-links">
                {discoveryLinks.map(({ description, href, icon: Icon, label }) => {
                  const isActive = pathname === href || pathname.startsWith(`${href}/`);
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`nav-explore-link${isActive ? " nav-explore-link-active" : ""}`}
                      aria-current={isActive ? "page" : undefined}
                      onClick={closeNavigation}
                    >
                      <span className="nav-explore-icon"><Icon size={17} aria-hidden="true" /></span>
                      <span><strong>{label}</strong><small>{description}</small></span>
                      <ArrowUpRight size={14} className="nav-explore-arrow" aria-hidden="true" />
                    </Link>
                  );
                })}
              </div>
              <Link className="nav-explore-search" href="/pesquisa" onClick={closeNavigation}>
                <Search size={14} aria-hidden="true" /> Pesquisar histórias e pessoas
                <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </div>
          {[
            { label: "Planos", href: "/planos" },
            { label: "Sobre nós", href: "/sobre" },
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
            aria-label="Pesquisar"
            onClick={closeNavigation}
          >
            <Search size={16} /><span className="nav-optional-label">Pesquisar</span>
          </Link>
          <Link
            href="/entrar"
            className={`nav-link nav-account-link${pathname.startsWith("/entrar") || pathname.startsWith("/painel") ? " nav-link-active" : ""}`}
            onClick={closeNavigation}
          >
            <UserRound size={15} /><span>Entrar</span>
          </Link>
          <Link
            href="/publicar"
            className="nav-cta"
            onClick={closeNavigation}
          >
            Partilhar uma história <ArrowUpRight size={15} strokeWidth={1.8} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
