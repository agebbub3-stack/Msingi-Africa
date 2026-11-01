import { config } from "dotenv";
import { submitIndexNow } from "../src/lib/indexnow";

config({ path: ".env.local" });
config();

async function main() {
  const paths = process.argv.slice(2);
  if (paths.length === 0) {
    throw new Error("Usage: npm run seo:indexnow -- /articles/example /biographies/example");
  }

  const siteUrl = new URL(process.env.INDEXNOW_SITE_URL?.trim() || "https://kioo-africa.vercel.app");
  if (siteUrl.protocol !== "https:") {
    throw new Error("INDEXNOW_SITE_URL must be the public HTTPS origin of the production site.");
  }

  const result = await submitIndexNow(paths, siteUrl);
  if (result.status === "unconfigured") {
    throw new Error("Set INDEXNOW_KEY in the deployment and local environment before submitting URLs.");
  }
  console.info(`IndexNow accepted ${result.submittedCount} URL(s) with HTTP ${result.httpStatus}.`);
}

main().catch((error: unknown) => {
  console.error("IndexNow submission failed.", error);
  process.exitCode = 1;
});
