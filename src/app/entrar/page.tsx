import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { getLocale } from "@/lib/locale.server";

export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: locale === "en" ? "Sign in" : "Entrar",
    description: locale === "en" ? "Sign in to your Kioo Africa creator account." : "Aceda à sua conta de criador Kioo Africa.",
    robots: { index: false, follow: false },
  };
}

export default async function SignInPage() {
  const locale = await getLocale();
  const en = locale === "en";
  return (
    <section className="account-page">
      <div className="account-card">
        <span className="section-kicker">{en ? "YOUR NEXT STORY STARTS HERE" : "A SUA PRÓXIMA HISTÓRIA COMEÇA AQUI"}</span>
        <h1>{en ? <>Sign in to your<br /><em>account.</em></> : <>Entre na sua<br /><em>conta.</em></>}</h1>
        <p>{en
          ? "Keep writing, track editorial review and update your contributor profile."
          : "Continue a escrever, acompanhe a revisão editorial e atualize o seu perfil de autor."}</p>
        <AuthForm mode="sign-in" locale={locale} />
        <p className="account-switch">{en ? "New to Kioo? " : "Ainda não tem conta? "}<Link href="/registar">{en ? "Create your contributor profile" : "Crie o seu perfil de autor"}</Link></p>
      </div>
    </section>
  );
}
