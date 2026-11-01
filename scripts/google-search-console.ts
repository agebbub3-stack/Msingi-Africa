import { createSign } from "node:crypto";
import { config } from "dotenv";

config({ path: ".env.local" });
config();

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringValue(record: JsonRecord | undefined, key: string) {
  const value = record?.[key];
  return typeof value === "string" ? value : null;
}

function requireServiceAccount() {
  const value = process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim();
  if (!value) {
    throw new Error("Set GOOGLE_SERVICE_ACCOUNT_JSON to a service-account JSON value.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON must contain valid JSON.");
  }
  if (!isRecord(parsed)) throw new Error("Google service-account configuration must be a JSON object.");

  const clientEmail = stringValue(parsed, "client_email");
  const privateKey = stringValue(parsed, "private_key");
  if (!clientEmail || !privateKey) {
    throw new Error("Google service-account JSON must include client_email and private_key.");
  }
  return { clientEmail, privateKey };
}

function encodeBase64Url(value: string) {
  return Buffer.from(value).toString("base64url");
}

async function getAccessToken() {
  const account = requireServiceAccount();
  const issuedAt = Math.floor(Date.now() / 1000);
  const header = encodeBase64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = encodeBase64Url(JSON.stringify({
    iss: account.clientEmail,
    scope: "https://www.googleapis.com/auth/webmasters.readonly",
    aud: "https://oauth2.googleapis.com/token",
    iat: issuedAt,
    exp: issuedAt + 3600,
  }));
  const unsignedToken = `${header}.${claims}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsignedToken);
  signer.end();
  const assertion = `${unsignedToken}.${signer.sign(account.privateKey).toString("base64url")}`;
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) {
    throw new Error(`Google OAuth token request failed with HTTP ${response.status}.`);
  }
  const payload: unknown = await response.json();
  if (!isRecord(payload) || typeof payload.access_token !== "string") {
    throw new Error("Google OAuth response did not contain an access token.");
  }
  return payload.access_token;
}

async function postGoogleJson(url: string, token: string, body: JsonRecord): Promise<unknown> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) {
    const details = (await response.text()).slice(0, 400);
    throw new Error(`Google Search Console API returned HTTP ${response.status}: ${details}`);
  }
  return response.json();
}

function assertUrlBelongsToProperty(inspectedUrl: URL, property: string) {
  if (property.startsWith("sc-domain:")) {
    const domain = property.slice("sc-domain:".length).toLowerCase();
    if (!domain || (inspectedUrl.hostname.toLowerCase() !== domain
      && !inspectedUrl.hostname.toLowerCase().endsWith(`.${domain}`))) {
      throw new Error("The URL hostname is outside GOOGLE_SEARCH_CONSOLE_SITE_URL.");
    }
    return;
  }

  const propertyUrl = new URL(property);
  if (inspectedUrl.origin !== propertyUrl.origin || !inspectedUrl.pathname.startsWith(propertyUrl.pathname)) {
    throw new Error("The URL is outside GOOGLE_SEARCH_CONSOLE_SITE_URL.");
  }
}

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

async function main() {
  const target = process.argv[2];
  const property = process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL?.trim();
  if (!target) throw new Error("Usage: npm run seo:gsc -- https://kioo-africa.vercel.app/biografias/example");
  if (!property) throw new Error("Set GOOGLE_SEARCH_CONSOLE_SITE_URL to the verified Search Console property.");

  const inspectedUrl = new URL(target);
  if (inspectedUrl.protocol !== "https:") throw new Error("The inspected URL must use HTTPS.");
  assertUrlBelongsToProperty(inspectedUrl, property);

  const token = await getAccessToken();
  const inspectionPayload = await postGoogleJson(
    "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect",
    token,
    { inspectionUrl: inspectedUrl.toString(), siteUrl: property, languageCode: "pt-PT" },
  );
  const inspectionResponse = isRecord(inspectionPayload) ? inspectionPayload : undefined;
  const inspection = isRecord(inspectionResponse?.inspectionResult)
    ? inspectionResponse.inspectionResult
    : undefined;
  const indexStatus = isRecord(inspection?.indexStatusResult)
    ? inspection.indexStatusResult
    : undefined;

  const endDate = new Date();
  endDate.setUTCDate(endDate.getUTCDate() - 3);
  const startDate = new Date(endDate);
  startDate.setUTCDate(startDate.getUTCDate() - 27);
  const analyticsPayload = await postGoogleJson(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(property)}/searchAnalytics/query`,
    token,
    {
      startDate: isoDate(startDate),
      endDate: isoDate(endDate),
      dimensions: ["query"],
      dimensionFilterGroups: [{
        filters: [{
          dimension: "page",
          operator: "equals",
          expression: inspectedUrl.toString(),
        }],
      }],
      rowLimit: 100,
    },
  );
  const analyticsResponse = isRecord(analyticsPayload) ? analyticsPayload : undefined;
  const rows = Array.isArray(analyticsResponse?.rows) ? analyticsResponse.rows : [];
  const queries = rows.flatMap((row) => {
    if (!isRecord(row)) return [];
    const query = Array.isArray(row.keys) && typeof row.keys[0] === "string" ? row.keys[0] : null;
    if (!query) return [];
    return [{
      query,
      clicks: typeof row.clicks === "number" ? row.clicks : 0,
      impressions: typeof row.impressions === "number" ? row.impressions : 0,
      ctr: typeof row.ctr === "number" ? row.ctr : 0,
      averagePosition: typeof row.position === "number" ? row.position : null,
    }];
  });

  console.log(JSON.stringify({
    url: inspectedUrl.toString(),
    property,
    inspectionLink: stringValue(inspectionResponse, "inspectionResultLink"),
    indexStatus: {
      verdict: stringValue(indexStatus, "verdict"),
      coverageState: stringValue(indexStatus, "coverageState"),
      robotsTxtState: stringValue(indexStatus, "robotsTxtState"),
      indexingState: stringValue(indexStatus, "indexingState"),
      pageFetchState: stringValue(indexStatus, "pageFetchState"),
      googleCanonical: stringValue(indexStatus, "googleCanonical"),
      userCanonical: stringValue(indexStatus, "userCanonical"),
      lastCrawlTime: stringValue(indexStatus, "lastCrawlTime"),
    },
    searchAnalytics: {
      startDate: isoDate(startDate),
      endDate: isoDate(endDate),
      queries,
    },
  }, null, 2));
}

main().catch((error: unknown) => {
  console.error("Google Search Console inspection failed.", error);
  process.exitCode = 1;
});
