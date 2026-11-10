import type { ReactNode } from "react";

type ScrollRevealProps = {
  as?: "section" | "div";
  className: string;
  children: ReactNode;
  id?: string;
  "aria-labelledby"?: string;
  "aria-label"?: string;
};

export function ScrollReveal({
  as: Element = "section",
  className,
  children,
  id,
  "aria-labelledby": labelledBy,
  "aria-label": label,
}: ScrollRevealProps) {
  return (
    <Element
      className={className}
      id={id}
      aria-labelledby={labelledBy}
      aria-label={label}
    >
      {children}
    </Element>
  );
}
