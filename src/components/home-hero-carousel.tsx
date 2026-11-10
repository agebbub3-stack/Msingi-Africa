"use client";

import { ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { translate, type Locale } from "@/lib/i18n";

const autoplayDelay = 8000;

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
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
      setIsPlaying(!mediaQuery.matches);
    };

    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);
    return () => mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  const selectedIndex = activeIndex % items.length;
  const isRotating = isPlaying && !isHovered && !prefersReducedMotion && items.length > 1;
  const previous = () => setActiveIndex((index) => (index - 1 + items.length) % items.length);
  const next = () => setActiveIndex((index) => (index + 1) % items.length);

  useEffect(() => {
    if (!isRotating) return;

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        setActiveIndex((index) => (index + 1) % items.length);
      }
    }, autoplayDelay);

    return () => window.clearInterval(intervalId);
  }, [isRotating, items.length, selectedIndex]);

  if (items.length === 0) return null;

  const activeItem = items[selectedIndex];

  return (
    <div
      className={`hero-visual${isRotating ? " hero-visual-rotating" : ""}`}
      role="region"
      aria-roledescription={locale === "en" ? "carousel" : "carrossel"}
      aria-label={translate(locale, "featuredStories")}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsPlaying(false)}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          previous();
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          next();
        }
      }}
    >
      <div
        className="hero-slide"
        role="group"
        aria-roledescription={locale === "en" ? "slide" : "diapositivo"}
        aria-label={`${selectedIndex + 1} / ${items.length}`}
      >
        <Image
          key={activeItem.image}
          src={activeItem.image}
          alt={activeItem.imageAlt}
          fill
          loading={selectedIndex === 0 ? "eager" : "lazy"}
          fetchPriority={selectedIndex === 0 ? "high" : "auto"}
          unoptimized={
            activeItem.image.startsWith("http")
            && !activeItem.image.startsWith("https://images.unsplash.com/")
          }
          sizes="100vw"
        />
        <div className="hero-slide-shade" />
      </div>
      <div className="hero-feature-layout">
        <div
          className="hero-slide-content"
          key={activeItem.href}
          aria-live={isRotating ? "off" : "polite"}
          aria-atomic="true"
        >
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
        <div className="hero-story-rail" role="group" aria-label={translate(locale, "chooseStory")}>
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
              <i aria-hidden="true" />
            </button>
          ))}
          {items.length > 1 && (
            <div className="hero-carousel-controls" aria-label={translate(locale, "storiesNavigation")}>
              <span className="hero-carousel-count">
                {String(selectedIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
              </span>
              <div className="hero-carousel-progress" aria-hidden="true">
                <span key={selectedIndex} />
              </div>
              {!prefersReducedMotion && (
                <button
                  type="button"
                  onClick={() => setIsPlaying((playing) => !playing)}
                  aria-label={translate(locale, isPlaying ? "pauseCarousel" : "resumeCarousel")}
                >
                  {isPlaying ? <Pause size={15} /> : <Play size={15} />}
                </button>
              )}
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
