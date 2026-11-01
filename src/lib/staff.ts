import "server-only";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth-session";

export async function getStaffSession() {
  const session = await getSession();
  if (!session) return { session: null, role: null };
  const { db } = await import("@/lib/db");
  const { user } = await import("@/lib/db/schema");
  const [account] = await db.select({ role: user.role }).from(user).where(eq(user.id, session.user.id)).limit(1);
  if (!account || !["admin", "editor"].includes(account.role)) return { session, role: null };
  return { session, role: account.role };
}
