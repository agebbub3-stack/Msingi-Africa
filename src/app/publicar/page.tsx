import { PublishForm } from "./publish-form";
import { getLocale } from "@/lib/locale.server";

export default async function PublishPage() {
  const locale = await getLocale();
  return <PublishForm locale={locale} />;
}
