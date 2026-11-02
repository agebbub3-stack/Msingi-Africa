import nodemailer, { type Transporter } from "nodemailer";

type EmailMessage = { to: string; subject: string; html: string };

let googleSmtpTransporter: Transporter | undefined;

function getGoogleSmtpTransporter() {
  const user = process.env.GOOGLE_SMTP_USER?.trim();
  const password = process.env.GOOGLE_SMTP_APP_PASSWORD?.replace(/\s/g, "");
  if (!user || !password) {
    throw new Error("GOOGLE_SMTP_USER and GOOGLE_SMTP_APP_PASSWORD must both be configured.");
  }
  googleSmtpTransporter ??= nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 10_000,
    auth: { user, pass: password },
  });
  return { transporter: googleSmtpTransporter, from: process.env.GOOGLE_SMTP_FROM?.trim() || `Kioo Africa <${user}>` };
}

export async function sendTransactionalEmail(message: EmailMessage) {
  const googleUser = process.env.GOOGLE_SMTP_USER?.trim();
  const googlePassword = process.env.GOOGLE_SMTP_APP_PASSWORD?.trim();
  if (googleUser || googlePassword) {
    const { transporter, from } = getGoogleSmtpTransporter();
    await transporter.sendMail({ from, ...message });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[development email] ${message.subject} -> ${message.to}\n${message.html}`);
      return;
    }
    throw new Error("RESEND_API_KEY and RESEND_FROM_EMAIL are required to send account emails.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, ...message }),
  });

  if (!response.ok) {
    console.error("Resend rejected an account email.", { status: response.status });
    throw new Error("The account email could not be delivered.");
  }
}
