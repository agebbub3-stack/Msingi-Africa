import type { PublicEntity } from "@/lib/public-content";
import type { Locale } from "@/lib/i18n";

const englishDescriptions: Record<string, string> = {
  "msingi-africa": "Independent editorial and research group focused on African people, ideas and markets.",
  "creator-plus": "Monthly plan for contributors who need to include links and verifiable sources in their editorial submissions.",
  lifebank: "Healthcare supply company coordinating the delivery of essential products to hospitals.",
  andela: "Global network connecting technology professionals with opportunities and company teams.",
  flutterwave: "Financial technology company focused on payments for businesses operating in African markets.",
  sunculture: "Climate technology company combining solar power, water pumping and irrigation for farmers.",
  "softedge-corporation": "Angolan technology company whose official site describes work in software, digital products and artificial intelligence. Kioo coverage profiles the company, its founder and AKIRA.",
  akira: "AI assistant that SoftEdge describes as developed in Angola and focused on Portuguese-language use. Its public product page lists document and image analysis, web search and task organisation.",
};

export function localizeEntity(entity: PublicEntity, locale: Locale): PublicEntity {
  if (locale !== "en") return entity;
  const description = englishDescriptions[entity.slug]
    ?? (entity.type === "person"
      ? "Explore this person's profile, background and related stories."
      : "Explore this organisation's profile, official information and related stories.");
  return { ...entity, description };
}
