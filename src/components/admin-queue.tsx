"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { AdminArticleForm } from "@/components/admin-article-form";

type QueueItem = {
  id: string;
  title: string;
  standfirst: string;
  bodyMarkdown: string;
  category: string;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string[];
  kind: string;
  authorName: string;
  authorEmail: string;
  submittedWithPlan: string;
  createdAt: string;
};

type CommentItem = {
  id: string;
  body: string;
  authorName: string;
  articleTitle: string;
  createdAt: string;
};

type PromotionProposal = {
  id: string;
  packageId: string;
  packageName: string;
  amountCents: number;
  contactName: string;
  contactEmail: string;
  title: string;
  idea: string;
  status: string;
  providerTransactionId: string | null;
  reviewNote: string | null;
  createdAt: string;
};

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
};

const promotionStatus: Record<string, string> = {
  pending_review: "À espera de revisão",
  accepted: "Aceite",
  rejected: "Rejeitada · aguarda reembolso",
  refunding: "Reembolso em confirmação",
  refunded: "Reembolsada",
};

export function AdminQueue() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [promotions, setPromotions] = useState<PromotionProposal[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [role, setRole] = useState<"admin" | "editor">("editor");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchQueue = useCallback(async (signal?: AbortSignal) => {
    const [articlesResponse, commentsResponse, promotionsResponse, contactResponse] = await Promise.all([
      fetch("/api/admin/articles", { signal }),
      fetch("/api/admin/comments", { signal }),
      fetch("/api/admin/promotions", { signal }),
      fetch("/api/admin/contact", { signal }),
    ]);
    if (!articlesResponse.ok || !commentsResponse.ok || !promotionsResponse.ok || !contactResponse.ok) {
      throw new Error("One or more editorial queue requests failed.");
    }
    const articlesResult = await articlesResponse.json() as { articles: QueueItem[]; role: "admin" | "editor" };
    const commentsResult = await commentsResponse.json() as { comments: CommentItem[] };
    const promotionsResult = await promotionsResponse.json() as { proposals: PromotionProposal[] };
    const contactResult = await contactResponse.json() as { messages: ContactMessage[] };
    return {
      articles: articlesResult.articles,
      comments: commentsResult.comments,
      promotions: promotionsResult.proposals,
      contactMessages: contactResult.messages,
      role: articlesResult.role,
    };
  }, []);

  const applyQueue = useCallback((data: Awaited<ReturnType<typeof fetchQueue>>) => {
    setQueue(data.articles);
    setComments(data.comments);
    setPromotions(data.promotions);
    setContactMessages(data.contactMessages);
    setRole(data.role);
  }, []);

  async function loadQueue() {
    setLoading(true);
    try {
      applyQueue(await fetchQueue());
      setNotice("");
    } catch (error) {
      console.error("Could not load the editorial moderation queue.", error);
      setNotice("Não foi possível carregar a fila editorial. Confirme as permissões e tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    fetchQueue(controller.signal)
      .then((data) => {
        if (!active) return;
        applyQueue(data);
        setNotice("");
      })
      .catch((error: unknown) => {
        if (!active) return;
        console.error("Could not load the editorial moderation queue.", error);
        setNotice("Não foi possível carregar a fila editorial. Confirme as permissões e tente novamente.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [applyQueue, fetchQueue]);

  async function moderateArticle(articleId: string, action: "approve" | "reject") {
    setNotice("");
    try {
      const response = await fetch("/api/admin/articles", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId, action }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) {
        setNotice(result.error ?? "Não foi possível guardar a decisão.");
        return;
      }
      await loadQueue();
      setNotice(action === "approve" ? "Artigo publicado." : "Artigo devolvido ao autor.");
    } catch (error) {
      console.error("Could not moderate article.", error);
      setNotice("Não foi possível guardar a decisão editorial.");
    }
  }

  async function editArticle(articleId: string, event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setNotice("");
    try {
      const response = await fetch("/api/admin/articles", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleId,
          action: "edit",
          title: data.get("title"),
          standfirst: data.get("standfirst"),
          category: data.get("category"),
          bodyMarkdown: data.get("bodyMarkdown"),
          seoTitle: data.get("seoTitle"),
          seoDescription: data.get("seoDescription"),
          seoKeywords: String(data.get("seoKeywords") ?? "").split(",").map((keyword) => keyword.trim()).filter(Boolean),
          note: data.get("note"),
        }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) {
        setNotice(result.error ?? "Não foi possível guardar a edição.");
        return;
      }
      await loadQueue();
      setNotice("Edição editorial guardada na revisão.");
    } catch (error) {
      console.error("Could not save an editorial revision.", error);
      setNotice("Não foi possível guardar a edição.");
    }
  }

  async function moderateComment(commentId: string, action: "approved" | "rejected") {
    setNotice("");
    try {
      const response = await fetch(`/api/admin/comments/${commentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) {
        setNotice(result.error ?? "Não foi possível rever o comentário.");
        return;
      }
      await loadQueue();
      setNotice(action === "approved" ? "Comentário publicado." : "Comentário rejeitado.");
    } catch (error) {
      console.error("Could not moderate comment.", error);
      setNotice("Não foi possível rever o comentário.");
    }
  }

  async function reviewPromotion(proposalId: string, action: "accept" | "reject") {
    setNotice("");
    try {
      const response = await fetch("/api/admin/promotions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proposalId, action }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) {
        setNotice(result.error ?? "Não foi possível guardar a decisão.");
        return;
      }
      await loadQueue();
      setNotice(action === "accept" ? "Parceria aceite para produção." : "Proposta rejeitada. O reembolso precisa de ser confirmado.");
    } catch (error) {
      console.error("Could not review sponsored proposal.", error);
      setNotice("Não foi possível rever a parceria.");
    }
  }

  async function refundPromotion(proposalId: string) {
    setNotice("");
    try {
      const response = await fetch(`/api/admin/promotions/${proposalId}/refund`, { method: "POST" });
      const result = await response.json() as { error?: string; status?: string };
      if (!response.ok) {
        setNotice(result.error ?? "Não foi possível confirmar o reembolso.");
        await loadQueue();
        return;
      }
      await loadQueue();
      setNotice("Reembolso confirmado pela Flutterwave.");
    } catch (error) {
      console.error("Could not refund sponsored proposal.", error);
      setNotice("Não foi possível confirmar o reembolso. Verifique a transação na Flutterwave.");
    }
  }

  async function markContact(messageId: string, status: "read" | "archived") {
    try {
      const response = await fetch(`/api/admin/contact/${messageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) {
        setNotice(result.error ?? "Não foi possível atualizar a mensagem.");
        return;
      }
      await loadQueue();
    } catch (error) {
      console.error("Could not update contact message.", error);
      setNotice("Não foi possível atualizar a mensagem.");
    }
  }

  return (
    <div className="admin-queue">
      <p className="form-notice" role="status" aria-live="polite">{notice}</p>
      {role === "admin" && <AdminArticleForm />}
      <section className="workspace-section">
        <div className="workspace-heading"><span className="section-kicker">REVISÃO DE CONTEÚDO</span><h2>Artigos à espera</h2></div>
        {loading ? <p className="workspace-empty">A carregar a fila…</p> : queue.length === 0 ? <p className="workspace-empty">A fila de artigos está limpa.</p> : (
          <div className="moderation-list">{queue.map((article) => (
            <article className="moderation-card" key={article.id}>
              <div className="moderation-meta"><span>{article.kind === "biography" ? "Biografia" : article.category}</span><span>{article.submittedWithPlan === "creator_plus" ? "Creator Plus" : "Gratuito"}</span><span>{article.authorName} · {article.authorEmail}</span></div>
              <h3>{article.title}</h3><p className="moderation-standfirst">{article.standfirst}</p>
              <details><summary>Ler o artigo completo</summary><pre>{article.bodyMarkdown}</pre></details>
              <details className="moderation-editor"><summary>Editar antes da decisão</summary>
                <form className="workspace-form" onSubmit={(event) => void editArticle(article.id, event)}>
                  <label className="field-label">Título<input className="form-input" name="title" defaultValue={article.title} minLength={8} maxLength={180} required /></label>
                  <label className="field-label">Resumo<textarea className="form-input form-textarea" name="standfirst" defaultValue={article.standfirst} minLength={30} maxLength={360} rows={2} required /></label>
                  <label className="field-label">Tema<input className="form-input" name="category" defaultValue={article.category} minLength={2} maxLength={64} required /></label>
                  <label className="field-label">Artigo em Markdown<textarea className="form-input form-textarea" name="bodyMarkdown" defaultValue={article.bodyMarkdown} minLength={300} maxLength={50000} rows={10} required /></label>
                  <fieldset className="biography-fields">
                    <legend>SEO desta publicação</legend>
                    <label className="field-label">Título para pesquisa (opcional, até 70 caracteres)<input className="form-input" name="seoTitle" defaultValue={article.seoTitle ?? ""} maxLength={70} /></label>
                    <label className="field-label">Descrição para pesquisa (opcional, até 180 caracteres)<textarea className="form-input form-textarea" name="seoDescription" defaultValue={article.seoDescription ?? ""} maxLength={180} rows={2} /></label>
                    <label className="field-label">Palavras-chave próprias, separadas por vírgula (até 12)<input className="form-input" name="seoKeywords" defaultValue={article.seoKeywords.join(", ")} maxLength={900} placeholder="Tema específico, pessoa, país, setor" /></label>
                    <p className="form-privacy">Se deixar as palavras-chave vazias, a página usa sugestões derivadas do título, tema e dados biográficos.</p>
                  </fieldset>
                  <label className="field-label">Nota editorial<input className="form-input" name="note" maxLength={1000} /></label>
                  <button className="button button-secondary" type="submit">Guardar edição</button>
                </form>
              </details>
              <div className="moderation-actions"><button className="button button-dark" type="button" onClick={() => void moderateArticle(article.id, "approve")}>Aprovar e publicar</button><button className="button button-secondary" type="button" onClick={() => void moderateArticle(article.id, "reject")}>Devolver ao autor</button></div>
            </article>
          ))}</div>
        )}
      </section>
      <section className="workspace-section">
        <div className="workspace-heading"><span className="section-kicker">PARCERIAS IDENTIFICADAS</span><h2>Propostas patrocinadas</h2><p>O pagamento não assegura publicação. Campanhas rejeitadas devem ser reembolsadas.</p></div>
        {loading ? <p className="workspace-empty">A carregar propostas…</p> : promotions.length === 0 ? <p className="workspace-empty">Não há propostas patrocinadas para rever.</p> : (
          <div className="moderation-list">{promotions.map((proposal) => (
            <article className="moderation-card" key={proposal.id}>
              <div className="moderation-meta"><span>{promotionStatus[proposal.status] ?? proposal.status}</span><span>{proposal.packageName} · US$ {proposal.amountCents / 100}</span><span>{proposal.contactName} · {proposal.contactEmail}</span></div>
              <h3>{proposal.title}</h3><p className="moderation-standfirst">{proposal.idea}</p>
              {proposal.reviewNote && <p>Nota editorial: {proposal.reviewNote}</p>}
              <p className="form-privacy">Transação Flutterwave: {proposal.providerTransactionId ?? "não confirmada"}</p>
              {proposal.status === "pending_review" && <div className="moderation-actions"><button className="button button-dark" type="button" onClick={() => void reviewPromotion(proposal.id, "accept")}>Aceitar proposta</button><button className="button button-secondary" type="button" onClick={() => void reviewPromotion(proposal.id, "reject")}>Rejeitar proposta</button></div>}
              {proposal.status === "rejected" && role === "admin" && <div className="moderation-actions"><button className="button button-secondary" type="button" onClick={() => void refundPromotion(proposal.id)}>Reembolsar pela Flutterwave</button></div>}
            </article>
          ))}</div>
        )}
      </section>
      <section className="workspace-section">
        <div className="workspace-heading"><span className="section-kicker">MODERAÇÃO DA COMUNIDADE</span><h2>Comentários pendentes</h2></div>
        {loading ? <p className="workspace-empty">A carregar comentários…</p> : comments.length === 0 ? <p className="workspace-empty">Não há comentários por rever.</p> : (
          <div className="moderation-list">{comments.map((comment) => (
            <article className="moderation-card" key={comment.id}>
              <div className="moderation-meta"><span>{comment.authorName}</span><span>{comment.articleTitle}</span></div>
              <p>{comment.body}</p>
              <div className="moderation-actions"><button className="button button-dark" type="button" onClick={() => void moderateComment(comment.id, "approved")}>Aprovar</button><button className="button button-secondary" type="button" onClick={() => void moderateComment(comment.id, "rejected")}>Rejeitar</button></div>
            </article>
          ))}</div>
        )}
      </section>
      <section className="workspace-section">
        <div className="workspace-heading"><span className="section-kicker">MENSAGENS RECEBIDAS</span><h2>Contacto com a redação</h2></div>
        {loading ? <p className="workspace-empty">A carregar mensagens…</p> : contactMessages.length === 0 ? <p className="workspace-empty">Não há mensagens novas.</p> : (
          <div className="moderation-list">{contactMessages.map((message) => (
            <article className="moderation-card" key={message.id}>
              <div className="moderation-meta"><span>{message.name} · <a href={`mailto:${message.email}`}>{message.email}</a></span><span>{new Intl.DateTimeFormat("pt-PT", { dateStyle: "medium" }).format(new Date(message.createdAt))}</span></div>
              <h3>{message.subject}</h3><p>{message.message}</p>
              <div className="moderation-actions"><button className="button button-dark" type="button" onClick={() => void markContact(message.id, "read")}>Marcar como lida</button><button className="button button-secondary" type="button" onClick={() => void markContact(message.id, "archived")}>Arquivar</button></div>
            </article>
          ))}</div>
        )}
      </section>
    </div>
  );
}
