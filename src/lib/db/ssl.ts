import { aivenProjectCa } from "./aiven-ca";

const aivenServiceHost = "pg-22feb2a7-msing.l.aivencloud.com";

export function getPostgresSslConfig(hostname: string) {
  const configuredCa = process.env.DATABASE_CA_CERT
    ?.trim()
    .replace(/^["']|["']$/g, "")
    .replace(/\\n/g, "\n");
  const isSupabaseHost = hostname.endsWith(".supabase.com") || hostname.endsWith(".supabase.co");
  const providerCa = hostname === aivenServiceHost ? aivenProjectCa : undefined;
  const ca = configuredCa || providerCa;

  return {
    // Supabase recommends SSL=require for serverless pooler connections; provide
    // a root certificate through DATABASE_CA_CERT to enable strict verification.
    rejectUnauthorized: !isSupabaseHost || Boolean(ca),
    ...(ca ? { ca } : {}),
  };
}
