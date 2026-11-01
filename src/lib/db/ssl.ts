import { aivenProjectCa } from "@/lib/db/aiven-ca";

const aivenServiceHost = "pg-22feb2a7-msing.l.aivencloud.com";

export function getPostgresSslConfig(hostname: string) {
  const configuredCa = process.env.DATABASE_CA_CERT
    ?.trim()
    .replace(/^["']|["']$/g, "")
    .replace(/\\n/g, "\n");
  const ca = configuredCa || (hostname === aivenServiceHost ? aivenProjectCa : undefined);

  return {
    rejectUnauthorized: true,
    ...(ca ? { ca } : {}),
  };
}
