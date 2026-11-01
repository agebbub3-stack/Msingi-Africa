"use client";

import { ArrowUpRight, Mail } from "lucide-react";
import { type FormEvent, useState } from "react";

export function Newsletter() {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "").trim();
    if (!email) return;
    setIsSubmitting(true);
    setMessage("");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent: formData.get("consent") === "true" }),
      });
      const result = await response.json() as { error?: string; message?: string };
      setMessage(result.message ?? result.error ?? "Não foi possível registar a inscrição.");
      if (response.ok) form.reset();
    } catch (error) {
      console.error("Could not subscribe to the Msingi newsletter.", error);
      setMessage("Não foi possível registar a inscrição. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="newsletter-form-wrap">
      <form className="newsletter-form" onSubmit={handleSubmit}>
        <div className="newsletter-email-row">
          <label className="sr-only" htmlFor="newsletter-email">O seu endereço de e-mail</label>
          <Mail size={17} aria-hidden="true" />
          <input id="newsletter-email" name="email" type="email" placeholder="O seu melhor e-mail" required />
          <button type="submit" aria-label="Inscrever-se na newsletter" disabled={isSubmitting}>
            <span>{isSubmitting ? "A registar…" : "Quero receber"}</span><ArrowUpRight size={16} />
          </button>
        </div>
        <label className="newsletter-consent"><input type="checkbox" name="consent" value="true" required /> Aceito receber a newsletter e posso cancelar a inscrição quando quiser.</label>
      </form>
      <p className="newsletter-note" aria-live="polite">
        {message || "Uma leitura com contexto. Sem ruído, diretamente na sua caixa de entrada."}
      </p>
    </div>
  );
}
