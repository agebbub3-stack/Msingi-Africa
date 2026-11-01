import { and, count, desc, eq, isNull } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth-session";
import { articles, user, userNotifications } from "@/lib/db/schema";

export const runtime = "nodejs";

const updateSchema = z.object({
  notificationId: z.uuid().optional(),
  markAll: z.boolean().optional(),
}).refine((value) => Boolean(value.notificationId) !== Boolean(value.markAll), {
  message: "Indique uma notificação ou escolha marcar todas como lidas.",
});

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Inicie sessão para ver as notificações." }, { status: 401 });

  const { db } = await import("@/lib/db");
  const [notifications, [unread]] = await Promise.all([
    db.select({
      id: userNotifications.id,
      commentId: userNotifications.commentId,
      kind: userNotifications.kind,
      readAt: userNotifications.readAt,
      createdAt: userNotifications.createdAt,
      articleSlug: articles.slug,
      articleKind: articles.kind,
      articleTitle: articles.title,
      actorName: user.name,
    })
      .from(userNotifications)
      .innerJoin(articles, eq(userNotifications.articleId, articles.id))
      .leftJoin(user, eq(userNotifications.actorId, user.id))
      .where(and(
        eq(userNotifications.userId, session.user.id),
        eq(articles.status, "published"),
        eq(articles.noIndex, false),
      ))
      .orderBy(desc(userNotifications.createdAt))
      .limit(50),
    db.select({ count: count() })
      .from(userNotifications)
      .innerJoin(articles, eq(userNotifications.articleId, articles.id))
      .where(and(
        eq(userNotifications.userId, session.user.id),
        isNull(userNotifications.readAt),
        eq(articles.status, "published"),
        eq(articles.noIndex, false),
      )),
  ]);
  return NextResponse.json({
    notifications: notifications.map((notification) => ({
      ...notification,
      createdAt: notification.createdAt.toISOString(),
      readAt: notification.readAt?.toISOString() ?? null,
    })),
    unreadCount: unread.count,
  }, { headers: { "Cache-Control": "private, no-store" } });
}

export async function PATCH(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Inicie sessão para atualizar as notificações." }, { status: 401 });

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "O pedido de atualização não é válido." }, { status: 400 });
  }
  const parsed = updateSchema.safeParse(payload);
  if (!parsed.success) return NextResponse.json({ error: "Indique uma notificação válida." }, { status: 400 });

  const { db } = await import("@/lib/db");
  const filters = and(
    eq(userNotifications.userId, session.user.id),
    isNull(userNotifications.readAt),
    parsed.data.notificationId
      ? eq(userNotifications.id, parsed.data.notificationId)
      : undefined,
  );
  const updated = await db.update(userNotifications)
    .set({ readAt: new Date() })
    .where(filters)
    .returning({ id: userNotifications.id });
  return NextResponse.json({ updatedCount: updated.length });
}
