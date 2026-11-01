import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth-session";
import { creatorProfiles } from "@/lib/db/schema";

export const runtime = "nodejs";

const profileSchema = z.object({
  slug: z.string().trim().min(2).max(96).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  displayName: z.string().trim().min(2).max(120),
  biography: z.string().trim().max(1000).default(""),
  countryCode: z.string().trim().length(2).toUpperCase().optional(),
  websiteUrl: z.union([
    z.literal(""),
    z.url().max(2048).refine((value) => new URL(value).protocol === "https:"),
  ]).optional(),
});

export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Inicie sessão para editar o perfil." }, { status: 401 });
  if (!session.user.emailVerified) return NextResponse.json({ error: "Confirme o seu e-mail primeiro." }, { status: 403 });

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Os dados do perfil não são um JSON válido." }, { status: 400 });
  }
  const parsed = profileSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Revise os dados do perfil.", details: z.flattenError(parsed.error).fieldErrors }, { status: 400 });
  }

  const { db } = await import("@/lib/db");
  const [profile] = await db
    .insert(creatorProfiles)
    .values({
      userId: session.user.id,
      slug: parsed.data.slug,
      displayName: parsed.data.displayName,
      biography: parsed.data.biography,
      countryCode: parsed.data.countryCode,
      websiteUrl: parsed.data.websiteUrl || null,
    })
    .onConflictDoUpdate({
      target: creatorProfiles.userId,
      set: {
        slug: parsed.data.slug,
        displayName: parsed.data.displayName,
        biography: parsed.data.biography,
        countryCode: parsed.data.countryCode,
        websiteUrl: parsed.data.websiteUrl || null,
        updatedAt: new Date(),
      },
    })
    .returning();

  return NextResponse.json({ profile });
}
