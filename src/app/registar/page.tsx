import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { getLocale } from "@/lib/locale.server";

export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: locale === "en" ? "Create a contributor account" : "Criar conta de autor",
    description: locale === "en"
      ? "Create your contributor profile and submit articles to the Kioo Africa newsroom."
      : "Crie o seu perfil de autor e submeta artigos à redação Kioo Africa.",
    robots: { index: false, follow: false },
  };
}

export default async function SignUpPage() {
  const locale = await getLocale();
  const en = locale === "en";
  return (
    <section className="account-page">
      <div className="account-card">
        <span className="section-kicker">{en ? "LOCAL VOICES, GLOBAL PERSPECTIVES" : "VOZES LOCAIS, PERSPETIVAS GLOBAIS"}</span>
        <h1>{en ? <>Share what<br /><em>you know.</em></> : <>Partilhe o que<br /><em>sabe.</em></>}</h1>
        <p>{en
          ? "Create a free account, prepare your story and follow every step of editorial review."
          : "Crie uma conta gratuita, prepare a sua história e acompanhe cada etapa da revisão editorial."}</p>
        <AuthForm mode="sign-up" locale={locale} />
        <p className="account-switch">{en ? "Already part of the community? " : "Já faz parte da comunidade? "}<Link href="/entrar">{en ? "Sign in to your account" : "Entre na sua conta"}</Link></p>
      </div>
    </section>
  );
}
