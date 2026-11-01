import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import Script from "next/script";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { JsonLd } from "@/components/json-ld";
import { translate } from "@/lib/i18n";
import { getLocale } from "@/lib/locale.server";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});
const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-dm-serif",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://msingi.africa"),
  applicationName: "Kioo Africa",
  title: {
    default: "Kioo Africa — Mercados, inovação e perfis africanos",
    template: "%s — Kioo Africa",
  },
  description:
    "Kioo: jornalismo independente, biografias e análise de mercados africanos para compreender as raízes e antecipar o que vem a seguir.",
  keywords: ["jornalismo africano", "mercados africanos", "negócios em África", "inovação africana", "biografias africanas"],
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
  icons: { icon: [{ url: "/brand-mark.svg", type: "image/svg+xml" }] },
  openGraph: {
    title: "Kioo Africa — Mercados, inovação e perfis africanos",
    description:
      "Artigos, biografias e análise independente sobre o futuro dos mercados africanos.",
    siteName: "Kioo Africa",
    locale: "pt_PT",
    type: "website",
    images: [{ url: "/social-card.png", width: 1200, height: 630, alt: "Kioo Africa — histórias africanas com contexto" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kioo Africa — Mercados, inovação e perfis africanos",
    description: "Artigos, biografias e análise independente sobre o futuro dos mercados africanos.",
    images: ["/social-card-twitter.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <html lang={locale === "en" ? "en" : "pt"} className={`${dmSans.variable} ${dmSerifDisplay.variable}`} suppressHydrationWarning>
      <body>
        <Script id="kioo-theme-init" strategy="beforeInteractive">
          {`try { var theme = localStorage.getItem("kioo-theme"); var dark = theme ? theme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches; document.documentElement.dataset.theme = dark ? "dark" : "light"; } catch { document.documentElement.dataset.theme = "light"; }`}
        </Script>
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://msingi.africa"}#organization`,
          name: "Kioo Africa",
          alternateName: "Kioo",
          slogan: "Pessoas, ideias e mercados africanos.",
          url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://msingi.africa",
          logo: new URL("/brand-mark.svg", process.env.NEXT_PUBLIC_SITE_URL ?? "https://msingi.africa").toString(),
          description: "Grupo editorial e de pesquisa independente dedicado a pessoas, ideias e mercados africanos.",
          publishingPrinciples: new URL("/sobre#principios", process.env.NEXT_PUBLIC_SITE_URL ?? "https://msingi.africa").toString(),
          areaServed: { "@type": "Continent", name: "África" },
        }} />
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://msingi.africa"}#website`,
          name: "Kioo Africa",
          alternateName: "Kioo",
          url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://msingi.africa",
          inLanguage: ["pt-AO", "pt-PT"],
          publisher: { "@id": `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://msingi.africa"}#organization` },
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: new URL("/pesquisa?q={search_term_string}", process.env.NEXT_PUBLIC_SITE_URL ?? "https://msingi.africa").toString(),
            },
            "query-input": "required name=search_term_string",
          },
        }} />
        <div className="topline">
          <div className="topline-inner">
            <span>{translate(locale, "tagline")}</span>
            <span className="topline-date">{translate(locale, "topline")}</span>
          </div>
        </div>
        <SiteHeader locale={locale} />
        <main>{children}</main>
        <SiteFooter locale={locale} />
      </body>
    </html>
  );
}
