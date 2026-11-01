"use client";

import { ArrowUpRight, Menu, Search, UserRound, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Brand } from "@/components/brand";

const links = [
  { label: "Artigos", href: "/artigos" },
  { label: "Biografias", href: "/biografias" },
  { label: "Entidades", href: "/entidades" },
  { label: "Sobre nós", href: "/sobre" },
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

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
          {isOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
        <nav
          id="primary-navigation"
          className={`primary-navigation${isOpen ? " navigation-open" : ""}`}
          aria-label="Navegação principal"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link${pathname.startsWith(link.href) ? " nav-link-active" : ""}`}
              aria-current={pathname.startsWith(link.href) ? "page" : undefined}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/pesquisa"
            className={`nav-link nav-icon-link${pathname.startsWith("/pesquisa") ? " nav-link-active" : ""}`}
            aria-label="Pesquisar"
            onClick={() => setIsOpen(false)}
          >
            <Search size={16} /><span className="nav-optional-label">Pesquisar</span>
          </Link>
          <Link
            href="/entrar"
            className={`nav-link nav-account-link${pathname.startsWith("/entrar") || pathname.startsWith("/painel") ? " nav-link-active" : ""}`}
            onClick={() => setIsOpen(false)}
          >
            <UserRound size={15} /><span>Entrar</span>
          </Link>
          <Link
            href="/publicar"
            className="nav-cta"
            onClick={() => setIsOpen(false)}
          >
            Partilhar uma história <ArrowUpRight size={15} strokeWidth={1.8} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
