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
import { KIOO_FACEBOOK_URL } from "@/lib/social-links";
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
    ? "Kioo Africa Angola | African Markets, Business & Biographies"
    : "Kioo Africa Angola | Mercados e biografias africanas";
  const description = locale === "en"
    ? "Kioo Africa Angola is an independent editorial publication covering African markets, business, technology and biographies through research and context."
    : "A Kioo Africa Angola é uma iniciativa editorial independente sobre mercados africanos, negócios, tecnologia e biografias, com jornalismo e pesquisa.";
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
    applicationName: "Kioo Africa Angola",
    title: { default: title, template: "%s — Kioo Africa Angola" },
    keywords: locale === "en"
      ? ["Kioo Africa Angola", "African journalism", "African markets", "business in Africa", "African innovation", "African biographies"]
      : ["Kioo Africa Angola", "jornalismo africano", "mercados africanos", "negócios em África", "inovação africana", "biografias africanas"],
    ...(Object.keys(verification).length > 0 ? { verification } : {}),
    icons: { icon: [{ url: "/favicon.png", type: "image/png", sizes: "512x512" }] },
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
          alternateName: "Kioo Africa Angola",
          slogan: "Pessoas, ideias e mercados africanos.",
          url: siteUrl.origin,
          sameAs: [KIOO_FACEBOOK_URL],
          logo: new URL("/brand-mark.svg", siteUrl).toString(),
          description: locale === "en"
            ? "Independent African editorial and research publication covering business, markets, innovation, biographies and ideas."
            : "Publicação editorial e de pesquisa independente sobre negócios, mercados, inovação, biografias e ideias africanas.",
          disambiguatingDescription: locale === "en"
            ? "An independent African business and markets publication, not an entertainment or lifestyle directory."
            : "Uma publicação independente sobre negócios e mercados africanos, não um diretório de entretenimento ou estilo de vida.",
          publishingPrinciples: new URL("/sobre#principios", siteUrl).toString(),
          contactPoint: {
            "@type": "ContactPoint",
            contactType: locale === "en" ? "Editorial enquiries" : "Contactos editoriais",
            url: new URL("/contacto", siteUrl).toString(),
            availableLanguage: ["Portuguese", "English"],
          },
          knowsAbout: locale === "en"
            ? ["African markets", "African business", "African technology", "African biographies", "African research"]
            : ["Mercados africanos", "Negócios africanos", "Tecnologia em África", "Biografias africanas", "Investigação africana"],
          areaServed: [
            { "@type": "Continent", name: "Africa" },
            { "@type": "Country", name: "Angola" },
          ],
        }} />
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": `${siteUrl.origin}#website`,
          name: "Kioo Africa Angola",
          alternateName: "Kioo Africa",
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
