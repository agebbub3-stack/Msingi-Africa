import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { JsonLd } from "@/components/json-ld";
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
  applicationName: "Msingi Africa",
  title: {
    default: "Msingi Africa — Mercados, inovação e perfis africanos",
    template: "%s — Msingi Africa",
  },
  description:
    "Jornalismo independente, artigos, biografias e pesquisa sobre mercados, tecnologia, energia limpa e pessoas a transformar África.",
  keywords: [
    "Msingi Africa",
    "Msingi Africa Angola",
    "Msingi Angola",
    "mercados africanos",
    "Africa forum",
    "Modern Africa",
    "Africa future",
    "African technology",
    "clean energy Africa",
    "inovação em África",
    "negócios em Angola",
  ],
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
  icons: { icon: [{ url: "/brand-mark.svg", type: "image/svg+xml" }] },
  openGraph: {
    title: "Msingi Africa — Mercados, inovação e perfis africanos",
    description:
      "Artigos, biografias e análise independente sobre o futuro dos mercados africanos.",
    siteName: "Msingi Africa",
    locale: "pt_PT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Msingi Africa — Mercados, inovação e perfis africanos",
    description: "Artigos, biografias e análise independente sobre o futuro dos mercados africanos.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" className={`${dmSans.variable} ${dmSerifDisplay.variable}`}>
      <body>
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Msingi Africa",
          url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://msingi.africa",
          logo: new URL("/brand-mark.svg", process.env.NEXT_PUBLIC_SITE_URL ?? "https://msingi.africa").toString(),
          description: "Grupo editorial e de pesquisa independente dedicado a pessoas, ideias e mercados africanos.",
          publishingPrinciples: new URL("/sobre#principios", process.env.NEXT_PUBLIC_SITE_URL ?? "https://msingi.africa").toString(),
          areaServed: { "@type": "Continent", name: "África" },
        }} />
        <div className="topline">
          <div className="topline-inner">
            <span>JORNALISMO INDEPENDENTE · PENSADO A PARTIR DE ÁFRICA</span>
            <span className="topline-date">UM CONTINENTE <span>—</span> MUITAS PERSPETIVAS</span>
          </div>
        </div>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
