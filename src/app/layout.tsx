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
    default: "Msingi Africa — Um continente, muitas histórias",
    template: "%s — Msingi Africa",
  },
  description:
    "Jornalismo independente, perfis e pesquisa original para entender os mercados, as ideias e as pessoas a transformar África.",
  icons: { icon: [{ url: "/brand-mark.svg", type: "image/svg+xml" }] },
  openGraph: {
    title: "Msingi Africa — Um continente, muitas histórias",
    description:
      "Ideias claras para entender o que está a mudar nos mercados africanos.",
    siteName: "Msingi Africa",
    locale: "pt_PT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Msingi Africa — Um continente, muitas histórias",
    description: "Ideias claras para entender o que está a mudar nos mercados africanos.",
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
