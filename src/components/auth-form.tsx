"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setNotice("");
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const name = String(formData.get("name") ?? "").trim();

    try {
      if (mode === "sign-up") {
        const result = await authClient.signUp.email({ name, email, password, callbackURL: "/painel" });
        if (result.error) {
          setNotice(result.error.message ?? "Não foi possível criar a conta.");
          return;
        }
        setNotice("Conta criada. Confirme o endereço de e-mail através da mensagem enviada para si.");
      } else {
        const result = await authClient.signIn.email({ email, password, callbackURL: "/painel" });
        if (result.error) {
          setNotice(result.error.message ?? "Não foi possível iniciar sessão.");
          return;
        }
        router.push("/painel");
        router.refresh();
      }
    } catch (error) {
      console.error("Authentication request failed.", error);
      setNotice("Não foi possível contactar o serviço de contas. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="account-form" onSubmit={submit}>
      {mode === "sign-up" && (
        <label className="field-label" htmlFor="account-name">
          Nome completo
          <input className="form-input" id="account-name" name="name" autoComplete="name" minLength={2} maxLength={120} required />
        </label>
      )}
      <label className="field-label" htmlFor="account-email">
        E-mail
        <input className="form-input" id="account-email" name="email" type="email" autoComplete="email" maxLength={254} required />
      </label>
      <label className="field-label" htmlFor="account-password">
        Palavra-passe
        <input className="form-input" id="account-password" name="password" type="password" autoComplete={mode === "sign-up" ? "new-password" : "current-password"} minLength={mode === "sign-up" ? 8 : 1} maxLength={128} required />
      </label>
      <button className="button button-dark" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "A processar…" : mode === "sign-up" ? "Criar conta" : "Entrar"}
      </button>
      <p className="form-notice" role="status" aria-live="polite">{notice}</p>
      {mode === "sign-up" && <p className="form-privacy">Ao criar uma conta, concorda com a nossa política editorial e com a revisão humana antes de qualquer publicação.</p>}
    </form>
  );
}
