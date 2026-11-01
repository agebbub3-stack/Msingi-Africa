import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Aceda à sua conta de criador Bantaba Africa.",
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return (
    <section className="account-page">
      <div className="account-card">
        <span className="section-kicker">A SUA PRÓXIMA HISTÓRIA COMEÇA AQUI</span>
        <h1>Entre na sua<br /><em>conta.</em></h1>
        <p>Continue a escrever, acompanhe a revisão editorial e atualize o seu perfil de autor.</p>
        <AuthForm mode="sign-in" />
        <p className="account-switch">Ainda não tem conta? <Link href="/registar">Crie o seu perfil de autor</Link></p>
      </div>
    </section>
  );
}
