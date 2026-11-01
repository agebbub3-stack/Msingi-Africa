import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://msingi.africa";
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/painel", "/redacao", "/entrar", "/registar", "/pagamento/"] },
    ],
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
  };
}
