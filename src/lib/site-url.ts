import "server-only";

const retiredVercelHost = "msingi-africa-six.vercel.app";
const currentVercelHost = "kioo-africa.vercel.app";

export function getSiteUrl(): URL {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  const configuredHost = configuredUrl ? new URL(configuredUrl).hostname : null;

  if (configuredHost === retiredVercelHost) {
    const productionUrl = productionHost
      ? new URL(productionHost.includes("://") ? productionHost : `https://${productionHost}`)
      : null;
    if (productionUrl && productionUrl.hostname !== retiredVercelHost) return productionUrl;
    return new URL(`https://${currentVercelHost}`);
  }

  if (configuredUrl) return new URL(configuredUrl);
  if (productionHost) {
    return new URL(productionHost.includes("://") ? productionHost : `https://${productionHost}`);
  }
  return new URL(`https://${currentVercelHost}`);
}
