"use client";

import { ArrowLeft, ArrowUpRight, CheckCircle2, CircleAlert, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type PaymentState =
  | { status: "loading" }
  | { status: "successful"; packageName: string; amount: number; currency: string; transactionId: string; subscription: boolean }
  | { status: "pending"; message: string }
  | { status: "error"; message: string };

const emailAddress = process.env.NEXT_PUBLIC_EDITORIAL_EMAIL || "editorial@msingi.africa";

export function PaymentResult() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transaction_id") ?? "";
  const txRef = searchParams.get("tx_ref") ?? "";
  const hasPaymentReference = Boolean(transactionId && txRef);
  const [payment, setPayment] = useState<PaymentState>(hasPaymentReference
    ? { status: "loading" }
    : { status: "error", message: "Não encontrámos uma referência de pagamento válida. Se a cobrança aparecer na sua conta, fale com a redação." });

  useEffect(() => {
    let active = true;
    if (!transactionId || !txRef) return () => { active = false; };

    const parameters = new URLSearchParams({ transaction_id: transactionId, tx_ref: txRef });
    fetch(`/api/payments/verify?${parameters.toString()}`, { cache: "no-store" })
      .then(async (response) => {
        const result: unknown = await response.json();
        if (!active) return;
        if (
          response.ok &&
          result &&
          typeof result === "object" &&
          "status" in result &&
          result.status === "successful" &&
          (("packageName" in result && typeof result.packageName === "string") ||
            ("planName" in result && typeof result.planName === "string")) &&
          "amount" in result &&
          typeof result.amount === "number" &&
          "currency" in result &&
          typeof result.currency === "string" &&
          "transactionId" in result &&
          typeof result.transactionId === "string"
        ) {
          const isSubscription = "subscription" in result && result.subscription === true;
          const packageName = "packageName" in result && typeof result.packageName === "string"
            ? result.packageName
            : "planName" in result && typeof result.planName === "string"
              ? result.planName
              : "Pagamento confirmado";
          setPayment({
            status: "successful",
            packageName,
            amount: result.amount,
            currency: result.currency,
            transactionId: result.transactionId,
            subscription: isSubscription,
          });
          return;
        }

        const errorMessage = result && typeof result === "object" && "error" in result && typeof result.error === "string"
          ? result.error
          : result && typeof result === "object" && "message" in result && typeof result.message === "string"
            ? result.message
            : "Não foi possível confirmar o pagamento.";
        setPayment(
          result && typeof result === "object" && "status" in result && result.status === "pending"
            ? { status: "pending", message: errorMessage }
            : { status: "error", message: errorMessage },
        );
      })
      .catch((error: unknown) => {
        console.error("Could not verify the Flutterwave transaction.", error);
        if (active) setPayment({ status: "error", message: "Não foi possível confirmar o pagamento. Atualize esta página dentro de alguns instantes." });
      });

    return () => { active = false; };
  }, [transactionId, txRef]);

  return (
    <section className="payment-state">
      {payment.status === "loading" && <><LoaderCircle className="payment-icon payment-spinner" size={27} /><span className="section-kicker">BA / PAGAMENTO</span><h1>A confirmar<br /><em>a transação.</em></h1><p>Estamos a validar o pagamento diretamente com a Flutterwave.</p></>}
      {payment.status === "successful" && <><CheckCircle2 className="payment-icon" size={29} /><span className="section-kicker">BANTABA / PAGAMENTO CONFIRMADO</span><h1>O pagamento<br /><em>foi confirmado.</em></h1><p>{payment.subscription ? `Creator Plus ativo: US$ ${payment.amount} por mês. Agora pode incluir ligações e fontes verificáveis nas suas propostas.` : `Pagamento verificado pela Flutterwave: US$${payment.amount} · ${payment.packageName}. A proposta foi registada e aguarda revisão de adequação editorial.`}</p><div className="payment-reference">REFERÊNCIA <span>{payment.transactionId}</span></div>{payment.subscription ? <Link className="button button-dark" href="/painel">Ir para a área de autor <ArrowUpRight size={15} /></Link> : <a className="button button-dark" href={`mailto:${emailAddress}?subject=${encodeURIComponent(`Proposta patrocinada Bantaba · ${payment.transactionId}`)}`}>Contactar a redação <ArrowUpRight size={15} /></a>}{!payment.subscription && <p className="payment-email-note">A proposta e o comprovativo ficaram guardados. O pagamento não garante publicação; se a redação recusar a campanha, será feito o reembolso.</p>}</>}
      {payment.status === "pending" && <><LoaderCircle className="payment-icon payment-spinner" size={27} /><span className="section-kicker">BA / PAGAMENTO PENDENTE</span><h1>A transação<br /><em>ainda está em curso.</em></h1><p>{payment.message} Pode voltar a esta página mais tarde para verificar novamente.</p><button className="button button-dark" type="button" onClick={() => window.location.reload()}>Verificar novamente <ArrowUpRight size={15} /></button></>}
      {payment.status === "error" && <><CircleAlert className="payment-icon payment-icon-error" size={29} /><span className="section-kicker">BANTABA / VERIFICAÇÃO</span><h1>Precisamos de<br /><em>confirmar consigo.</em></h1><p>{payment.message}</p><a className="button button-dark" href={`mailto:${emailAddress}?subject=${encodeURIComponent("Ajuda com pagamento Bantaba Africa")}`}>Falar com a redação <ArrowUpRight size={15} /></a></>}
      <Link href="/" className="payment-home"><ArrowLeft size={14} /> Voltar à Bantaba</Link>
    </section>
  );
}
