"use client";

import { Plus, Send, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, type FormEvent } from "react";

type ArticleSourceDraft = { title: string; publisher: string; url: string };
const emptySource: ArticleSourceDraft = { title: "", publisher: "", url: "" };

export function AdminArticleForm() {
  const [kind, setKind] = useState<"article" | "biography">("article");
  const [sources, setSources] = useState<ArticleSourceDraft[]>([]);
  const [notice, setNotice] = useState("");
  const [publishedArticle, setPublishedArticle] = useState<{ slug: string; kind: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function publishArticle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const enteredSources = sources.filter((source) => source.title.trim() || source.publisher.trim() || source.url.trim());
    if (enteredSources.some((source) => !source.title.trim() || !source.url.trim())) {
      setNotice("Preencha o título e a ligação HTTPS de cada fonte, ou remova a linha incompleta.");
      return;
    }

    setIsSubmitting(true);
    setNotice("");
    setPublishedArticle(null);
    try {
      const response = await fetch("/api/admin/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          title: data.get("title"),
          standfirst: data.get("standfirst"),
          category: data.get("category"),
          bodyMarkdown: data.get("bodyMarkdown"),
          coverImageUrl: data.get("coverImageUrl"),
          personCountry: kind === "biography" ? data.get("personCountry") : undefined,
          personField: kind === "biography" ? data.get("personField") : undefined,
          personRole: kind === "biography" ? data.get("personRole") : undefined,
          seoTitle: data.get("seoTitle"),
          seoDescription: data.get("seoDescription"),
          seoKeywords: String(data.get("seoKeywords") ?? "")
            .split(",")
            .map((keyword) => keyword.trim())
            .filter(Boolean),
          sources: enteredSources.map((source) => ({
            title: source.title.trim(),
            publisher: source.publisher.trim() || undefined,
            url: source.url.trim(),
          })),
        }),
      });
      const result = await response.json() as {
        error?: string;
        details?: Record<string, string[] | undefined>;
        article?: { slug: string; kind: string };
      };
      if (!response.ok) {
        const validationMessages = Object.values(result.details ?? {}).flat();
        setNotice([result.error ?? "Não foi possível publicar o artigo.", ...validationMessages].join(" "));
        return;
      }
      if (!result.article) throw new Error("The publication response did not include the new article.");
      setPublishedArticle(result.article);
      setNotice("Artigo publicado. A ligação pública já está disponível.");
      form.reset();
      setKind("article");
      setSources([]);
    } catch (error) {
      console.error("Could not publish an editorial article.", error);
      setNotice("Não foi possível publicar o artigo. Verifique a ligação e tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="workspace-section admin-publish-section">
      <div className="workspace-heading">
        <span className="section-kicker">PUBLICAÇÃO DA REDAÇÃO</span>
        <h2>Adicionar artigo</h2>
        <p>Disponível apenas para administradores. A publicação fica imediatamente visível no site.</p>
      </div>
      <form className="workspace-form admin-publish-form" onSubmit={(event) => void publishArticle(event)}>
        <label className="field-label">
          Tipo de publicação
          <select
            className="form-input"
            name="kind"
            value={kind}
            onChange={(event) => setKind(event.target.value as "article" | "biography")}
          >
            <option value="article">Artigo</option>
            <option value="biography">Biografia</option>
          </select>
        </label>
        <label className="field-label">
          Título
          <input className="form-input" name="title" minLength={8} maxLength={180} required />
        </label>
        <label className="field-label">
          Resumo
          <textarea className="form-input form-textarea" name="standfirst" minLength={30} maxLength={360} rows={3} required />
        </label>
        <div className="form-inline-fields">
          <label className="field-label">
            Tema
            <input className="form-input" name="category" minLength={2} maxLength={64} required />
          </label>
          <label className="field-label">
            Imagem de capa (URL HTTPS, opcional)
            <input className="form-input" name="coverImageUrl" type="url" placeholder="https://…" />
          </label>
        </div>
        {kind === "biography" && (
          <fieldset className="biography-fields">
            <legend>Dados biográficos</legend>
            <div className="form-inline-fields">
              <label className="field-label">
                País
                <input className="form-input" name="personCountry" maxLength={100} required />
              </label>
              <label className="field-label">
                Área de atuação (opcional)
                <input className="form-input" name="personField" maxLength={100} />
              </label>
            </div>
            <label className="field-label">
              Percurso ou função
              <input className="form-input" name="personRole" maxLength={160} required />
            </label>
          </fieldset>
        )}
        <label className="field-label">
          Texto completo em Markdown
          <textarea className="form-input form-textarea" name="bodyMarkdown" minLength={300} maxLength={50000} rows={12} required />
        </label>
        <fieldset className="biography-fields">
          <legend>SEO desta publicação</legend>
          <label className="field-label">
            Título para pesquisa (opcional, até 70 caracteres)
            <input className="form-input" name="seoTitle" maxLength={70} />
          </label>
          <label className="field-label">
            Descrição para pesquisa (opcional, até 180 caracteres)
            <textarea className="form-input form-textarea" name="seoDescription" maxLength={180} rows={2} />
          </label>
          <label className="field-label">
            Palavras-chave separadas por vírgula (até 12)
            <input className="form-input" name="seoKeywords" maxLength={900} />
          </label>
        </fieldset>
        <fieldset className="biography-fields admin-source-fields">
          <legend>Fontes e referências</legend>
          <p className="form-privacy">As fontes publicadas ajudam leitores a verificar os factos e acrescentam contexto ao artigo.</p>
          {sources.map((source, index) => (
            <div className="admin-source-row" key={index}>
              <label className="field-label">
                Título da fonte
                <input
                  className="form-input"
                  value={source.title}
                  maxLength={180}
                  onChange={(event) => setSources((current) => current.map((item, itemIndex) =>
                    itemIndex === index ? { ...item, title: event.target.value } : item,
                  ))}
                />
              </label>
              <label className="field-label">
                Publicador (opcional)
                <input
                  className="form-input"
                  value={source.publisher}
                  maxLength={120}
                  onChange={(event) => setSources((current) => current.map((item, itemIndex) =>
                    itemIndex === index ? { ...item, publisher: event.target.value } : item,
                  ))}
                />
              </label>
              <label className="field-label">
                URL HTTPS
                <input
                  className="form-input"
                  type="url"
                  value={source.url}
                  placeholder="https://…"
                  onChange={(event) => setSources((current) => current.map((item, itemIndex) =>
                    itemIndex === index ? { ...item, url: event.target.value } : item,
                  ))}
                />
              </label>
              <button
                type="button"
                className="admin-source-remove"
                aria-label={`Remover fonte ${index + 1}`}
                onClick={() => setSources((current) => current.filter((_, itemIndex) => itemIndex !== index))}
              >
                <Trash2 size={15} /> Remover
              </button>
            </div>
          ))}
          {sources.length < 20 && (
            <button type="button" className="button button-secondary" onClick={() => setSources((current) => [...current, { ...emptySource }])}>
              <Plus size={14} /> Adicionar fonte
            </button>
          )}
        </fieldset>
        {notice && (
          <p className="form-notice" role="status" aria-live="polite">
            {notice} {publishedArticle && (
              <Link href={`/${publishedArticle.kind === "biography" ? "biografias" : "artigos"}/${publishedArticle.slug}`} target="_blank" rel="noopener noreferrer">
                Ver publicação
              </Link>
            )}
          </p>
        )}
        <button className="button button-dark" type="submit" disabled={isSubmitting}>
          <Send size={14} /> {isSubmitting ? "A publicar…" : "Publicar agora"}
        </button>
      </form>
    </section>
  );
}
