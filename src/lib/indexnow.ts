export type IndexNowSubmission =
  | { status: "unconfigured"; submittedCount: 0 }
  | { status: "submitted"; submittedCount: number; httpStatus: 200 | 202 };

const indexNowKeyPattern = /^[A-Za-z0-9-]{8,128}$/;

export async function submitIndexNow(paths: string[], siteUrl: URL): Promise<IndexNowSubmission> {
  const key = process.env.INDEXNOW_KEY?.trim();
  if (!key) return { status: "unconfigured", submittedCount: 0 };
  if (!indexNowKeyPattern.test(key)) {
    throw new Error("INDEXNOW_KEY must contain 8-128 letters, digits or hyphens.");
  }
  if (siteUrl.protocol !== "https:" || siteUrl.username || siteUrl.password) {
    throw new Error("IndexNow requires a public HTTPS site URL.");
  }
  if (paths.length === 0 || paths.length > 10_000) {
    throw new Error("IndexNow accepts between 1 and 10,000 URLs per submission.");
  }

  const urls = [...new Set(paths.map((path) => {
    if (!path.startsWith("/") || path.startsWith("//") || path.includes("?") || path.includes("#")) {
      throw new Error(`IndexNow only accepts canonical paths without query strings: "${path}".`);
    }
    const url = new URL(path, siteUrl);
    if (url.origin !== siteUrl.origin) {
      throw new Error(`IndexNow URL is outside the configured site: "${path}".`);
    }
    return url.toString();
  }))];

  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: siteUrl.host,
      key,
      keyLocation: new URL("/indexnow-key.txt", siteUrl).toString(),
      urlList: urls,
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (response.status !== 200 && response.status !== 202) {
    throw new Error(`IndexNow rejected the URL submission with HTTP ${response.status}.`);
  }

  return {
    status: "submitted",
    submittedCount: urls.length,
    httpStatus: response.status,
  };
}
