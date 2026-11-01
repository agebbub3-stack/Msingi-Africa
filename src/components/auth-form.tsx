"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import type { Locale } from "@/lib/i18n";

export function AuthForm({ mode, locale = "en" }: { mode: "sign-in" | "sign-up"; locale?: Locale }) {
  const en = locale === "en";
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
          setNotice(result.error.message ?? (en ? "Could not create your account." : "Não foi possível criar a conta."));
          return;
        }
        setNotice(en
          ? "Account created. Verify your email using the message we sent you."
          : "Conta criada. Confirme o endereço de e-mail através da mensagem enviada para si.");
      } else {
        const result = await authClient.signIn.email({ email, password, callbackURL: "/painel" });
        if (result.error) {
          setNotice(result.error.message ?? (en ? "Could not sign in." : "Não foi possível iniciar sessão."));
          return;
        }
        router.push("/painel");
        router.refresh();
      }
    } catch (error) {
      console.error("Authentication request failed.", error);
      setNotice(en ? "Could not reach the account service. Please try again." : "Não foi possível contactar o serviço de contas. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="account-form" onSubmit={submit}>
      {mode === "sign-up" && (
        <label className="field-label" htmlFor="account-name">
          {en ? "Full name" : "Nome completo"}
          <input className="form-input" id="account-name" name="name" autoComplete="name" minLength={2} maxLength={120} required />
        </label>
      )}
      <label className="field-label" htmlFor="account-email">
        {en ? "Email" : "E-mail"}
        <input className="form-input" id="account-email" name="email" type="email" autoComplete="email" maxLength={254} required />
      </label>
      <label className="field-label" htmlFor="account-password">
        {en ? "Password" : "Palavra-passe"}
        <input className="form-input" id="account-password" name="password" type="password" autoComplete={mode === "sign-up" ? "new-password" : "current-password"} minLength={mode === "sign-up" ? 8 : 1} maxLength={128} required />
      </label>
      <button className="button button-dark" type="submit" disabled={isSubmitting}>
        {isSubmitting ? (en ? "Please wait…" : "A processar…") : mode === "sign-up" ? (en ? "Create account" : "Criar conta") : (en ? "Sign in" : "Entrar")}
      </button>
      <p className="form-notice" role="status" aria-live="polite">{notice}</p>
      {mode === "sign-up" && <p className="form-privacy">{en
        ? "By creating an account, you agree to our editorial policy and human review before publication."
        : "Ao criar uma conta, concorda com a nossa política editorial e com a revisão humana antes de qualquer publicação."}</p>}
    </form>
  );
}
