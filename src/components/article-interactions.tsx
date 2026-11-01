"use client";

import { Heart, Link as LinkIcon, MessageCircle, Send } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

type Comment = {
  id: string;
  parentId: string | null;
  body: string;
  author: string;
  createdAt: string;
};

export function ArticleInteractions({ articleId, title }: { articleId?: string; title: string }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState("");
  const [notice, setNotice] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!articleId) return;
    const controller = new AbortController();
    void Promise.all([
      fetch(`/api/articles/${articleId}/like`, { signal: controller.signal }),
      fetch(`/api/articles/${articleId}/comments`, { signal: controller.signal }),
    ]).then(async ([likesResponse, commentsResponse]) => {
      if (likesResponse.ok) {
        const result = await likesResponse.json() as { count: number; liked: boolean };
        setLikeCount(result.count);
        setLiked(result.liked);
      }
      if (commentsResponse.ok) {
        const result = await commentsResponse.json() as { comments: Comment[] };
        setComments(result.comments);
      }
    }).catch((error: unknown) => {
      if (error instanceof DOMException && error.name === "AbortError") return;
      console.error("Could not load article reactions.", error);
    });
    return () => controller.abort();
  }, [articleId]);

  async function toggleLike() {
    if (!articleId) return;
    setNotice("");
    try {
      const response = await fetch(`/api/articles/${articleId}/like`, { method: "POST" });
      const result = await response.json() as { error?: string; liked?: boolean; count?: number };
      if (!response.ok) {
        setNotice(result.error ?? "Inicie sessão para gostar deste artigo.");
        return;
      }
      setLiked(Boolean(result.liked));
      setLikeCount(result.count ?? likeCount);
    } catch (error) {
      console.error("Could not update article reaction.", error);
      setNotice("Não foi possível guardar a reação.");
    }
  }

  async function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!articleId) return;
    setIsLoading(true);
    setNotice("");
    try {
      const response = await fetch(`/api/articles/${articleId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: comment }),
      });
      const result = await response.json() as { error?: string; message?: string };
      if (!response.ok) {
        setNotice(result.error ?? "Não foi possível enviar o comentário.");
        return;
      }
      setComment("");
      setNotice(result.message ?? "Comentário enviado para revisão.");
    } catch (error) {
      console.error("Could not submit article comment.", error);
      setNotice("Não foi possível enviar o comentário.");
    } finally {
      setIsLoading(false);
    }
  }

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setNotice("Ligação copiada.");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      console.error("Could not share article.", error);
      setNotice("Não foi possível partilhar a ligação.");
    }
  }

  return (
    <section className="article-community" aria-label="Partilhar e comentar">
      <div className="community-actions">
        <button type="button" className={`community-button${liked ? " community-button-active" : ""}`} onClick={toggleLike} disabled={!articleId}>
          <Heart size={16} fill={liked ? "currentColor" : "none"} /> {likeCount} Gostos
        </button>
        <a className="community-button" href="#comentarios"><MessageCircle size={16} /> {comments.length} Comentários</a>
        <button type="button" className="community-button" onClick={share}><LinkIcon size={16} /> Partilhar</button>
      </div>
      <p className="form-notice" role="status" aria-live="polite">{notice}</p>
      <div id="comentarios" className="comments-panel">
        <div className="workspace-heading"><span className="section-kicker">CONVERSA COM CONTEXTO</span><h2>Comentários</h2></div>
        {comments.length === 0 ? <p className="workspace-empty">Ainda não há comentários aprovados. Seja a primeira pessoa a contribuir.</p> : (
          <div className="comment-list">{comments.map((item) => (
            <article key={item.id} className="comment-item">
              <strong>{item.author}</strong><time dateTime={item.createdAt}>{new Intl.DateTimeFormat("pt-PT", { dateStyle: "medium" }).format(new Date(item.createdAt))}</time>
              <p>{item.body}</p>
            </article>
          ))}</div>
        )}
        {articleId ? (
          <form className="comment-form" onSubmit={submitComment}>
            <label className="field-label" htmlFor="article-comment">A sua perspetiva</label>
            <textarea id="article-comment" className="form-input form-textarea" value={comment} onChange={(event) => setComment(event.target.value)} minLength={3} maxLength={2000} rows={4} required placeholder="Partilhe uma ideia, pergunta ou contexto adicional." />
            <button type="submit" className="button button-dark" disabled={isLoading}><Send size={14} /> {isLoading ? "A enviar…" : "Enviar para revisão"}</button>
          </form>
        ) : <p className="form-privacy">Os comentários estarão disponíveis quando o artigo for publicado na edição ligada à comunidade.</p>}
      </div>
    </section>
  );
}
