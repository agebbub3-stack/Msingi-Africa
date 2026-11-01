const indexNowKeyPattern = /^[A-Za-z0-9-]{8,128}$/;

export function GET() {
  const key = process.env.INDEXNOW_KEY?.trim();
  if (!key) {
    return new Response("IndexNow is not configured.", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
    });
  }
  if (!indexNowKeyPattern.test(key)) {
    return new Response("IndexNow key configuration is invalid.", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
    });
  }
  return new Response(key, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
