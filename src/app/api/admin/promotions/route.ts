import { and, desc, eq, inArray } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getPromotionPackage } from "@/lib/paid-promotions";
import { getStaffSession } from "@/lib/staff";
import { sponsoredProposals, user } from "@/lib/db/schema";

export const runtime = "nodejs";
const decisionSchema = z.object({
  proposalId: z.uuid(),
  action: z.enum(["accept", "reject"]),
  note: z.string().trim().max(1000).optional(),
});

export async function GET() {
  const { session, role } = await getStaffSession();
  if (!session) return NextResponse.json({ error: "Inicie sessão para aceder à redação." }, { status: 401 });
  if (!role) return NextResponse.json({ error: "A sua conta não tem permissões editoriais." }, { status: 403 });

  const { db } = await import("@/lib/db");
  const rows = await db.select({
    id: sponsoredProposals.id,
    packageId: sponsoredProposals.packageId,
    amountCents: sponsoredProposals.amountCents,
    contactName: sponsoredProposals.contactName,
    contactEmail: sponsoredProposals.contactEmail,
    title: sponsoredProposals.title,
    idea: sponsoredProposals.idea,
    status: sponsoredProposals.status,
    providerTransactionId: sponsoredProposals.providerTransactionId,
    createdAt: sponsoredProposals.createdAt,
    reviewNote: sponsoredProposals.reviewNote,
    reviewer: user.name,
  }).from(sponsoredProposals)
    .leftJoin(user, eq(sponsoredProposals.reviewedBy, user.id))
    .where(inArray(sponsoredProposals.status, ["pending_review", "rejected", "refunding", "refunded", "accepted"]))
    .orderBy(desc(sponsoredProposals.createdAt))
    .limit(50);

  return NextResponse.json({
    proposals: rows.map((proposal) => ({
      ...proposal,
      packageName: getPromotionPackage(proposal.packageId)?.name ?? "Pacote",
    })),
  });
}

export async function PATCH(request: NextRequest) {
  const { session, role } = await getStaffSession();
  if (!session) return NextResponse.json({ error: "Inicie sessão para aceder à redação." }, { status: 401 });
  if (!role) return NextResponse.json({ error: "A sua conta não tem permissões editoriais." }, { status: 403 });

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "A decisão de parceria não é válida." }, { status: 400 });
  }
  const parsed = decisionSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: "Escolha aceitar ou rejeitar a proposta." }, { status: 400 });

  const { db } = await import("@/lib/db");
  const [proposal] = await db.update(sponsoredProposals).set({
    status: parsed.data.action === "accept" ? "accepted" : "rejected",
    reviewedBy: session.user.id,
    reviewedAt: new Date(),
    reviewNote: parsed.data.note,
    updatedAt: new Date(),
  }).where(and(
    eq(sponsoredProposals.id, parsed.data.proposalId),
    eq(sponsoredProposals.status, "pending_review"),
  )).returning({ id: sponsoredProposals.id, status: sponsoredProposals.status });

  if (!proposal) return NextResponse.json({ error: "Esta proposta já foi revista ou não existe." }, { status: 404 });
  return NextResponse.json({ proposal });
}
