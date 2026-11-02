import { createHash, randomBytes } from "node:crypto";
import { createServer } from "node:http";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { config } from "dotenv";

config({ path: ".env.local" });
config();

type JsonRecord = Record<string, unknown>;

const searchConsoleScope = "https://www.googleapis.com/auth/webmasters.readonly";
const defaultSiteUrl = "https://kioo-africa.vercel.app/";

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringValue(record: JsonRecord | undefined, key: string) {
  const value = record?.[key];
  return typeof value === "string" ? value : null;
}

type OAuthClient = {
  clientId: string;
  clientSecret: string;
  authUri: string;
  tokenUri: string;
};

async function findOAuthClientFile() {
  const configuredFile = process.env.GOOGLE_OAUTH_CLIENT_FILE?.trim();
  if (configuredFile) return resolve(configuredFile);

  const matches = (await readdir(process.cwd()))
    .filter((name) => name.startsWith("client_secret_") && name.endsWith(".json"));
  if (matches.length === 1) return resolve(matches[0]);
  if (matches.length > 1) {
    throw new Error("More than one OAuth client JSON was found. Set GOOGLE_OAUTH_CLIENT_FILE to the Desktop client file.");
  }
  throw new Error("Download the OAuth Desktop client JSON to the project root, or set GOOGLE_OAUTH_CLIENT_FILE.");
}

async function requireOAuthClient() {
  const file = await findOAuthClientFile();
  let parsed: unknown;
  try {
    parsed = JSON.parse(await readFile(file, "utf8"));
  } catch {
    throw new Error("The OAuth client file must contain valid JSON.");
  }
  if (!isRecord(parsed)) throw new Error("The OAuth client file must contain a JSON object.");

  const installed = isRecord(parsed.installed) ? parsed.installed : null;
  if (!installed) {
    throw new Error("Create an OAuth client with application type Desktop app and use its downloaded JSON file.");
  }

  const clientId = stringValue(installed, "client_id");
  const clientSecret = stringValue(installed, "client_secret");
  if (!clientId || !clientSecret) {
    throw new Error("OAuth Desktop client JSON must include client_id and client_secret.");
  }
  return {
    file,
    clientId,
    clientSecret,
    authUri: stringValue(installed, "auth_uri") ?? "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUri: stringValue(installed, "token_uri") ?? "https://oauth2.googleapis.com/token",
  } satisfies OAuthClient & { file: string };
}

async function exchangeToken(tokenUri: string, values: Record<string, string>) {
  const response = await fetch(tokenUri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(values),
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) {
    throw new Error(`Google OAuth token request failed with HTTP ${response.status}.`);
  }
  const payload: unknown = await response.json();
  if (!isRecord(payload)) throw new Error("Google OAuth returned an invalid token response.");
  return payload;
}

async function saveLocalEnvironment(values: Record<string, string>) {
  const envFile = resolve(".env.local");
  let contents = "";
  try {
    contents = await readFile(envFile, "utf8");
  } catch (error) {
    if (!isRecord(error) || error.code !== "ENOENT") throw error;
  }

  for (const [key, value] of Object.entries(values)) {
    const encodedValue = JSON.stringify(value);
    const line = `${key}=${encodedValue}`;
    const pattern = new RegExp(`^${key}=.*$`, "m");
    contents = pattern.test(contents)
      ? contents.replace(pattern, line)
      : `${contents}${contents.endsWith("\n") || contents.length === 0 ? "" : "\n"}${line}\n`;
  }
  await writeFile(envFile, contents, "utf8");
}

async function authorizeLocalUser() {
  const client = await requireOAuthClient();
  const state = randomBytes(32).toString("hex");
  const verifier = randomBytes(32).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  let authorizationError: Error | undefined;
  let callbackTimeout: NodeJS.Timeout | undefined;

  const server = createServer();
  const callback = new Promise<string>((resolveCallback, rejectCallback) => {
    callbackTimeout = setTimeout(() => {
      rejectCallback(new Error("OAuth authorization timed out. Run the command again and complete Google sign-in."));
    }, 5 * 60 * 1000);
    server.on("request", (request, response) => {
      const requestUrl = new URL(request.url ?? "/", "http://127.0.0.1");
      const code = requestUrl.searchParams.get("code");
      const returnedState = requestUrl.searchParams.get("state");
      const error = requestUrl.searchParams.get("error");

      if (requestUrl.pathname !== "/oauth2callback") {
        response.writeHead(404).end("Not found");
        return;
      }
      if (error || returnedState !== state || !code) {
        authorizationError = new Error(error
          ? `Google authorization was denied (${error}).`
          : "Google OAuth callback was invalid. Run the authorization command again.");
        response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" })
          .end("Authorization failed. Return to the terminal for details.");
        rejectCallback(authorizationError);
        return;
      }

      const address = server.address();
      if (!address || typeof address === "string") {
        response.writeHead(500).end("Could not read the local callback address.");
        rejectCallback(new Error("Could not determine the OAuth callback address."));
        return;
      }
      response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" })
        .end("Google authorization complete. You can return to the terminal.");
      resolveCallback(code);
    });
  });

  try {
    await new Promise<void>((resolveListen, rejectListen) => {
      server.once("error", rejectListen);
      server.listen(0, "127.0.0.1", resolveListen);
    });

    const address = server.address();
    if (!address || typeof address === "string") throw new Error("Could not start the local OAuth callback server.");
    const redirectUri = `http://127.0.0.1:${address.port}/oauth2callback`;
    const authorizationUrl = new URL(client.authUri);
    authorizationUrl.search = new URLSearchParams({
      client_id: client.clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: searchConsoleScope,
      access_type: "offline",
      prompt: "consent",
      state,
      code_challenge: challenge,
      code_challenge_method: "S256",
    }).toString();

    console.info("Open this URL in your browser and authorize with the Google account that owns the Search Console property:");
    console.info(authorizationUrl.toString());
    const code = await callback;
    const token = await exchangeToken(client.tokenUri, {
      client_id: client.clientId,
      client_secret: client.clientSecret,
      code,
      code_verifier: verifier,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    });
    const refreshToken = stringValue(token, "refresh_token");
    if (!refreshToken) {
      throw new Error("Google did not return a refresh token. Revoke the app's access in your Google Account and run --auth again.");
    }

    await saveLocalEnvironment({
      GOOGLE_OAUTH_CLIENT_FILE: client.file,
      GOOGLE_OAUTH_REFRESH_TOKEN: refreshToken,
      GOOGLE_SEARCH_CONSOLE_SITE_URL: process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL?.trim() || defaultSiteUrl,
    });
    console.info("OAuth authorization saved in .env.local. Keep that file private.");
  } catch (error) {
    throw authorizationError ?? error;
  } finally {
    if (callbackTimeout) clearTimeout(callbackTimeout);
    if (server.listening) server.close();
  }
}

async function getAccessToken() {
  const refreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN?.trim();
  if (!refreshToken) {
    throw new Error("First create a Desktop OAuth client, then run: npm run seo:gsc -- --auth");
  }
  const client = await requireOAuthClient();
  const token = await exchangeToken(client.tokenUri, {
    client_id: client.clientId,
    client_secret: client.clientSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });
  const accessToken = stringValue(token, "access_token");
  if (!accessToken) throw new Error("Google OAuth response did not contain an access token.");
  return accessToken;
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
  const args = process.argv.slice(2);
  if (args[0] === "--auth") {
  await authorizeLocalUser();
  return;
  }
  const sitePerformance = args[0] === "--site-performance";
  const targets = sitePerformance ? [] : args;
  if (targets.length === 0 && !sitePerformance) {
  throw new Error("Usage: npm run seo:gsc -- --auth | --site-performance | https://kioo-africa.vercel.app/artigos/example");
  }
  const property = process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL?.trim() || defaultSiteUrl;
  const inspectedUrls = targets.map((target) => {
  const url = new URL(target);
  if (url.protocol !== "https:") throw new Error("Inspected URLs must use HTTPS.");
  assertUrlBelongsToProperty(url, property);
  return url;
  });

  const token = await getAccessToken();
  const endDate = new Date();
  endDate.setUTCDate(endDate.getUTCDate() - 3);
  const startDate = new Date(endDate);
  startDate.setUTCDate(startDate.getUTCDate() - 27);

  const sitePath = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(property)}/searchAnalytics/query`;
  const results = [];
  for (const inspectedUrl of inspectedUrls) {
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
  const analyticsPayload = await postGoogleJson(
    sitePath,
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
  results.push({
    url: inspectedUrl.toString(),
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
      queries: extractQueries(analyticsPayload),
    },
  });
  }

  if (sitePerformance) {
  const analyticsPayload = await postGoogleJson(
    sitePath,
    token,
    {
      startDate: isoDate(startDate),
      endDate: isoDate(endDate),
      dimensions: ["query"],
      rowLimit: 100,
    },
  );
  results.push({
    property,
    searchAnalytics: {
      startDate: isoDate(startDate),
      endDate: isoDate(endDate),
      queries: extractQueries(analyticsPayload),
    },
  });
  }

  console.log(JSON.stringify(results.length === 1 ? results[0] : { property, results }, null, 2));
}

function extractQueries(payload: unknown) {
  const analyticsResponse = isRecord(payload) ? payload : undefined;
  const rows = Array.isArray(analyticsResponse?.rows) ? analyticsResponse.rows : [];
  return rows.flatMap((row) => {
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
}

main().catch((error: unknown) => {
  console.error("Google Search Console operation failed.", error);
  process.exitCode = 1;
});
