"use client";

import { useEffect, useRef, type ReactNode } from "react";

type ScrollRevealProps = {
  as?: "section" | "div";
  className: string;
  children: ReactNode;
  selector: string;
  id?: string;
  "aria-labelledby"?: string;
  "aria-label"?: string;
};

export function ScrollReveal({
  as: Element = "section",
  className,
  children,
  selector,
  id,
  "aria-labelledby": labelledBy,
  "aria-label": label,
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const items = Array.from(container.querySelectorAll<HTMLElement>(selector));
    if (items.length === 0) return;

    container.dataset.scrollRevealReady = "true";
    container.classList.add("scroll-reveal-ready");
    items.forEach((item, index) => {
      item.classList.add("scroll-reveal-item");
      item.style.setProperty("--scroll-reveal-delay", `${Math.min(index, 5) * 75}ms`);
    });

    if (CSS.supports("animation-timeline: view()")) {
      container.dataset.scrollRevealTimeline = "view";
      return () => {
        delete container.dataset.scrollRevealReady;
        delete container.dataset.scrollRevealTimeline;
        container.classList.remove("scroll-reveal-ready");
        items.forEach((item) => {
          item.classList.remove("scroll-reveal-item");
          item.style.removeProperty("--scroll-reveal-delay");
        });
      };
    }

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("scroll-revealed");
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.12, rootMargin: "0px 0px -7% 0px" });

    items.forEach((item) => observer.observe(item));
    return () => {
      observer.disconnect();
      delete container.dataset.scrollRevealReady;
      container.classList.remove("scroll-reveal-ready");
      items.forEach((item) => {
        item.classList.remove("scroll-reveal-item", "scroll-revealed");
        item.style.removeProperty("--scroll-reveal-delay");
      });
    };
  }, [selector]);

  const setContainerRef = (element: HTMLElement | null) => {
    containerRef.current = element;
  };

  return (
    <Element
      ref={setContainerRef}
      className={className}
      id={id}
      aria-labelledby={labelledBy}
      aria-label={label}
    >
      {children}
    </Element>
  );
}
