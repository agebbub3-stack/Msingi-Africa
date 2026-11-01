import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import Script from "next/script";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { JsonLd } from "@/components/json-ld";
import { translate } from "@/lib/i18n";
import { getLocale } from "@/lib/locale.server";
import { createPageMetadata } from "@/lib/page-metadata";
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

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const title = locale === "en"
    ? "Kioo Africa — African markets, ideas and people"
    : "Kioo Africa — Mercados, inovação e perfis africanos";
  const description = locale === "en"
    ? "Independent journalism, biographies and market analysis to understand what is changing across Africa."
    : "Jornalismo independente, biografias e análise de mercados para compreender o que está a mudar em África.";
  return {
    ...createPageMetadata({
      locale,
      kind: "home",
      title,
      description,
      path: "/",
      eyebrow: locale === "en" ? "PEOPLE · IDEAS · MARKETS" : "PESSOAS · IDEIAS · MERCADOS",
    }),
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://msingi.africa"),
    applicationName: "Kioo Africa",
    title: { default: title, template: "%s — Kioo Africa" },
    keywords: locale === "en"
      ? ["African journalism", "African markets", "business in Africa", "African innovation", "African biographies"]
      : ["jornalismo africano", "mercados africanos", "negócios em África", "inovação africana", "biografias africanas"],
    ...(process.env.GOOGLE_SITE_VERIFICATION
      ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
      : {}),
    icons: { icon: [{ url: "/brand-mark.svg", type: "image/svg+xml" }] },
  };
}

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
          description: locale === "en"
            ? "Independent editorial and research group focused on African people, ideas and markets."
            : "Grupo editorial e de pesquisa independente dedicado a pessoas, ideias e mercados africanos.",
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
          inLanguage: locale === "en" ? "en" : ["pt-AO", "pt-PT"],
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
        {locale === "en" && (
          <p className="locale-content-notice" role="note">
            English interface · Editorial stories remain in their original language.
          </p>
        )}
        <main>{children}</main>
        <SiteFooter locale={locale} />
      </body>
    </html>
  );
}
