import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CreatorWorkspace } from "@/components/creator-workspace";
import { NotificationInbox } from "@/components/notification-inbox";
import { SignOutButton } from "@/components/sign-out-button";
import { creatorProfiles, articles, subscriptions } from "@/lib/db/schema";
import { and, desc, eq, gt, isNull, or } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Área de autor",
  description: "Gira o seu perfil, acompanhe as submissões e prepare artigos para a redação.",
  robots: { index: false, follow: false },
};

export default async function CreatorDashboardPage() {
  if (!process.env.DATABASE_URL) {
    return <section className="account-page"><div className="account-card"><span className="section-kicker">CONFIGURAÇÃO NECESSÁRIA</span><h1>Ligue a sua<br /><em>conta.</em></h1><p>Configure DATABASE_URL, BETTER_AUTH_SECRET e execute as migrações para ativar a área de autor.</p></div></section>;
  }

  const { getSession } = await import("@/lib/auth-session");
  const session = await getSession();
  if (!session) redirect("/entrar?callbackURL=%2Fpainel");
  const { db } = await import("@/lib/db");
  const [profile] = await db.select({
    slug: creatorProfiles.slug,
    displayName: creatorProfiles.displayName,
    biography: creatorProfiles.biography,
    countryCode: creatorProfiles.countryCode,
    websiteUrl: creatorProfiles.websiteUrl,
  }).from(creatorProfiles).where(eq(creatorProfiles.userId, session.user.id)).limit(1);
  const submissions = await db.select({
    id: articles.id,
    slug: articles.slug,
    kind: articles.kind,
    status: articles.status,
    title: articles.title,
    standfirst: articles.standfirst,
    category: articles.category,
    updatedAt: articles.updatedAt,
    createdAt: articles.createdAt,
  }).from(articles).where(eq(articles.authorId, session.user.id)).orderBy(desc(articles.updatedAt)).limit(100);
  const [subscription] = await db.select({
    id: subscriptions.id,
    currentPeriodEnd: subscriptions.currentPeriodEnd,
    cancelAtPeriodEnd: subscriptions.cancelAtPeriodEnd,
  }).from(subscriptions)
    .where(and(
      eq(subscriptions.userId, session.user.id),
      eq(subscriptions.status, "active"),
      or(isNull(subscriptions.currentPeriodEnd), gt(subscriptions.currentPeriodEnd, new Date())),
    )).limit(1);

  return (
    <section className="dashboard-page section-pad">
      <header className="dashboard-header">
        <span className="section-kicker">ÁREA DE AUTOR</span>
        <h1>Olá, <em>{session.user.name.split(" ")[0]}.</em></h1>
        <p>Prepare as suas histórias e acompanhe o trabalho editorial num só lugar.</p>
        <div className="dashboard-account-meta"><span>{session.user.email}</span><SignOutButton /></div>
      </header>
      <NotificationInbox />
      {!session.user.emailVerified && <div className="verification-notice">Confirme o seu endereço de e-mail para submeter artigos e comentar. A mensagem de verificação foi enviada no registo.</div>}
      <CreatorWorkspace
        profile={profile ?? null}
        submissions={submissions.map((item) => ({ ...item, updatedAt: item.updatedAt.toISOString(), createdAt: item.createdAt.toISOString() }))}
        creatorPlus={Boolean(subscription)}
        subscriptionEndsAt={subscription?.currentPeriodEnd?.toISOString() ?? null}
        cancelAtPeriodEnd={subscription?.cancelAtPeriodEnd ?? false}
      />
    </section>
  );
}
