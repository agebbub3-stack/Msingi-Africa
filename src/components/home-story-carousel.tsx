"use client";

import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

export type HomeStoryCarouselItem = {
  href: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  label: string;
};

export function HomeStoryCarousel({ items }: { items: HomeStoryCarouselItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  function move(direction: -1 | 1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>(".home-story-card");
    const distance = card ? card.offsetWidth + 18 : track.clientWidth * 0.8;
    track.scrollBy({
      left: distance * direction,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }

  if (items.length === 0) return null;

  return (
    <section className="home-story-carousel section-pad" aria-labelledby="home-story-carousel-title">
      <div className="home-story-carousel-heading">
        <div>
          <span className="section-kicker">PESSOAS · MERCADOS · IDEIAS</span>
          <h2 id="home-story-carousel-title">Perspetivas em <em>movimento.</em></h2>
          <p>Histórias para descobrir, imagens para aproximar e contexto para levar consigo.</p>
        </div>
        <div className="home-story-carousel-controls" aria-label="Controlos do carrossel">
          <button type="button" onClick={() => move(-1)} aria-label="Ver histórias anteriores">
            <ArrowLeft size={17} />
          </button>
          <button type="button" onClick={() => move(1)} aria-label="Ver mais histórias">
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
      <div className="home-story-track" ref={trackRef} role="region" aria-label="Carrossel de histórias" tabIndex={0}>
        {items.map((item, index) => (
          <article className="home-story-card" key={`${item.href}-${item.title}`}>
            <Link className="home-story-image" href={item.href} aria-label={`Ler ${item.title}`}>
              <Image src={item.image} alt={item.imageAlt} fill sizes="(max-width: 760px) 78vw, (max-width: 1000px) 43vw, 29vw" />
              <span className="home-story-index">0{index + 1}</span>
              <span className="home-story-open" aria-hidden="true"><ArrowUpRight size={17} /></span>
            </Link>
            <div className="home-story-copy">
              <span className="home-story-label">{item.label}</span>
              <h3><Link href={item.href}>{item.title}</Link></h3>
              <p>{item.description}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="home-story-footer">
        <span>DESLIZE OU USE AS SETAS PARA EXPLORAR</span>
        <span>{String(items.length).padStart(2, "0")} HISTÓRIAS SELECIONADAS</span>
      </div>
    </section>
  );
}
