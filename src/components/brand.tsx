import Link from "next/link";

export function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      className={`brand${light ? " brand-light" : ""}`}
      aria-label="Kioo Africa Angola — página inicial"
    >
      <span className="brand-symbol" aria-hidden="true">
        <svg viewBox="0 0 48 48" fill="none">
          <path d="M15 10v28M16 24l17-14M16 24l17 14" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="m19.5 24 4.5-3.8v7.6L19.5 24Z" fill="#d98756" />
        </svg>
      </span>
      <span className="brand-copy">
        <span className="brand-name">kioo</span>
        <span className="brand-descriptor">AFRICA · ANGOLA</span>
      </span>
    </Link>
  );
}
