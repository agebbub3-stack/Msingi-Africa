import { config } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import * as schema from "../src/lib/db/schema";
import { getPostgresSslConfig } from "../src/lib/db/ssl";

config({ path: ".env.local" });
config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required to run database migrations.");

const databaseUrl = new URL(connectionString);
for (const parameter of ["sslmode", "sslrootcert", "sslcert", "sslkey"]) {
  databaseUrl.searchParams.delete(parameter);
}

const pool = new Pool({
  connectionString: databaseUrl.toString(),
  max: 1,
  connectionTimeoutMillis: 10_000,
  ssl: getPostgresSslConfig(databaseUrl.hostname),
});

async function runMigrations() {
  try {
    await migrate(drizzle(pool, { schema }), { migrationsFolder: "./drizzle" });
    console.info("PostgreSQL migrations applied successfully.");
  } finally {
    await pool.end();
  }
}

runMigrations().catch((error: unknown) => {
  console.error("Database migration failed.", error);
  process.exitCode = 1;
});
