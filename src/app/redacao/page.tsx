import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminQueue } from "@/components/admin-queue";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Fila editorial",
  description: "Revisão e moderação de artigos e comentários.",
  robots: { index: false, follow: false },
};

export default async function EditorialDeskPage() {
  if (!process.env.DATABASE_URL) {
    return <section className="account-page"><div className="account-card"><span className="section-kicker">CONFIGURAÇÃO NECESSÁRIA</span><h1>Redação<br /><em>editorial.</em></h1><p>Configure o PostgreSQL, execute as migrações e promova uma conta com ADMIN_EMAIL para abrir esta área.</p></div></section>;
  }
  const { getStaffSession } = await import("@/lib/staff");
  const { session, role } = await getStaffSession();
  if (!session) redirect("/entrar?callbackURL=%2Fredacao");
  if (!role) {
    return <section className="account-page"><div className="account-card"><span className="section-kicker">ACESSO RESTRITO</span><h1>Área da<br /><em>redação.</em></h1><p>A sua conta não tem permissões de editor ou administrador.</p><Link className="button button-dark" href="/painel">Voltar à área de autor</Link></div></section>;
  }
  return (
    <section className="dashboard-page section-pad">
      <header className="dashboard-header"><span className="section-kicker">KIOO / DESK · {role.toUpperCase()}</span><h1>Decisões com<br /><em>contexto.</em></h1><p>Leia, edite e aprove conteúdo. Nenhuma submissão é publicada automaticamente.</p></header>
      <AdminQueue />
    </section>
  );
}
