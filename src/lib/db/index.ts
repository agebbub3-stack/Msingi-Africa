import "server-only";
import { attachDatabasePool } from "@vercel/functions";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@/lib/db/schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required for database operations.");
}

const databaseUrl = new URL(connectionString);
for (const parameter of ["sslmode", "sslrootcert", "sslcert", "sslkey"]) {
  databaseUrl.searchParams.delete(parameter);
}

const poolOptions = {
  connectionString: databaseUrl.toString(),
  max: process.env.NODE_ENV === "production" ? 5 : 10,
  idleTimeoutMillis: 5_000,
  connectionTimeoutMillis: 10_000,
  ssl: {
    rejectUnauthorized: true,
    ...(process.env.DATABASE_CA_CERT ? { ca: process.env.DATABASE_CA_CERT.replace(/\\n/g, "\n") } : {}),
  },
};

const globalForDatabase = globalThis as typeof globalThis & { msingiPool?: Pool };
const pool = globalForDatabase.msingiPool ?? new Pool(poolOptions);

if (process.env.NODE_ENV !== "production") globalForDatabase.msingiPool = pool;

attachDatabasePool(pool);

export const db = drizzle(pool, { schema });
export { pool };
