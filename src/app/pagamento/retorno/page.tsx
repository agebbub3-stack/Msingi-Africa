import { Suspense } from "react";
import { PaymentResult } from "@/components/payment-result";

export default function PaymentReturnPage() {
  return (
    <Suspense fallback={<PaymentResultFallback />}>
      <PaymentResult />
    </Suspense>
  );
}

function PaymentResultFallback() {
  return (
    <section className="payment-state">
      <span className="section-kicker">BA / PAGAMENTO</span>
      <h1>A confirmar<br /><em>a transação.</em></h1>
      <p>Estamos a validar o pagamento diretamente com a Flutterwave.</p>
    </section>
  );
}
