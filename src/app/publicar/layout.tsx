import type { Metadata } from "next";
import { getLocale } from "@/lib/locale.server";
import { createPageMetadata } from "@/lib/page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const en = locale === "en";
  return {
    ...createPageMetadata({
      locale,
      kind: "publish",
      path: "/publicar",
      eyebrow: en ? "PITCH · PROPOSE · PARTNER" : "PROPOR · SUGERIR · COLABORAR",
      title: en ? "Pitch a story to Kioo Africa" : "Propor um artigo ou perfil",
      description: en
        ? "Pitch an article, suggest a biography, or discuss clearly labelled sponsored content with the Kioo Africa newsroom."
        : "Envie uma proposta editorial ou converse com a equipa da Kioo Africa sobre conteúdo patrocinado identificado com transparência.",
    }),
    robots: { index: false, follow: true },
  };
}

export default function PublishLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
