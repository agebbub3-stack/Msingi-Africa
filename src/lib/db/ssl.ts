import { aivenProjectCa } from "./aiven-ca";
import { supabaseRootCa } from "./supabase-ca";

const aivenServiceHost = "pg-22feb2a7-msing.l.aivencloud.com";

export function getPostgresSslConfig(hostname: string) {
  const configuredCa = process.env.DATABASE_CA_CERT
    ?.trim()
    .replace(/^["']|["']$/g, "")
    .replace(/\\n/g, "\n");
  const isSupabaseHost = hostname.endsWith(".supabase.com") || hostname.endsWith(".supabase.co");
  const providerCa =
    hostname === aivenServiceHost ? aivenProjectCa : isSupabaseHost ? supabaseRootCa : undefined;
  const ca = isSupabaseHost ? supabaseRootCa : configuredCa || providerCa;

  return {
    // Prefer the provider root CA so a project-specific Supabase CA cannot
    // override the certificate needed to verify the pooler connection.
    rejectUnauthorized: !isSupabaseHost || Boolean(ca),
    ...(ca ? { ca } : {}),
  };
}
