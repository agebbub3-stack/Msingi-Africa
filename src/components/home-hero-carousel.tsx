"use client";

import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { translate, type Locale } from "@/lib/i18n";

export type HomeHeroSlide = {
  href: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  label: string;
  byline: string;
  date: string;
  isOriginalLanguage?: boolean;
};

export function HomeHeroCarousel({ items, locale }: { items: HomeHeroSlide[]; locale: Locale }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (items.length === 0) return null;

  const selectedIndex = activeIndex % items.length;
  const activeItem = items[selectedIndex];
  const previous = () => setActiveIndex((index) => (index - 1 + items.length) % items.length);
  const next = () => setActiveIndex((index) => (index + 1) % items.length);

  return (
    <div
      className="hero-visual"
      role="region"
      aria-label={translate(locale, "featuredStories")}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") previous();
        if (event.key === "ArrowRight") next();
      }}
    >
      <div className="hero-slide">
        <Image
          key={activeItem.image}
          src={activeItem.image}
          alt={activeItem.imageAlt}
          fill
          loading="eager"
          unoptimized
          sizes="100vw"
        />
        <div className="hero-slide-shade" />
      </div>
      <div className="hero-feature-layout">
        <div className="hero-slide-content" key={activeItem.href} aria-live="polite" aria-atomic="true">
          <div className="hero-slide-kickers">
            <span className="hero-slide-edition">{locale === "en"
              ? (activeItem.isOriginalLanguage ? "ORIGINAL LANGUAGE" : "ENGLISH EDITION")
              : "EDIÇÃO DE HOJE"}</span>
            <span className="hero-slide-label">{activeItem.label}</span>
          </div>
          <h1><Link href={activeItem.href}>{activeItem.title}</Link></h1>
          <p>{activeItem.description}</p>
          <div className="hero-slide-byline">
            <Link className="hero-slide-link" href={activeItem.href}>
              {translate(locale, "readStory")} <ArrowUpRight size={15} />
            </Link>
            <span>{activeItem.byline}{activeItem.date ? ` · ${activeItem.date}` : ""}</span>
          </div>
        </div>
        <div className="hero-story-rail" aria-label={translate(locale, "chooseStory")}>
          {items.slice(0, 4).map((item, index) => (
            <button
              type="button"
              key={item.href}
              className={`hero-story-choice${index === selectedIndex ? " hero-story-choice-active" : ""}`}
              onClick={() => setActiveIndex(index)}
              aria-current={index === selectedIndex ? "true" : undefined}
              aria-label={`${translate(locale, "chooseStory")}: ${item.title}`}
            >
              <span>{item.label}</span>
              <strong>{item.title}</strong>
            </button>
          ))}
          {items.length > 1 && (
            <div className="hero-carousel-controls" aria-label={translate(locale, "storiesNavigation")}>
              <span className="hero-carousel-count">
                {String(selectedIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
              </span>
              <button type="button" onClick={previous} aria-label={translate(locale, "previousStory")}>
                <ArrowLeft size={16} />
              </button>
              <button type="button" onClick={next} aria-label={translate(locale, "nextStory")}>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
