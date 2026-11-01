"use client";

import { Bell, CheckCheck, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Notification = {
  id: string;
  commentId: string | null;
  kind: "article_like" | "comment_approved" | "comment_rejected" | "article_comment" | "comment_reply";
  readAt: string | null;
  createdAt: string;
  articleSlug: string;
  articleKind: string;
  articleTitle: string;
  actorName: string | null;
};

async function getNotifications(signal?: AbortSignal) {
  const response = await fetch("/api/notifications", { signal, cache: "no-store" });
  const result = await response.json() as { error?: string; notifications?: Notification[]; unreadCount?: number };
  if (!response.ok) throw new Error(result.error ?? "Não foi possível carregar as notificações.");
  return result;
}

function notificationMessage(notification: Notification) {
  switch (notification.kind) {
    case "article_like":
      return `${notification.actorName ?? "Um leitor"} gostou do seu artigo.`;
    case "comment_approved":
      return "A redação aprovou o seu comentário.";
    case "comment_rejected":
      return "A redação não publicou o seu comentário. Reveja as regras da comunidade.";
    case "article_comment":
      return `${notification.actorName ?? "Um leitor"} comentou no seu artigo.`;
    case "comment_reply":
      return `${notification.actorName ?? "Um leitor"} respondeu a um comentário nesta história.`;
  }
}

function articlePath(notification: Notification) {
  const prefix = notification.articleKind === "biography" ? "/biografias" : "/artigos";
  return `${prefix}/${notification.articleSlug}${notification.commentId ? `#comentario-${notification.commentId}` : "#comentarios"}`;
}

export function NotificationInbox() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [updating, setUpdating] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const controller = new AbortController();
    void getNotifications(controller.signal)
      .then((result) => {
        setNotifications(result.notifications ?? []);
        setUnreadCount(result.unreadCount ?? 0);
        setNotice("");
        setLoadFailed(false);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        console.error("Could not load user notifications.", error);
        setNotice("Não foi possível carregar as notificações. Tente novamente.");
        setLoadFailed(true);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  async function retryLoading() {
    setLoading(true);
    setNotice("");
    try {
      const result = await getNotifications();
      setNotifications(result.notifications ?? []);
      setUnreadCount(result.unreadCount ?? 0);
      setLoadFailed(false);
    } catch (error) {
      console.error("Could not reload user notifications.", error);
      setNotice("Não foi possível carregar as notificações. Tente novamente.");
      setLoadFailed(true);
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(notificationId?: string) {
    setUpdating(true);
    setNotice("");
    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notificationId ? { notificationId } : { markAll: true }),
      });
      const result = await response.json() as { error?: string; updatedCount?: number };
      if (!response.ok) throw new Error(result.error ?? "Não foi possível atualizar as notificações.");
      const readAt = new Date().toISOString();
      if (notificationId) {
        setNotifications((current) => current.map((item) => item.id === notificationId ? { ...item, readAt } : item));
      } else {
        setNotifications((current) => current.map((item) => ({ ...item, readAt })));
      }
      setUnreadCount((current) => Math.max(0, current - (result.updatedCount ?? 0)));
      return true;
    } catch (error) {
      console.error("Could not mark notifications as read.", error);
      setNotice("Não foi possível atualizar as notificações.");
      return false;
    } finally {
      setUpdating(false);
    }
  }

  async function openNotification(notification: Notification) {
    if (!notification.readAt && !(await markAsRead(notification.id))) return;
    router.push(articlePath(notification));
  }

  return (
    <section className="notification-inbox" aria-labelledby="notification-inbox-title">
      <header className="notification-inbox-heading">
        <div>
          <span className="section-kicker"><Bell size={13} /> CENTRO DE NOTIFICAÇÕES</span>
          <h2 id="notification-inbox-title">A sua comunidade</h2>
          <p>Reações, comentários, respostas e decisões editoriais sobre a sua participação.</p>
        </div>
        {unreadCount > 0 && (
          <button type="button" className="notification-mark-all" onClick={() => void markAsRead()} disabled={updating}>
            <CheckCheck size={15} /> Marcar tudo como lido
          </button>
        )}
      </header>
      {notice && (
        <p className="form-notice" role="status">
          {notice} {loadFailed && <button type="button" className="inline-button" onClick={() => void retryLoading()}>Tentar novamente</button>}
        </p>
      )}
      {loading ? <p className="workspace-empty">A carregar notificações…</p>
        : notifications.length === 0 ? (
          <p className="workspace-empty">Ainda não há notificações. Avisaremos quando alguém reagir ou comentar os seus artigos, responder à sua conversa ou a redação rever um comentário.</p>
        ) : (
          <ul className="notification-list">
            {notifications.map((notification) => (
              <li key={notification.id}>
                <button
                  type="button"
                  className={`notification-item${notification.readAt ? "" : " notification-item-unread"}`}
                  onClick={() => void openNotification(notification)}
                  disabled={updating}
                >
                  <span className="notification-indicator" aria-hidden="true" />
                  <span className="notification-copy">
                    <span className="notification-message">{notificationMessage(notification)}</span>
                    <strong>{notification.articleTitle}</strong>
                    <time dateTime={notification.createdAt}>
                      {new Intl.DateTimeFormat("pt-PT", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(notification.createdAt))}
                    </time>
                  </span>
                  <ChevronRight size={17} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
    </section>
  );
}
