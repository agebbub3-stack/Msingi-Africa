import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import Script from "next/script";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { JsonLd } from "@/components/json-ld";
import { translate } from "@/lib/i18n";
import { getLocale } from "@/lib/locale.server";
import { createPageMetadata } from "@/lib/page-metadata";
import { getSiteUrl } from "@/lib/site-url";
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
  const siteUrl = getSiteUrl();
  const title = locale === "en"
    ? "Kioo Africa | African Business, Markets & Biographies"
    : "Kioo Africa | Negócios, mercados e biografias africanas";
  const description = locale === "en"
    ? "Independent African journalism and research on business, markets, innovation and the people shaping the continent."
    : "Jornalismo e pesquisa independente sobre negócios, mercados, inovação e as pessoas que estão a transformar África.";
  const verification: NonNullable<Metadata["verification"]> = {};
  if (process.env.GOOGLE_SITE_VERIFICATION) {
    verification.google = process.env.GOOGLE_SITE_VERIFICATION;
  }
  if (process.env.BING_SITE_VERIFICATION) {
    verification.other = { "msvalidate.01": process.env.BING_SITE_VERIFICATION };
  }
  return {
    ...createPageMetadata({
      locale,
      kind: "home",
      title,
      description,
      path: "/",
      eyebrow: locale === "en" ? "PEOPLE · IDEAS · MARKETS" : "PESSOAS · IDEIAS · MERCADOS",
    }),
    metadataBase: siteUrl,
    applicationName: "Kioo Africa",
    title: { default: title, template: "%s — Kioo Africa" },
    keywords: locale === "en"
      ? ["African journalism", "African markets", "business in Africa", "African innovation", "African biographies"]
      : ["jornalismo africano", "mercados africanos", "negócios em África", "inovação africana", "biografias africanas"],
    ...(Object.keys(verification).length > 0 ? { verification } : {}),
    icons: { icon: [{ url: "/brand-mark.svg", type: "image/svg+xml" }] },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const siteUrl = getSiteUrl();
  return (
    <html lang={locale === "en" ? "en" : "pt"} className={`${dmSans.variable} ${dmSerifDisplay.variable}`} suppressHydrationWarning>
      <body>
        <Script id="kioo-theme-init" strategy="beforeInteractive">
          {`try { var theme = localStorage.getItem("kioo-theme"); var dark = theme ? theme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches; document.documentElement.dataset.theme = dark ? "dark" : "light"; } catch { document.documentElement.dataset.theme = "light"; }`}
        </Script>
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": `${siteUrl.origin}#organization`,
          name: "Kioo Africa",
          slogan: "Pessoas, ideias e mercados africanos.",
          url: siteUrl.origin,
          logo: new URL("/brand-mark.svg", siteUrl).toString(),
          description: locale === "en"
            ? "Independent African editorial and research publication covering business, markets, innovation, biographies and ideas."
            : "Publicação editorial e de pesquisa independente sobre negócios, mercados, inovação, biografias e ideias africanas.",
          disambiguatingDescription: locale === "en"
            ? "An independent African business and markets publication, not an entertainment or lifestyle directory."
            : "Uma publicação independente sobre negócios e mercados africanos, não um diretório de entretenimento ou estilo de vida.",
          publishingPrinciples: new URL("/sobre#principios", siteUrl).toString(),
          areaServed: { "@type": "Continent", name: "África" },
        }} />
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": `${siteUrl.origin}#website`,
          name: "Kioo Africa",
          url: siteUrl.origin,
          inLanguage: locale === "en" ? "en" : ["pt-AO", "pt-PT"],
          publisher: { "@id": `${siteUrl.origin}#organization` },
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: new URL("/pesquisa?q={search_term_string}", siteUrl).toString(),
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
