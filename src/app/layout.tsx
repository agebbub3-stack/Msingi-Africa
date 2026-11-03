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
    ? "Kioo Africa | African Markets, Business & Biographies"
    : "Kioo Africa | Mercados, negócios e biografias africanas";
  const description = locale === "en"
    ? "Kioo Africa is an independent African editorial publication covering markets, business, technology, culture and biographies through research and journalism."
    : "A Kioo Africa é uma publicação editorial africana independente sobre mercados, negócios, tecnologia, cultura e biografias, com jornalismo e pesquisa.";
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
      ? ["Kioo Africa", "African journalism", "African markets", "business in Africa", "African innovation", "African biographies"]
      : ["Kioo Africa", "jornalismo africano", "mercados africanos", "negócios em África", "inovação africana", "biografias africanas"],
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
          "@type": "NewsMediaOrganization",
          "@id": `${siteUrl.origin}#organization`,
          name: "Kioo Africa",
          alternateName: "Kioo Africa Angola",
          slogan: "Pessoas, ideias e mercados africanos.",
          url: siteUrl.origin,
          sameAs: [KIOO_FACEBOOK_URL],
          logo: new URL("/favicon.png", siteUrl).toString(),
          description: locale === "en"
            ? "Kioo Africa is an independent digital editorial initiative covering African markets, business, technology, culture, research and biographies. Its official Facebook page is named Kioo Africa Angola."
            : "A Kioo Africa é uma iniciativa editorial digital independente sobre mercados africanos, negócios, tecnologia, cultura, pesquisa e biografias. A sua página oficial no Facebook chama-se Kioo Africa Angola.",
          disambiguatingDescription: locale === "en"
            ? "An independent African digital editorial publication covering markets and public-interest stories, distinct from similarly named glass manufacturers and other organizations."
            : "Uma publicação editorial digital africana independente sobre mercados e temas de interesse público, distinta de fabricantes de vidro e outras organizações com nomes semelhantes.",
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
          name: "Kioo Africa",
          alternateName: "Kioo Africa Angola",
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
