import Link from "next/link";

export function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      className={`brand${light ? " brand-light" : ""}`}
      aria-label="Msingi Africa — página inicial"
    >
      <span className="brand-symbol" aria-hidden="true">
        <svg viewBox="0 0 42 42" fill="none">
          <path d="M7 32V10h6v3.7c1.7-2.7 4.1-4.1 7.3-4.1 3.5 0 6 1.5 7.5 4.2 1.6-2.7 4.1-4.2 7.2-4.2 5.3 0 8.5 3.5 8.5 9.2V32h-6.1V20.8c0-3.1-1.4-4.8-4.1-4.8s-4.4 2-4.4 4.9V32h-6.1V20.8c0-3.1-1.4-4.8-4.1-4.8s-4.4 2-4.4 4.9V32H7Z" fill="currentColor" transform="translate(-2 0) scale(.93 1)"/>
          <circle cx="34" cy="8" r="3" fill="#d58b54"/>
        </svg>
      </span>
      <span className="brand-copy">
        <span className="brand-name">msingi</span>
        <span className="brand-descriptor">AFRICA · JOURNAL</span>
      </span>
    </Link>
  );
}
