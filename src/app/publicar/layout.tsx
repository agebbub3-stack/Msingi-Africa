import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Propor um artigo ou perfil",
  description: "Envie uma proposta editorial à equipa da Kioo Africa para análise e revisão.",
  alternates: { canonical: "/publicar" },
  robots: { index: false, follow: true },
};

export default function PublishLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
