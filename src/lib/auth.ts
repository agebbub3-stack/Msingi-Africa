import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "@/lib/db";
import { sendTransactionalEmail } from "@/lib/email";
import { account, session, user, verification } from "@/lib/db/schema";
import { getSiteUrl } from "@/lib/site-url";

const secret = process.env.BETTER_AUTH_SECRET;
if (!secret || secret.length < 32) {
  throw new Error("BETTER_AUTH_SECRET must be configured with at least 32 characters.");
}

export const auth = betterAuth({
  appName: "Kioo Africa",
  baseURL: process.env.BETTER_AUTH_URL ?? getSiteUrl().origin,
  secret,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, session, account, verification },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user: accountUser, url }) => {
      await sendTransactionalEmail({
        to: accountUser.email,
        subject: "Redefinir a palavra-passe — Kioo Africa",
        html: `<p>Recebemos um pedido para redefinir a sua palavra-passe.</p><p><a href="${url}">Criar uma nova palavra-passe</a></p><p>Se não fez este pedido, ignore esta mensagem.</p>`,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user: accountUser, url }) => {
      await sendTransactionalEmail({
        to: accountUser.email,
        subject: "Confirme o seu e-mail — Kioo Africa",
        html: `<p>Confirme o seu endereço para ativar a sua conta.</p><p><a href="${url}">Confirmar o meu e-mail</a></p>`,
      });
    },
    autoSignInAfterVerification: true,
  },
  user: {
    additionalFields: {
      role: { type: "string", required: true, defaultValue: "user", input: false },
    },
  },
  trustedOrigins: [...new Set([
    getSiteUrl().origin,
    ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
    ...(process.env.NEXT_PUBLIC_SITE_URL ? [process.env.NEXT_PUBLIC_SITE_URL] : []),
  ])],
});
