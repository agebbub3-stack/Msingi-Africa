type EmailMessage = { to: string; subject: string; html: string };

export async function sendTransactionalEmail(message: EmailMessage) {
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
