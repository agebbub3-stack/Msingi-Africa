import { getPublishedArticles } from "@/lib/public-content";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const siteUrl = getSiteUrl();
  const articles = await getPublishedArticles();
  const items = articles.flatMap((article) => {
    const url = new URL(article.canonicalUrl?.trim() || `/artigos/${article.slug}`, siteUrl);
    if (url.origin !== siteUrl.origin) return [];

    const publicationDate = article.publishedAt ? new Date(article.publishedAt) : null;
    return [`<item>
      <title>${escapeXml(article.seoTitle || article.title)}</title>
      <link>${escapeXml(url.toString())}</link>
      <guid isPermaLink="true">${escapeXml(url.toString())}</guid>
      <description>${escapeXml(article.standfirst)}</description>
      <category>${escapeXml(article.category)}</category>
      <dc:creator>${escapeXml(article.author)}</dc:creator>
      ${publicationDate && !Number.isNaN(publicationDate.getTime()) ? `<pubDate>${publicationDate.toUTCString()}</pubDate>` : ""}
    </item>`];
  });

  const feedUrl = new URL("/feed.xml", siteUrl).toString();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Kioo Africa | Jornalismo e análise de mercados africanos</title>
    <link>${escapeXml(siteUrl.origin)}</link>
    <description>Jornalismo e pesquisa independente sobre negócios, mercados, inovação e pessoas em África.</description>
    <language>pt-AO</language>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items.join("\n")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=3600",
    },
  });
}
