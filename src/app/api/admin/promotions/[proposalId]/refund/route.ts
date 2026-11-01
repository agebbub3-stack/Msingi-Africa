import { and, eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getStaffSession } from "@/lib/staff";
import { sponsoredProposals } from "@/lib/db/schema";

export const runtime = "nodejs";
type Props = { params: Promise<{ proposalId: string }> };

export async function POST(_request: NextRequest, { params }: Props) {
  const { session, role } = await getStaffSession();
  if (!session) return NextResponse.json({ error: "Inicie sessão para aceder à redação." }, { status: 401 });
  if (role !== "admin") return NextResponse.json({ error: "Só um administrador pode autorizar reembolsos." }, { status: 403 });

  const { proposalId } = await params;
  if (!z.uuid().safeParse(proposalId).success) return NextResponse.json({ error: "Proposta inválida." }, { status: 400 });
  const secret = process.env.FLW_SECRET_KEY;
  if (!secret) return NextResponse.json({ error: "O serviço de pagamentos não está configurado." }, { status: 503 });

  const { db } = await import("@/lib/db");
  const [proposal] = await db.update(sponsoredProposals).set({
    status: "refunding",
    updatedAt: new Date(),
  }).where(and(
    eq(sponsoredProposals.id, proposalId),
    eq(sponsoredProposals.status, "rejected"),
  )).returning();
  if (!proposal) return NextResponse.json({ error: "Só propostas rejeitadas podem ser reembolsadas." }, { status: 409 });
  if (!proposal.providerTransactionId || !/^\d{1,30}$/.test(proposal.providerTransactionId)) {
    return NextResponse.json({ error: "A referência da transação não é válida. Contacte a redação." }, { status: 409 });
  }

  let response: Response;
  try {
    response = await fetch(`https://api.flutterwave.com/v3/transactions/${encodeURIComponent(proposal.providerTransactionId)}/refund`, {
      method: "POST",
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
      headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
      body: JSON.stringify({ amount: proposal.amountCents / 100 }),
    });
  } catch (error) {
    console.error("Flutterwave sponsored proposal refund request failed.", error);
    return NextResponse.json({ error: "A confirmação do reembolso não chegou. Verifique a transação no painel Flutterwave antes de qualquer nova tentativa." }, { status: 502 });
  }

  const payload: unknown = await response.json().catch((error: unknown) => {
    console.error("Flutterwave returned unreadable refund JSON.", error);
    return null;
  });
  if (!response.ok || !payload || typeof payload !== "object" || !("status" in payload) || payload.status !== "success") {
    console.error("Flutterwave rejected the sponsored proposal refund.", { status: response.status });
    await db.update(sponsoredProposals).set({ status: "rejected", updatedAt: new Date() })
      .where(and(eq(sponsoredProposals.id, proposal.id), eq(sponsoredProposals.status, "refunding")));
    return NextResponse.json({ error: "A Flutterwave não conseguiu confirmar o reembolso." }, { status: 502 });
  }

  const providerRefundId = "data" in payload && payload.data && typeof payload.data === "object" && "id" in payload.data
    ? String(payload.data.id)
    : null;
  const [refunded] = await db.update(sponsoredProposals).set({
    status: "refunded",
    refundedAt: new Date(),
    providerRefundId,
    updatedAt: new Date(),
  }).where(and(eq(sponsoredProposals.id, proposal.id), eq(sponsoredProposals.status, "refunding")))
    .returning({ id: sponsoredProposals.id });
  if (!refunded) return NextResponse.json({ error: "O estado da proposta mudou. Verifique o painel Flutterwave." }, { status: 409 });
  return NextResponse.json({ status: "refunded", providerRefundId });
}
