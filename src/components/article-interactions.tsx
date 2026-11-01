"use client";

import { Copy, Heart, MessageCircle, Send, Share2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { Locale } from "@/lib/i18n";

type Comment = {
  id: string;
  parentId: string | null;
  body: string;
  author: string;
  authorSlug: string | null;
  createdAt: string;
};

type ArticleInteractionsProps = {
  articleId?: string;
  title: string;
  shareUrl: string;
  returnPath: string;
  initialComments: Comment[];
  initialCommentCount: number;
  locale?: Locale;
};

function socialShareUrl(baseUrl: string, title: string, url: string) {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(`${title} ${url}`);
  if (baseUrl === "https://wa.me/") return `${baseUrl}?text=${encodedText}`;
  if (baseUrl === "https://twitter.com/intent/tweet") return `${baseUrl}?text=${encodeURIComponent(title)}&url=${encodedUrl}`;
  return `${baseUrl}?url=${encodedUrl}`;
}

export function ArticleInteractions({
  articleId,
  title,
  shareUrl,
  returnPath,
  initialComments,
  initialCommentCount,
  locale = "en",
}: ArticleInteractionsProps) {
  const en = locale === "en";
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState(initialComments);
  const [commentCount, setCommentCount] = useState(initialCommentCount);
  const [comment, setComment] = useState("");
  const [replyBody, setReplyBody] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isReacting, setIsReacting] = useState(false);

  const commentsByParent = useMemo(() => {
    const groups = new Map<string, Comment[]>();
    for (const item of comments) {
      if (!item.parentId) continue;
      const replies = groups.get(item.parentId) ?? [];
      replies.push(item);
      groups.set(item.parentId, replies);
    }
    return groups;
  }, [comments]);
  const commentIds = useMemo(() => new Set(comments.map((item) => item.id)), [comments]);
  const topLevelComments = comments.filter((item) => !item.parentId || !commentIds.has(item.parentId));
  const signInHref = `/entrar?callbackURL=${encodeURIComponent(`${returnPath}#comentarios`)}`;

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
        const result = await commentsResponse.json() as { comments: Comment[]; totalCount: number };
        setComments(result.comments);
        setCommentCount(result.totalCount);
      } else {
        throw new Error("Could not load approved article comments.");
      }
    }).catch((error: unknown) => {
      if (error instanceof DOMException && error.name === "AbortError") return;
      console.error("Could not load article interactions.", error);
      setNotice(en
        ? "Could not refresh interactions. Published comments are still available."
        : "Não foi possível atualizar as interações. Os comentários publicados continuam disponíveis.");
    });
    return () => controller.abort();
  }, [articleId, en]);

  async function toggleLike() {
    if (!articleId || isReacting) return;
    setNotice("");
    setIsReacting(true);
    try {
      const response = await fetch(`/api/articles/${articleId}/like`, { method: "POST" });
      const result = await response.json() as { error?: string; liked?: boolean; count?: number };
      if (!response.ok) {
        setNotice(result.error ?? (en ? "Sign in to react to this article." : "Inicie sessão para reagir a este artigo."));
        return;
      }
      setLiked(Boolean(result.liked));
      setLikeCount(result.count ?? likeCount);
    } catch (error) {
      console.error("Could not update article reaction.", error);
      setNotice(en ? "Could not save your reaction." : "Não foi possível guardar a reação.");
    } finally {
      setIsReacting(false);
    }
  }

  async function submitComment(event: FormEvent<HTMLFormElement>, parentId?: string) {
    event.preventDefault();
    if (!articleId || isLoading) return;
    const body = parentId ? replyBody : comment;
    setIsLoading(true);
    setNotice("");
    try {
      const response = await fetch(`/api/articles/${articleId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body, ...(parentId ? { parentId } : {}) }),
      });
      const result = await response.json() as { error?: string; message?: string };
      if (!response.ok) {
        setNotice(result.error ?? (en ? "Could not submit your comment." : "Não foi possível enviar o comentário."));
        return;
      }
      if (parentId) {
        setReplyBody("");
        setReplyTo(null);
      } else {
        setComment("");
      }
      setNotice(result.message ?? (en ? "Comment submitted for editorial review." : "Comentário enviado para revisão editorial."));
    } catch (error) {
      console.error("Could not submit article comment.", error);
      setNotice(en ? "Could not submit your comment." : "Não foi possível enviar o comentário.");
    } finally {
      setIsLoading(false);
    }
  }

  async function copyArticleLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setNotice(en ? "Link copied." : "Ligação copiada.");
    } catch (error) {
      console.error("Could not copy article link.", error);
      setNotice(en
        ? "Could not copy the link. Use one of the sharing options."
        : "Não foi possível copiar a ligação. Use uma das opções de partilha.");
    }
  }

  async function shareArticle() {
    try {
      if (navigator.share) {
        await navigator.share({ title, url: shareUrl });
      } else {
        await copyArticleLink();
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      console.error("Could not share article.", error);
      setNotice(en ? "Could not open your device's sharing options." : "Não foi possível abrir a partilha do dispositivo.");
    }
  }

  function renderComment(item: Comment) {
    const replies = commentsByParent.get(item.id) ?? [];
    return (
      <article key={item.id} id={`comentario-${item.id}`} className="comment-item">
        <div className="comment-byline">
          <strong>{item.authorSlug ? <Link href={`/autores/${item.authorSlug}`}>{item.author}</Link> : item.author}</strong>
          <time dateTime={item.createdAt}>
            {new Intl.DateTimeFormat(en ? "en-GB" : "pt-PT", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(item.createdAt))}
          </time>
        </div>
        <p>{item.body}</p>
        {articleId && !item.parentId && (
          <button
            type="button"
            className="comment-reply-button"
            aria-expanded={replyTo === item.id}
            aria-controls={`responder-${item.id}`}
            onClick={() => {
              setReplyTo((current) => current === item.id ? null : item.id);
              setReplyBody("");
              setNotice("");
            }}
          >
            {en ? "Reply" : "Responder"}
          </button>
        )}
        {replyTo === item.id && (
          <form id={`responder-${item.id}`} className="comment-form comment-reply-form" onSubmit={(event) => submitComment(event, item.id)}>
            <label className="field-label" htmlFor={`resposta-${item.id}`}>{en ? "Your reply" : "A sua resposta"}</label>
            <textarea
              id={`resposta-${item.id}`}
              className="form-input form-textarea"
              value={replyBody}
              onChange={(event) => setReplyBody(event.target.value)}
              minLength={3}
              maxLength={2000}
              rows={3}
              required
              placeholder={en ? "Add context to the conversation." : "Acrescente contexto à conversa."}
            />
            <div className="comment-reply-actions">
              <button type="submit" className="button button-dark" disabled={isLoading}>
                <Send size={14} /> {isLoading ? (en ? "Sending…" : "A enviar…") : (en ? "Send reply" : "Enviar resposta")}
              </button>
              <Link href={signInHref}>{en ? "Sign in to participate" : "Inicie sessão para participar"}</Link>
            </div>
          </form>
        )}
        {replies.length > 0 && <div className="comment-replies">{replies.map(renderComment)}</div>}
      </article>
    );
  }

  return (
    <section className="article-community" aria-label={en ? "Share and comment" : "Partilhar e comentar"}>
      <div className="community-actions">
        <button
          type="button"
          className={`community-button${liked ? " community-button-active" : ""}`}
          onClick={toggleLike}
          disabled={!articleId || isReacting}
          aria-pressed={liked}
        >
          <Heart size={16} fill={liked ? "currentColor" : "none"} /> {likeCount} {en ? "Likes" : "Gostos"}
        </button>
        <a className="community-button" href="#comentarios">
          <MessageCircle size={16} /> {commentCount} {en ? "Comments" : "Comentários"}
        </a>
        <button type="button" className="community-button" onClick={shareArticle}>
          <Share2 size={16} /> {en ? "Share" : "Partilhar"}
        </button>
        <button type="button" className="community-button" onClick={copyArticleLink}>
          <Copy size={15} /> {en ? "Copy link" : "Copiar ligação"}
        </button>
      </div>
      <nav className="community-networks" aria-label={en ? "Share on social media" : "Partilhar nas redes sociais"}>
        <span>{en ? "Share on" : "Partilhar em"}</span>
        <a href={socialShareUrl("https://wa.me/", title, shareUrl)} target="_blank" rel="noopener noreferrer">WhatsApp</a>
        <a href={socialShareUrl("https://www.linkedin.com/sharing/share-offsite/", title, shareUrl)} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href={socialShareUrl("https://www.facebook.com/sharer/sharer.php", title, shareUrl)} target="_blank" rel="noopener noreferrer">Facebook</a>
        <a href={socialShareUrl("https://twitter.com/intent/tweet", title, shareUrl)} target="_blank" rel="noopener noreferrer">X</a>
      </nav>
      {notice && <p className="form-notice" role="status" aria-live="polite">{notice}</p>}
      <div id="comentarios" className="comments-panel">
        <div className="workspace-heading">
          <span className="section-kicker">{en ? "A CONVERSATION WITH CONTEXT" : "CONVERSA COM CONTEXTO"}</span>
          <h2>{en ? "Comments" : "Comentários"} <span className="comment-total">({commentCount})</span></h2>
        </div>
        {comments.length === 0
          ? <p className="workspace-empty">{en ? "No comments have been approved yet. Be the first to contribute." : "Ainda não há comentários aprovados. Seja a primeira pessoa a contribuir."}</p>
          : <div className="comment-list">{topLevelComments.map(renderComment)}</div>}
        {commentCount > comments.length && (
          <p className="comment-list-note">{en ? `Showing the first ${comments.length} approved comments.` : `Estão visíveis os primeiros ${comments.length} comentários aprovados.`}</p>
        )}
        {articleId ? (
          <form className="comment-form" onSubmit={(event) => submitComment(event)}>
            <label className="field-label" htmlFor="article-comment">{en ? "Your perspective" : "A sua perspetiva"}</label>
            <textarea
              id="article-comment"
              className="form-input form-textarea"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              minLength={3}
              maxLength={2000}
              rows={4}
              required
              placeholder={en ? "Share an idea, question or additional context." : "Partilhe uma ideia, pergunta ou contexto adicional."}
            />
            <p className="comment-guidance">
              {en ? "Comments are reviewed before publication. " : "Os comentários são revistos antes de serem publicados. "}
              <Link href={signInHref}>{en ? "Sign in" : "Inicie sessão"}</Link>
              {en ? " and verify your email to participate." : " e confirme o seu e-mail para participar."}
            </p>
            <button type="submit" className="button button-dark" disabled={isLoading}>
              <Send size={14} /> {isLoading ? (en ? "Sending…" : "A enviar…") : (en ? "Submit for review" : "Enviar para revisão")}
            </button>
          </form>
        ) : <p className="form-privacy">{en
          ? "Comments will be available when this article is published in the community edition."
          : "Os comentários estarão disponíveis quando o artigo for publicado na edição ligada à comunidade."}</p>}
      </div>
    </section>
  );
}
