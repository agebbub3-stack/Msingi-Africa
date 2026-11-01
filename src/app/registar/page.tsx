import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = {
  title: "Criar conta de autor",
  description: "Crie o seu perfil de autor e submeta artigos à redação Msingi Africa.",
  robots: { index: false, follow: false },
};

export default function SignUpPage() {
  return (
    <section className="account-page">
      <div className="account-card">
        <span className="section-kicker">VOZES LOCAIS, PERSPETIVAS GLOBAIS</span>
        <h1>Partilhe o que<br /><em>sabe.</em></h1>
        <p>Crie uma conta gratuita, prepare a sua história e acompanhe cada etapa da revisão editorial.</p>
        <AuthForm mode="sign-up" />
        <p className="account-switch">Já faz parte da comunidade? <Link href="/entrar">Entre na sua conta</Link></p>
      </div>
    </section>
  );
}
