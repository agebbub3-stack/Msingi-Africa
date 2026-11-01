export const promotionPackages = [
  {
    id: "sponsored-note",
    name: "Nota de marca",
    price: 99,
    description: "Uma apresentação patrocinada da sua marca.",
    includes: ["Formato curto patrocinado", "Uma imagem fornecida pelo cliente", "Identificação visível como patrocinado"],
  },
  {
    id: "sponsored-story",
    name: "História patrocinada",
    price: 249,
    description: "Um artigo de marca apresentado com transparência.",
    includes: ["Artigo patrocinado até 800 palavras", "Página de conteúdo no site", "Identificação e divulgação da parceria"],
    featured: true,
  },
  {
    id: "sponsored-feature",
    name: "Destaque de campanha",
    price: 499,
    description: "Uma campanha patrocinada com distribuição alargada.",
    includes: ["Artigo patrocinado até 800 palavras", "Destaque na newsletter", "Espaço de campanha por sete dias"],
  },
] as const;

export type PromotionPackage = (typeof promotionPackages)[number];
export type PromotionPackageId = PromotionPackage["id"];

export function getPromotionPackage(id: string): PromotionPackage | undefined {
  return promotionPackages.find((promotion) => promotion.id === id);
}
