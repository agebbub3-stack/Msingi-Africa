import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { getSiteUrl } from "@/lib/site-url";

export type SocialPreviewKind = "home" | "articles" | "biographies" | "about" | "plans" | "search" | "contact" | "authors" | "entities" | "profile" | "product" | "article" | "publish";

type SocialPreviewInput = {
  locale: Locale;
  kind: SocialPreviewKind;
  title: string;
  description: string;
  eyebrow: string;
  image?: string;
};

export function createSocialPreviewUrl({ locale, kind, title, description, eyebrow, image }: SocialPreviewInput) {
  const siteUrl = getSiteUrl();
  const imageUrl = new URL("/api/social-preview", siteUrl);
  imageUrl.searchParams.set("kind", kind);
  imageUrl.searchParams.set("locale", locale);
  imageUrl.searchParams.set("eyebrow", eyebrow);
  imageUrl.searchParams.set("title", title);
  imageUrl.searchParams.set("description", description);
  if (image) imageUrl.searchParams.set("image", image);
  return imageUrl.toString();
}

export function createPageMetadata({
  locale,
  kind,
  title,
  description,
  path,
  eyebrow,
}: SocialPreviewInput & { path: string }): Metadata {
  const siteUrl = getSiteUrl();
  const canonicalUrl = new URL(path, siteUrl).toString();
  const imageUrl = createSocialPreviewUrl({ locale, kind, title, description, eyebrow });

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonicalUrl,
      siteName: "Kioo Africa",
      locale: locale === "en" ? "en_GB" : "pt_AO",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: imageUrl, alt: title }],
    },
  };
}
