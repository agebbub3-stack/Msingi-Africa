"use client";

import { useState, type FormEvent } from "react";
import type { Locale } from "@/lib/i18n";

export function ContactForm({ locale = "en" }: { locale?: Locale }) {
  const en = locale === "en";
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setNotice("");
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          subject: data.get("subject"),
          message: data.get("message"),
          website: data.get("website"),
        }),
      });
      const result = await response.json() as { error?: string; message?: string };
      setNotice(result.message ?? result.error ?? (en ? "We could not send your message." : "Não foi possível enviar a mensagem."));
      if (response.ok) form.reset();
    } catch (error) {
      console.error("Could not send contact message.", error);
      setNotice(en ? "Could not contact the newsroom. Please try again." : "Não foi possível contactar a redação. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="workspace-form contact-form" onSubmit={submit}>
      <label className="field-label">{en ? "Name" : "Nome"}<input className="form-input" name="name" autoComplete="name" minLength={2} maxLength={100} required /></label>
      <label className="field-label">{en ? "Email" : "E-mail"}<input className="form-input" name="email" type="email" autoComplete="email" maxLength={254} required /></label>
      <label className="field-label">{en ? "Subject" : "Assunto"}<input className="form-input" name="subject" minLength={3} maxLength={140} required /></label>
      <label className="field-label">{en ? "Message" : "Mensagem"}<textarea className="form-input form-textarea" name="message" minLength={20} maxLength={4000} rows={7} required /></label>
      <label className="contact-honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <button className="button button-dark" type="submit" disabled={busy}>{busy ? (en ? "Sending…" : "A enviar…") : (en ? "Send message" : "Enviar mensagem")}</button>
      <p className="form-notice" role="status" aria-live="polite">{notice}</p>
    </form>
  );
}
