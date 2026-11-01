"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type CreatorProfile = {
  slug: string;
  displayName: string;
  biography: string;
  countryCode: string | null;
  websiteUrl: string | null;
} | null;

type Submission = {
  id: string;
  slug: string;
  kind: string;
  status: string;
  title: string;
  standfirst: string;
  category: string;
  updatedAt: string;
  createdAt: string;
};
type SourceDraft = { title: string; publisher: string; url: string };
const emptySource: SourceDraft = { title: "", publisher: "", url: "" };

const statusNames: Record<string, string> = {
  draft: "Rascunho",
  pending_review: "Em revisão",
  approved: "Aprovado",
  scheduled: "Agendado",
  published: "Publicado",
  rejected: "Precisa de alterações",
  archived: "Arquivado",
};

export function CreatorWorkspace({
  profile,
  submissions,
  creatorPlus,
  subscriptionEndsAt,
  cancelAtPeriodEnd,
}: {
  profile: CreatorProfile;
  submissions: Submission[];
  creatorPlus: boolean;
  subscriptionEndsAt: string | null;
  cancelAtPeriodEnd: boolean;
}) {
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contentKind, setContentKind] = useState<"article" | "biography">("article");
  const [sourceDrafts, setSourceDrafts] = useState<SourceDraft[]>([{ ...emptySource }]);
  const router = useRouter();

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setNotice("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      slug: String(data.get("slug") ?? "").trim(),
      displayName: String(data.get("displayName") ?? "").trim(),
      biography: String(data.get("biography") ?? "").trim(),
      countryCode: String(data.get("countryCode") ?? "").trim().toUpperCase() || undefined,
      websiteUrl: String(data.get("websiteUrl") ?? "").trim(),
    };
    try {
      const response = await fetch("/api/creator/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) {
        setNotice(result.error ?? "Não foi possível guardar o perfil.");
        return;
      }
      setNotice("Perfil guardado.");
      router.refresh();
    } catch (error) {
      console.error("Could not save creator profile.", error);
      setNotice("Não foi possível guardar o perfil. Verifique a ligação.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function submitArticle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setNotice("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const enteredSources = sourceDrafts.filter((source) =>
      source.title.trim() || source.publisher.trim() || source.url.trim(),
    );
    if (enteredSources.some((source) => !source.title.trim() || !source.url.trim())) {
      setNotice("Preencha o título e a ligação HTTPS de cada fonte, ou remova a linha incompleta.");
      setIsSubmitting(false);
      return;
    }
    if (enteredSources.some((source) => {
      try {
        return new URL(source.url.trim()).protocol !== "https:";
      } catch {
        return true;
      }
    })) {
      setNotice("Use uma ligação HTTPS válida para cada fonte.");
      setIsSubmitting(false);
      return;
    }
    const sources = enteredSources.map((source) => ({
      title: source.title.trim(),
      publisher: source.publisher.trim() || undefined,
      url: source.url.trim(),
    }));

    try {
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: data.get("kind"),
          title: data.get("title"),
          standfirst: data.get("standfirst"),
          category: data.get("category"),
          bodyMarkdown: data.get("bodyMarkdown"),
          coverImageUrl: data.get("coverImageUrl"),
          personCountry: data.get("personCountry"),
          personField: data.get("personField"),
          personRole: data.get("personRole"),
          sources,
        }),
      });
      const result = await response.json() as { error?: string; article?: { slug: string } };
      if (!response.ok) {
        setNotice(result.error ?? "Não foi possível enviar o artigo.");
        return;
      }
      setNotice(`Artigo enviado para revisão. Referência: ${result.article?.slug ?? "submetido"}.`);
      form.reset();
      setContentKind("article");
      setSourceDrafts([{ ...emptySource }]);
      router.refresh();
    } catch (error) {
      console.error("Could not submit creator article.", error);
      setNotice("Não foi possível enviar o artigo. Verifique a ligação.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function upgrade() {
    setIsSubmitting(true);
    setNotice("");
    try {
      const response = await fetch("/api/subscriptions", { method: "POST" });
      const result = await response.json() as { error?: string; checkoutUrl?: string };
      if (!response.ok || !result.checkoutUrl) {
        setNotice(result.error ?? "Não foi possível iniciar a assinatura.");
        return;
      }
      window.location.assign(result.checkoutUrl);
    } catch (error) {
      console.error("Could not start Creator Plus checkout.", error);
      setNotice("Não foi possível iniciar o pagamento. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function cancelSubscription() {
    setIsSubmitting(true);
    setNotice("");
    try {
      const response = await fetch("/api/subscriptions/cancel", { method: "POST" });
      const result = await response.json() as { error?: string; message?: string };
      setNotice(result.message ?? result.error ?? "Não foi possível cancelar a renovação.");
      if (response.ok) router.refresh();
    } catch (error) {
      console.error("Could not cancel Creator Plus.", error);
      setNotice("Não foi possível cancelar a renovação. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="creator-workspace">
      <section className="workspace-plan">
        <div><span className="section-kicker">O SEU PLANO</span><h2>{creatorPlus ? "Creator Plus" : "Plano gratuito"}</h2><p>{creatorPlus ? `Pode incluir ligações e fontes verificáveis nas suas submissões.${subscriptionEndsAt ? ` Acesso até ${new Intl.DateTimeFormat("pt-PT", { dateStyle: "long" }).format(new Date(subscriptionEndsAt))}.` : ""}${cancelAtPeriodEnd ? " A renovação automática está cancelada." : ""}` : "Publique propostas para revisão. Ligações e fontes estão disponíveis no Creator Plus."}</p></div>
        {!creatorPlus && <button className="button button-dark" type="button" onClick={upgrade} disabled={isSubmitting}>Ativar Creator Plus · US$ 5/mês</button>}
        {creatorPlus && !cancelAtPeriodEnd && <button className="button button-secondary" type="button" onClick={cancelSubscription} disabled={isSubmitting}>Cancelar renovação</button>}
      </section>

      <section className="workspace-section">
        <div className="workspace-heading"><span className="section-kicker">IDENTIDADE DO AUTOR</span><h2>O seu perfil público</h2></div>
        <form className="workspace-form" onSubmit={saveProfile}>
          <div className="form-inline-fields">
            <label className="field-label">Nome público<input className="form-input" name="displayName" defaultValue={profile?.displayName ?? ""} minLength={2} maxLength={120} required /></label>
            <label className="field-label">Endereço do perfil<input className="form-input" name="slug" defaultValue={profile?.slug ?? ""} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" maxLength={96} placeholder="nome-apelido" required /></label>
          </div>
          <label className="field-label">Apresentação<textarea className="form-input form-textarea" name="biography" defaultValue={profile?.biography ?? ""} maxLength={1000} rows={3} /></label>
          <div className="form-inline-fields">
            <label className="field-label">País (código ISO, opcional)<input className="form-input" name="countryCode" defaultValue={profile?.countryCode ?? ""} maxLength={2} placeholder="AO" /></label>
            <label className="field-label">Website HTTPS<input className="form-input" name="websiteUrl" type="url" defaultValue={profile?.websiteUrl ?? ""} placeholder="https://exemplo.com" /></label>
          </div>
          <button className="button button-dark" type="submit" disabled={isSubmitting}>Guardar perfil</button>
        </form>
      </section>

      <section className="workspace-section">
        <div className="workspace-heading"><span className="section-kicker">SUBMISSÕES EDITORIAIS</span><h2>Proponha uma história</h2><p>Todas as submissões são revistas por uma pessoa da redação antes de serem publicadas.</p></div>
        <form className="workspace-form" onSubmit={submitArticle}>
          <div className="form-inline-fields">
            <label className="field-label">Tipo<select className="form-input" name="kind" value={contentKind} onChange={(event) => setContentKind(event.target.value as "article" | "biography")}><option value="article">Artigo</option><option value="biography">Biografia</option></select></label>
            <label className="field-label">Tema<input className="form-input" name="category" maxLength={64} placeholder="Mercados, Angola, Tecnologia…" required /></label>
          </div>
          <label className="field-label">Título<input className="form-input" name="title" minLength={8} maxLength={180} required /></label>
          <label className="field-label">Resumo<textarea className="form-input form-textarea" name="standfirst" minLength={30} maxLength={360} rows={2} required /></label>
          <label className="field-label">Texto em Markdown<textarea className="form-input form-textarea" name="bodyMarkdown" minLength={300} maxLength={50000} rows={12} required /></label>
          <label className="field-label">Imagem de capa (URL HTTPS, opcional)<input className="form-input" name="coverImageUrl" type="url" placeholder="https://…" /></label>
          {contentKind === "biography" && (
            <fieldset className="biography-fields">
              <legend>Dados para biografia</legend>
              <div className="form-inline-fields">
                <label className="field-label">País da pessoa<input className="form-input" name="personCountry" maxLength={100} required /></label>
                <label className="field-label">Área de atuação<input className="form-input" name="personField" maxLength={100} /></label>
              </div>
              <label className="field-label">Percurso ou cargo<input className="form-input" name="personRole" maxLength={160} required /></label>
            </fieldset>
          )}
          <fieldset className="sources-editor" disabled={!creatorPlus}>
            <legend>Fontes e referências</legend>
            <p className="form-hint">Inclua fontes verificáveis com ligações HTTPS. A redação confirma as referências durante a revisão.</p>
            {sourceDrafts.map((source, index) => (
              <div className="source-draft" key={index}>
                <div className="form-inline-fields">
                  <label className="field-label">Título da fonte<input className="form-input" value={source.title} onChange={(event) => setSourceDrafts((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, title: event.target.value } : item))} maxLength={180} placeholder="Relatório, artigo ou estudo" /></label>
                  <label className="field-label">Publicador<input className="form-input" value={source.publisher} onChange={(event) => setSourceDrafts((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, publisher: event.target.value } : item))} maxLength={120} placeholder="Instituição ou publicação" /></label>
                </div>
                <label className="field-label">Ligação HTTPS<input className="form-input" type="url" value={source.url} onChange={(event) => setSourceDrafts((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, url: event.target.value } : item))} maxLength={2048} placeholder="https://…" /></label>
                {sourceDrafts.length > 1 && <button className="inline-button" type="button" onClick={() => setSourceDrafts((current) => current.filter((_, itemIndex) => itemIndex !== index))}>Remover esta fonte</button>}
              </div>
            ))}
            {sourceDrafts.length < 20 && <button className="inline-button" type="button" onClick={() => setSourceDrafts((current) => [...current, { ...emptySource }])}>Adicionar outra fonte</button>}
          </fieldset>
          {!creatorPlus && <p className="form-privacy">O plano gratuito não aceita fontes nem ligações no artigo. <button className="inline-button" type="button" onClick={upgrade}>Conheça o Creator Plus</button></p>}
          <button className="button button-dark" type="submit" disabled={isSubmitting}>Enviar para revisão</button>
        </form>
      </section>

      <section className="workspace-section">
        <div className="workspace-heading"><span className="section-kicker">HISTÓRICO EDITORIAL</span><h2>As suas histórias</h2></div>
        {submissions.length === 0 ? <p className="workspace-empty">Ainda não submeteu nenhum artigo.</p> : (
          <div className="submission-list">{submissions.map((item) => (
            <article className="submission-item" key={item.id}>
              <div><span className="submission-status">{statusNames[item.status] ?? item.status}</span><h3>{item.title}</h3><p>{item.standfirst}</p></div>
              <span>{new Intl.DateTimeFormat("pt-PT", { dateStyle: "medium" }).format(new Date(item.updatedAt))}</span>
              {item.status === "published" && <Link href={`/${item.kind === "biography" ? "biografias" : "artigos"}/${item.slug}`}>Ver publicado</Link>}
            </article>
          ))}</div>
        )}
      </section>
      <p className="form-notice" role="status" aria-live="polite">{notice}</p>
    </div>
  );
}
