import { aivenProjectCa } from "./aiven-ca";
import { supabaseRootCa } from "./supabase-ca";

const aivenServiceHost = "pg-22feb2a7-msing.l.aivencloud.com";

export function getPostgresSslConfig(hostname: string) {
  const configuredCa = process.env.DATABASE_CA_CERT
    ?.trim()
    .replace(/^["']|["']$/g, "")
    .replace(/\\n/g, "\n");
  const isSupabaseHost = hostname.endsWith(".supabase.com") || hostname.endsWith(".supabase.co");
  const providerCa = hostname === aivenServiceHost
    ? aivenProjectCa
    : isSupabaseHost
      ? supabaseRootCa
      : undefined;
  const ca = configuredCa || providerCa;

  return {
    rejectUnauthorized: true,
    ...(ca ? { ca } : {}),
  };
}
