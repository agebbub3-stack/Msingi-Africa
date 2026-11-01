import Link from "next/link";

export function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      className={`brand${light ? " brand-light" : ""}`}
      aria-label="Bantaba Africa — página inicial"
    >
      <span className="brand-symbol" aria-hidden="true">
        <svg viewBox="0 0 42 42" fill="none">
          <circle cx="21" cy="21" r="15" stroke="currentColor" strokeWidth="1.5" opacity=".58" />
          <path d="M21 21V10M21 21l-9 5M21 21l9 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <circle cx="21" cy="9" r="2.6" fill="#d58b54" />
          <circle cx="10.5" cy="27" r="2.6" fill="currentColor" />
          <circle cx="31.5" cy="27" r="2.6" fill="currentColor" />
          <circle cx="21" cy="21" r="2.2" fill="#d58b54" />
        </svg>
      </span>
      <span className="brand-copy">
        <span className="brand-name">bantaba</span>
        <span className="brand-descriptor">AFRICA · JOURNAL</span>
      </span>
    </Link>
  );
}
