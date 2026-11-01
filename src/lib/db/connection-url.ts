const supabaseDirectHost = /^db\.([a-z0-9]+)\.supabase\.co$/i;
const supabasePoolerHost = "aws-0-us-east-1.pooler.supabase.com";

export function getPostgresConnectionUrl(connectionString: string) {
  const databaseUrl = new URL(connectionString);
  const directHostMatch = databaseUrl.hostname.match(supabaseDirectHost);

  if (directHostMatch) {
    databaseUrl.hostname = supabasePoolerHost;
    databaseUrl.port = "5432";
    databaseUrl.username = `postgres.${directHostMatch[1]}`;
  }

  for (const parameter of ["sslmode", "sslrootcert", "sslcert", "sslkey"]) {
    databaseUrl.searchParams.delete(parameter);
  }

  return databaseUrl;
}
