import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl().origin;
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/api/social-preview"],
        disallow: ["/api/", "/painel", "/redacao", "/entrar", "/registar", "/pagamento/"],
      },
    ],
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
  };
}
