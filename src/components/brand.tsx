import Link from "next/link";

export function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      className={`brand${light ? " brand-light" : ""}`}
      aria-label="Kioo Africa — página inicial"
    >
      <span className="brand-symbol" aria-hidden="true">
        <svg viewBox="0 0 42 42" fill="none">
          <path d="M4.5 21C8.7 14.8 14.2 12 21 12s12.3 2.8 16.5 9C33.3 27.2 27.8 30 21 30S8.7 27.2 4.5 21Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          <circle cx="21" cy="21" r="3.1" fill="#d58b54" />
        </svg>
      </span>
      <span className="brand-copy">
        <span className="brand-name">kioo</span>
        <span className="brand-descriptor">AFRICA · JOURNAL</span>
      </span>
    </Link>
  );
}
