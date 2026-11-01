"use client";

import { useState, type FormEvent } from "react";

export function NewsletterUnsubscribe() {
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setNotice("");
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.get("email") }),
      });
      const result = await response.json() as { error?: string; message?: string };
      setNotice(result.message ?? result.error ?? "Não foi possível solicitar o cancelamento.");
    } catch (error) {
      console.error("Could not request newsletter cancellation.", error);
      setNotice("Não foi possível solicitar o cancelamento. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="workspace-form" onSubmit={submit}>
      <label className="field-label">E-mail inscrito<input className="form-input" name="email" type="email" maxLength={254} required /></label>
      <button className="button button-dark" type="submit" disabled={busy}>{busy ? "A enviar…" : "Enviar ligação de cancelamento"}</button>
      <p className="form-notice" role="status" aria-live="polite">{notice}</p>
    </form>
  );
}
