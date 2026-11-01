import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

/* eslint-disable @next/next/no-img-element -- ImageResponse renders the validated remote cover as an OG background. */
export const runtime = "edge";

const previewKinds = new Set([
  "home",
  "articles",
  "biographies",
  "about",
  "plans",
  "search",
  "contact",
  "authors",
  "entities",
  "profile",
  "product",
  "article",
  "publish",
]);

const accentByKind: Record<string, string> = {
  home: "#e5ad71",
  articles: "#d78d62",
  biographies: "#93b79a",
  about: "#dfbb78",
  plans: "#c5a1d9",
  search: "#90b4c1",
  contact: "#d99b86",
  authors: "#b9ad79",
  entities: "#8bb9a5",
  profile: "#a7bd9a",
  product: "#a8a4d6",
  article: "#d7a671",
  publish: "#c5a1d9",
};

function getText(searchParams: URLSearchParams, key: string, fallback: string, maxLength: number) {
  return (searchParams.get(key)?.trim() || fallback).slice(0, maxLength);
}

function getAllowedCoverImage(searchParams: URLSearchParams) {
  const value = searchParams.get("image");
  if (!value || value.length > 2048) return null;
  try {
    const image = new URL(value);
    return image.protocol === "https:" &&
      image.hostname === "images.unsplash.com" &&
      !image.username &&
      !image.password
      ? image.toString()
      : null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const requestedKind = searchParams.get("kind") ?? "home";
  const kind = previewKinds.has(requestedKind) ? requestedKind : "home";
  const isEnglish = searchParams.get("locale") === "en";
  const title = getText(
    searchParams,
    "title",
    isEnglish ? "African markets, in context." : "Mercados africanos, em contexto.",
    120,
  );
  const description = getText(
    searchParams,
    "description",
    isEnglish
      ? "Independent journalism and original research from across Africa."
      : "Jornalismo independente e pesquisa original a partir de África.",
    220,
  );
  const eyebrow = getText(searchParams, "eyebrow", "KIOO AFRICA", 64);
  const accent = accentByKind[kind];
  const coverImage = kind === "article" ? getAllowedCoverImage(searchParams) : null;
  const headers = { "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800" };

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 76px",
          color: "#f5f2e9",
          background: "linear-gradient(125deg, #142720 0%, #1b342a 58%, #263c30 100%)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {coverImage && (
          <img
            src={coverImage}
            alt=""
            width={1200}
            height={630}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.28,
            }}
          />
        )}
        {coverImage && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(90deg, rgba(20,39,32,.98) 0%, rgba(20,39,32,.88) 58%, rgba(20,39,32,.42) 100%)",
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            right: -120,
            top: -180,
            width: 580,
            height: 580,
            border: `1px solid ${accent}55`,
            borderRadius: "50%",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -45,
            top: -105,
            width: 430,
            height: 430,
            border: `1px solid ${accent}33`,
            borderRadius: "50%",
            display: "flex",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 16, zIndex: 1 }}>
          <div
            style={{
              width: 52,
              height: 52,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 16,
              background: "#2b4738",
              color: accent,
              fontSize: 29,
              fontWeight: 700,
            }}
          >
            K
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: 4 }}>KIOO AFRICA</span>
            <span style={{ color: "#b7c3b8", fontSize: 12, letterSpacing: 2 }}>
              {isEnglish ? "INDEPENDENT JOURNALISM · ORIGINAL RESEARCH" : "JORNALISMO INDEPENDENTE · PESQUISA ORIGINAL"}
            </span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 970, zIndex: 1 }}>
          <span style={{ color: accent, fontSize: 17, fontWeight: 700, letterSpacing: 4 }}>{eyebrow.toUpperCase()}</span>
          <span
            style={{
              maxHeight: 230,
              overflow: "hidden",
              fontFamily: "Georgia, serif",
              fontSize: title.length > 72 ? 48 : title.length > 44 ? 58 : 70,
              lineHeight: 1.08,
              letterSpacing: -2,
            }}
          >
            {title}
          </span>
          <span style={{ maxWidth: 840, color: "#c3cec4", fontSize: 23, lineHeight: 1.45 }}>
            {description}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 1 }}>
          <span style={{ color: "#d9e0d7", fontSize: 15, letterSpacing: 2 }}>
            {isEnglish ? "PEOPLE · IDEAS · MARKETS" : "PESSOAS · IDEIAS · MERCADOS"}
          </span>
          <span style={{ color: accent, fontSize: 16, fontWeight: 700 }}>KIOO.AFRICA ↗</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630, headers },
  );
}
