type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export async function findFlutterwaveSubscriptionId(email: string, planId: string, secret: string) {
  const url = new URL("https://api.flutterwave.com/v3/subscriptions");
  url.searchParams.set("email", email);
  url.searchParams.set("plan", planId);
  url.searchParams.set("status", "active");
  url.searchParams.set("page", "1");
  const response = await fetch(url, {
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
    headers: { Authorization: `Bearer ${secret}` },
  });
  const payload: unknown = await response.json().catch((error: unknown) => {
    console.error("Flutterwave subscription lookup returned unreadable JSON.", error);
    return null;
  });
  if (!response.ok || !isRecord(payload) || !Array.isArray(payload.data)) {
    throw new Error(`Flutterwave subscription lookup failed with status ${response.status}.`);
  }

  const match = payload.data.find((item: unknown) => {
    if (!isRecord(item)) return false;
    const customer = isRecord(item.customer) ? item.customer : {};
    const plan = isRecord(item.plan) ? item.plan.id : item.plan;
    const customerEmail = customer.customer_email ?? customer.email;
    return String(plan ?? "") === planId &&
      typeof customerEmail === "string" &&
      customerEmail.toLowerCase() === email.toLowerCase() &&
      item.status === "active";
  });
  if (!isRecord(match) || !/^\d{1,20}$/.test(String(match.id ?? ""))) return null;
  return String(match.id);
}
