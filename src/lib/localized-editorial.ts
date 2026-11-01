import type { Article, Biography } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

type ArticleCopy = Pick<Article, "title" | "standfirst" | "imageAlt"> & {
  markdown?: string;
  personRole?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string[];
};
type BiographyCopy = Pick<Biography, "role" | "summary" | "spotlight"> & {
  portraitAlt?: string;
};

const englishArticles: Record<string, ArticleCopy> = {
  "softedge-ia-angolana-akira": {
    title: "SoftEdge Corporation and AKIRA: artificial intelligence built in Angola",
    standfirst: "From software engineering to the AKIRA assistant, the Luanda-based company presents digital products focused on Portuguese. Here is what official sources say — and what still needs to be assessed.",
    imageAlt: "Official AKIRA logo, an artificial intelligence assistant by SoftEdge",
    seoKeywords: ["SoftEdge Corporation", "AKIRA AI", "artificial intelligence in Angola", "Angolan AI", "Isaac Quarenta", "technology in Angola"],
  },
  "isaac-nascimento-quarenta": {
    title: "Isaac Nascimento Quarenta",
    standfirst: "A profile of the Angolan technology entrepreneur behind SoftEdge Corporation and the AKIRA AI assistant, based on public company and personal sources.",
    imageAlt: "SoftEdge Corporation logo, shown as a disclosed partner mark",
    personRole: "Technology entrepreneur and founder of SoftEdge Corporation",
    seoTitle: "Who is Isaac Quarenta? Biography, SoftEdge and AKIRA AI",
    seoDescription: "Meet Isaac Nascimento Quarenta, the Angolan entrepreneur behind SoftEdge Corporation and AKIRA, based on official company and public profiles.",
    seoKeywords: ["Isaac Quarenta", "Isaac Nascimento Quarenta", "SoftEdge Corporation", "AKIRA AI", "Angolan entrepreneur", "Who is Isaac Quarenta"],
  },
  "inclusao-digital-africa-uso-internet-movel": {
    title: "Africa's next digital frontier is turning coverage into usage",
    standfirst: "The GSMA estimates that nearly one billion people in Africa still do not use mobile internet. Device prices, digital skills and relevant content remain barriers between network coverage and meaningful access.",
    imageAlt: "Person using a mobile phone to access digital services",
  },
  "m-kopa-financiamento-smartphones-servicos-digitais": {
    title: "M-KOPA and the smartphone as a gateway to financial services",
    standfirst: "The model combines an upfront payment, frequent instalments and gradual access to services. Its inclusion potential also depends on transparency, total cost and consumer protection.",
    imageAlt: "Smartphone used to access digital services",
  },
  "logistica-saude-acesso-sangue": {
    title: "In healthcare, logistics can determine access",
    standfirst: "Blood safety depends on coordinated networks and timely delivery. LifeBank shows how technology and physical operations come together in healthcare.",
    imageAlt: "Healthcare professional working in a clinical setting",
  },
  "venture-capital-africa-2025-rondas-contexto": {
    title: "What Africa's 2025 tech investment figures reveal",
    standfirst: "Equity funding grew by 8%, while the number of deals rose by just 1%. The gap helps distinguish a recovery from a new expansion.",
    imageAlt: "Financial charts and indicators on an analytics screen",
  },
  "energia-solar-irrigacao-agricultura-africa": {
    title: "How can solar power support African agriculture?",
    standfirst: "Solar pumps and drip irrigation can reduce reliance on rainfall. Their impact depends on cost, water availability and support for farmers.",
    imageAlt: "Agricultural field under natural light",
  },
  "energia-limpa-africa-acesso-economico": {
    title: "Clean energy in Africa must also be affordable",
    standfirst: "The energy transition will only be inclusive if it expands modern access without overlooking price, infrastructure and development priorities.",
    imageAlt: "Wind turbines generating electricity across an open landscape",
  },
  "capital-africano-novas-rotas": {
    title: "African capital is finding new routes",
    standfirst: "Rather than chasing the next big investment, it is worth asking who is financing growth — and on what terms.",
    imageAlt: "Commercial buildings viewed from below in a city",
  },
  "angola-para-la-dos-recursos": {
    title: "Beyond resources: where Angola's next opportunities may emerge",
    standfirst: "Entrepreneurs and investors are looking towards new value chains. The first step is understanding local conditions.",
    imageAlt: "City skyline at dusk",
  },
  "criatividade-como-industria": {
    title: "African creativity deserves to be recognised as an industry",
    standfirst: "From music to design, talent crosses borders. The question is how to build sustainable businesses around that exchange.",
    imageAlt: "Audience gathered at a cultural event",
  },
  "talento-economia-digital": {
    title: "Talent is the invisible infrastructure of the digital economy",
    standfirst: "Technology and investment attract attention. The ability to develop, retain and support teams shapes what happens next.",
    imageAlt: "Team collaborating around a work table",
  },
};

const englishArticleBodies: Record<string, string> = {
  "inclusao-digital-africa-uso-internet-movel": `Expanding mobile networks is often presented as synonymous with digital inclusion. But coverage does not guarantee that someone has a compatible device, can afford access, or can find useful services and content in a language and context they understand.

## The gap between signal and use

In its *Mobile Economy Africa* report, GSMA says that nearly one billion people on the continent still do not use mobile internet despite available coverage. The organisation identifies barriers including the affordability of handsets, limited digital skills and a lack of relevant content.

The difference between being covered by a network and being able to use it regularly matters to businesses and governments. A policy that measures only installed towers may miss people still excluded by cost, literacy, accessibility or a lack of trust in digital services.

## What businesses can learn

For startups and service providers, designing for inclusion means understanding how customers earn income, which devices they can maintain and what tasks they want to accomplish. Payment plans, simple interfaces, local support and genuinely useful content can help — provided that total costs and terms are transparent.

GSMA estimates that mobile technologies and services contributed US$240 billion to Africa's economy in 2025, equivalent to 7.8% of the continent's GDP. The economic scale is significant; the editorial and business question is who can participate in that growth and what is needed to close the gap between potential access and practical benefit.

The figures cited are GSMA estimates and analysis, not independent measurements by Kioo Africa. Digital inclusion should be assessed not only by the number of connections, but also by the quality, price and usefulness of access.`,
  "m-kopa-financiamento-smartphones-servicos-digitais": `In many markets, owning a smartphone is a first step towards digital payments, information, work tools and financial services. The purchase price, however, can exclude people with irregular incomes or no formal credit history.

## Financing a device and building a relationship

M-KOPA describes its model as a combination of software, devices and distribution. According to the company, customers make an initial payment and pay the balance in frequent instalments; their payment history can then provide access to other products, such as digital credit, device protection, health cover and mobile data.

The company says it began in 2010 and operates in five African markets: Kenya, Uganda, Nigeria, Ghana and South Africa. Its impact page presents company-reported figures on customers, credit extended and connectivity. These figures come from the organisation itself and should be read accordingly, not as an independent audit.

## Convenience does not remove difficult questions

Payments aligned with the timing of income can lower the initial barrier to purchase. At the same time, any credit model must make sure customers understand the total price, fees, consequences of missed instalments, device-locking conditions and how their data is used.

Assessing a fintech's impact requires more than counting devices distributed or loans issued. It also matters whether the service improves people's ability to earn, whether its cost is sustainable for different customer groups and whether there are clear ways to resolve complaints.

M-KOPA illustrates a wider trend: African companies are bringing physical infrastructure, data and financial services together in a single customer journey. The outcome depends on local execution and rules that protect consumers as well as facilitate access.`,
  "logistica-saude-acesso-sangue": `When a hospital needs blood, medicine or equipment, having a supplier is not enough: a network must locate the right product, confirm availability and deliver it on time. Logistics is part of clinical infrastructure, even though it is often left out of conversations about healthcare innovation.

## A coordinated network, not just an app

The World Health Organization recommends coordinating blood collection, testing, processing, storage and distribution through integrated networks. In its update using 2023 data, WHO identified 36 countries in the African Region among the 55 countries that reported fewer than ten blood donations per thousand people. This indicator describes reported availability; on its own, it does not explain the causes in each country.

TED describes LifeBank as a company founded by Temie Giwa-Tubosun in 2016 to develop a healthcare supply chain, delivering to hospitals in Nigeria and Kenya. The profile mentions different forms of transport, including motorbikes, boats, trucks, tricycles and drones. This is an account of the operation presented by the organisation to TED, not an independent assessment of clinical outcomes.

## Technology connected to work on the ground

The example encourages us to look beyond software: inventory, communication with hospitals, product preservation, transport coordination and quality protocols all need to work together. A platform can improve the visibility of an order, but delivery also depends on teams, infrastructure and processes suited to each location.

Assessing initiatives like this means asking which products the network covers, how it verifies quality and chain of custody, which areas it can serve and what data supports impact claims. The central question is not only the speed of the technology, but the reliability of the system it helps coordinate.`,
  "venture-capital-africa-2025-rondas-contexto": `Funding volume is a useful but incomplete measure of an ecosystem's health. To understand whether a market is growing, it is also necessary to look at how many companies can raise capital, at what stages, in what deal sizes and across which countries and sectors.

## More capital, almost the same number of deals

In its *2025 Africa Tech Venture Capital Report*, Partech recorded US$2.4 billion in equity funding for African technology companies, an 8% increase on 2024. The number of deals was 462, just 1% above the previous year. According to the report, the difference mainly reflects larger average tickets, not a comparable rise in the number of transactions.

Partech describes 2025 as a period of normalisation after the correction that began in previous years. The report notes more growth-stage activity and a more balanced distribution of investment values, but also volatility during the year: the fourth quarter accounted for US$876 million in equity funding, while the pace and amounts varied between quarters.

## Read the aggregate with care

A continent-wide total does not show whether capital is accessible to early-stage companies, founders outside major hubs or sectors with longer return cycles. Nor does it replace information about survival, revenue, jobs created or financing terms.

Partech's report is a specialised and broad source on disclosed deals, but it remains a measurement built according to the organisation's own criteria. The cautious reading is that the market stopped contracting sharply in 2025; claiming that a new expansion cycle has begun requires more evidence and continued observation.`,
  "energia-solar-irrigacao-agricultura-africa": `How can solar power help smallholder farmers in Africa? One possible answer lies in systems that connect solar panels, water pumping and efficient irrigation. But installing equipment alone does not solve challenges around water access, finance, maintenance and selling crops.

## From energy to water on the farm

SunCulture presents off-grid solar systems that can combine water pumping, drip irrigation, lighting and phone charging. The company also offers an instalment payment option. These are features described by the organisation itself; outcomes vary by farm and should not be treated as universal guarantees.

The International Energy Agency highlights the connection between affordable energy, development and the transition to cleaner sources in its *Africa Energy Outlook 2022*. For a rural farm, electricity can support productive work, but a solution must fit the size of the operation, available water resources and the ability to pay for and maintain the system.

## The opportunity and limits of solar irrigation

Irrigation can reduce reliance on rainfall, but pumping water without proper management can also put pressure on aquifers and local sources. A responsible assessment considers where the water comes from, system efficiency, abstraction rules and the full costs of installation, financing and repairs.

Forbes' profile of Samir Ibrahim documents SunCulture's co-founding and the company's solar irrigation systems in a 2017 publication. The productivity and water-saving figures mentioned there were company-reported estimates at the time, not independent results or current metrics.

The business opportunity lies in combining suitable equipment, understandable credit, local technical support and sustainable water management. That combination — not solar technology alone — determines whether innovation can durably improve the lives and productivity of farmers.`,
  "energia-limpa-africa-acesso-economico": `What does a just energy transition in Africa mean? It means moving towards less polluting systems while expanding access to modern services and keeping energy financially affordable. There is no single solution for countries with very different grids, resources and needs.

## Access and decarbonisation must move together

The International Energy Agency frames the transformation of Africa's energy sector around goals that include universal access to modern, affordable services by 2030, infrastructure expansion and meeting national climate targets. *Africa Energy Outlook 2022* examines possible pathways, investment needs, financing and public-policy priorities.

In practice, the mix may include grid expansion, decentralised solutions, efficiency improvements and renewable sources, depending on local conditions. For households and small businesses, service reliability and price matter as much as the source of electricity.

## Questions for investors and policymakers

A project should be assessed by its total cost, the ability to operate and maintain equipment, the access it creates and how it distributes benefits and risks. It also matters whether communities took part in planning and how the project fits each country's energy and employment priorities.

The IEA report is a 2022 analysis, not an up-to-date statistical picture of 2026. Its value here is in framing the choices and trade-offs involved. Current figures for individual countries require recent national data.`,
  "capital-africano-novas-rotas": `Talking about investment in Africa as if it were one story hides what matters most: every market has its own rules, currencies, infrastructure and pace. Incoming capital is only half the conversation. The other half is understanding who can turn it into productive capacity — and on what terms.

## Context before the announcement

The 2025 edition of Partech's *Africa Tech Venture Capital Report* estimates that African technology startups raised US$4.1 billion in equity and debt. Debt reached US$1.6 billion, while equity funding amounted to US$2.4 billion. These figures describe the technology ecosystem tracked by the report — not all investment or every sector across the continent.

The distinction matters: debt and equity carry different costs, risks and expectations for founders. A funding round may signal confidence, but it does not, by itself, explain the health of a sector. It is worth examining where the capital comes from, its investment horizon and how a company earns revenue.

## Read multiple markets, not an average

The report attributes part of the total to large debt transactions and identifies geographic concentration among the leading ecosystems. A continent-wide figure therefore does not describe the experience of a startup in Luanda, Dakar or Kigali. National policy, currency, payments, logistics and local demand continue to determine which companies can grow.

## What to watch next

Local investors, regional funds, development banks and international partners play different roles. Tracking investment by country, sector, financial instrument and growth stage helps show who benefits — and what is still not being measured. The figures cited here are Partech estimates, not an independent measurement by Kioo Africa.`,
  "angola-para-la-dos-recursos": `Economic diversification is often presented as a destination. In practice, it is a sequence of decisions about infrastructure, talent, access to finance and the ability to connect producers with customers.

## Opportunity also depends on execution

Oil dependence continues to shape Angola's economy. In its 2026 overview, the World Bank estimates that the sector accounts for about 20% of GDP, 60% of fiscal revenue and 95% of exports. These indicators help explain why diversification requires more than identifying promising sectors: concrete barriers to production and the movement of goods must also be reduced.

Agriculture, logistics, financial services and creative industries may open space for new value chains. Potential, however, does not replace an analysis of costs, regulation and real demand in each province. The World Bank itself identifies agriculture and services — including logistics, communications and trade — among the expected drivers over the medium term.

## A long-term agenda

The same analysis projects growth of 4.5% in 2026, but a forecast is not a guaranteed outcome. Attracting productive investment requires predictability and collaboration between businesses, institutions and people already working in value chains. The stories worth following show how those relationships work — and what still needs to change.`,
  "criatividade-como-industria": `Music, audiovisual media, fashion and design are not only cultural expressions: they also involve intellectual property, jobs, technology and distribution chains. Treating these sectors as an economy means looking at the work that happens before and after the stage.

## Value that does not always show up

UNESCO estimates that film and audiovisual industries employ around five million people and contribute US$5 billion to Africa's GDP. The estimate refers to those specific sectors, not the entire creative economy. Rights, clear contracts, payment systems and access to new audiences continue to determine whether a work's circulation generates income for its creators.

For creative industries to grow, investment in training, infrastructure and comparable data matters. UNESCO's recommendations on audiovisual media also draw attention to skills, financing, distribution and public policy. Solutions need to listen to artists, producers and professionals who understand the challenges in each market.

## A conversation about business and culture

Looking at creativity as an industry does not diminish its cultural value. On the contrary, it helps explain the ecosystem that allows stories to travel, creators to earn and new possibilities to emerge across the continent.`,
  "talento-economia-digital": `It is easy to talk about innovation as if it begins with an app or a funding round. The decisive part is often less visible: people who learn, adapt tools and make a product useful in their own context.

## Capabilities that last

Technical training matters, but it is not enough. Strong teams need management experience, ways to share knowledge and environments where they can experiment without losing sight of customers' needs.

An empirical Brookings analysis measures digitalisation across five dimensions, including skills, infrastructure, finance and digital platforms. The study also compares gaps between countries instead of treating the continent as a uniform market. Those contextual differences matter to governments and employers alike.

When companies invest in local talent, the benefits can cross sectors: more capable suppliers, new services and a greater accumulation of knowledge. Measuring these effects helps move beyond counting advertised vacancies. The findings cited are from the Brookings analysis and its authors, not original research by Kioo Africa.`,
  "softedge-ia-angolana-akira": `SoftEdge Corporation presents itself as an Angolan technology company, founded in Luanda in 2023, working in software development, digital products and artificial intelligence. One of the projects it highlights is AKIRA, an assistant created by the company. Product descriptions in this article are attributed to official pages; this is not an independent technical assessment.

## What is SoftEdge Corporation?

According to its company page, SoftEdge develops web and mobile applications, business systems, integrations and artificial intelligence solutions. Its website identifies Isaac Nascimento Quarenta as founder and CEO. The company also publishes its own timeline of activity since 2023; promotional figures on the site are not repeated here because they could not be independently confirmed.

## What is AKIRA AI?

SoftEdge describes AKIRA as an artificial intelligence assistant created in Angola. Its public product description highlights conversations in Portuguese and an understanding of local context. The product page also lists document and image analysis, image generation, web search, and task organisation with conversation history. These are features advertised by the provider, not results tested by the newsroom.

## Why a Portuguese-language experience matters

A Portuguese-language interface may make an initial interaction with AI tools easier for people who work, study or run a business in that language. That alone does not guarantee accuracy or suitability for every African context: languages, connectivity, devices, costs and needs vary across communities and countries. A tool's usefulness depends on the real experience of the people using it.

## What should people assess before using an AI assistant?

Businesses and users should check what data is sent, how it is stored, who can access it and what controls are available to delete it. It is also sensible to confirm important answers against independent sources and avoid sending confidential documents without understanding the service terms. These are general recommendations for AI tools, not claims about AKIRA's specific practices.

## What is known about the Kioo–SoftEdge partnership?

Kioo Africa says SoftEdge collaborated on software development for the group under a complimentary plan. This profile is therefore identified as a partnership feature. The publication does not present the collaboration as a purchase of a premium package or assign it a monetary value.`,
  "isaac-nascimento-quarenta": `## Who is Isaac Quarenta?

Isaac Nascimento Quarenta, professionally known as Isaac Quarenta, is an Angolan technology entrepreneur and the founder of SoftEdge Corporation. The company's website, based in Luanda, identifies him as founder and CEO. On his public GitHub profile, he describes himself as a full-stack developer and Computer Science student in Angola.

## Background and education

Biographical information supplied by Isaac to the newsroom states that he was born in Luanda, Angola, on 21 March 2007. No independent public source confirming this date was located. His GitHub profile describes his education as Computer Science studies and his work as building modern, scalable and maintainable applications.

## SoftEdge Corporation

SoftEdge describes itself as an Angolan technology company founded in Luanda in 2023, working in software, digital products and artificial intelligence. Its company pages list web and mobile development, business systems, integrations and digital consultancy. The timeline and metrics on the site are company statements; this profile does not treat them as independently verified indicators.

## AKIRA and artificial intelligence in Portuguese

Among the projects associated with Isaac, SoftEdge highlights AKIRA, an artificial intelligence assistant created in Angola. The product page advertises conversations in Portuguese, document and image analysis, image generation, web search, and task organisation with conversation history. These capabilities are described by the company and the AKIRA website, without an independent technical assessment from the newsroom.

## Public presence and professional journey

Isaac maintains a GitHub profile with information about his development work and an X profile associated with SoftEdge. His public journey brings together software development, business leadership and the creation of an AI product. As this is an evolving career, this profile distinguishes autobiographical information, company statements and advertised product features from claims that would require independent confirmation.`,
};

const englishSourceLabels: Record<string, string> = {
  "Quem somos — SoftEdge Corporation": "About us — SoftEdge Corporation",
  "AKIRA: a IA oficial da SoftEdge": "AKIRA: SoftEdge's official AI",
  "AKIRA — assistente de inteligência artificial": "AKIRA — artificial intelligence assistant",
  "Quem somos — Isaac Nascimento Quarenta": "About us — Isaac Nascimento Quarenta",
  "Perfil e descrição profissional de Isaac Quarenta": "Isaac Quarenta's profile and professional description",
  "Isaac Quarenta no X": "Isaac Quarenta on X",
  "Agência Internacional de Energia": "International Energy Agency",
  "Organização Mundial da Saúde": "World Health Organization",
  "Banco Mundial": "World Bank",
  "Angola: visão geral económica": "Angola: economic overview",
  "UNESCO destaca o potencial de crescimento da indústria cinematográfica africana": "UNESCO highlights the growth potential of Africa's film industry",
  "Relatório sobre a indústria cinematográfica em África": "Report on Africa's film industry",
};

const englishBiographies: Record<string, BiographyCopy> = {
  "isaac-nascimento-quarenta": {
    role: "Technology entrepreneur and founder of SoftEdge Corporation",
    summary: "Angolan developer and founder of SoftEdge Corporation, Isaac Quarenta works on software development and AKIRA, an artificial intelligence assistant created in Angola.",
    spotlight: "He founded SoftEdge Corporation in Luanda and leads the company behind AKIRA, an artificial intelligence assistant in Portuguese.",
  },
  "nelly-cheboi": {
    role: "Founder of TechLit Africa",
    summary: "The Kenyan software engineer founded an initiative that brings refurbished computers and digital skills classes to rural schools.",
    spotlight: "She founded an initiative equipping rural schools with computer labs, regular digital classes and local teachers.",
    portraitAlt: "Nelly Cheboi on stage after receiving the CNN Hero of the Year award",
  },
  "rebecca-enonchong": {
    role: "Founder of AppsTech",
    summary: "One of the best-known advocates for African technology entrepreneurship.",
    spotlight: "She founded AppsTech in 1999. The company describes an international enterprise technology operation serving customers in more than 50 countries.",
    portraitAlt: "Rebecca Enonchong at a UNCTAD event in 2019",
  },
  "bethlehem-tilahun-alemu": {
    role: "Founder of soleRebels",
    summary: "She turned local craftsmanship and materials into an Ethiopian brand with international ambitions.",
    spotlight: "She founded soleRebels in 2005, connecting Ethiopian craftsmanship with an ambitious international footwear brand.",
    portraitAlt: "Bethlehem Tilahun Alemu interviewed by NdaniTV",
  },
  "mo-abudu": {
    role: "Founder of EbonyLife",
    summary: "She built a media platform that puts African stories at the centre of the conversation.",
    spotlight: "She founded EbonyLife, a television and film platform dedicated to producing and sharing African stories.",
    portraitAlt: "Mo Abudu in a 2010 portrait",
  },
  "temie-giwa-tubosun": {
    role: "Founder of LifeBank",
    summary: "She built a healthcare supply company that coordinates the delivery of essential products to hospitals.",
    spotlight: "She founded LifeBank in 2016 to connect hospitals with essential products through a distribution operation combining technology and logistics.",
  },
  "iyinoluwa-aboyeji": {
    role: "Technology entrepreneur and co-founder",
    summary: "He helped build African technology companies including Andela and Flutterwave, focused on talent and digital payments.",
    spotlight: "A Forbes profile records his work co-founding startups and launching Flutterwave in 2017, connecting technology talent and digital payments.",
  },
  "samir-ibrahim": {
    role: "Co-founder and CEO of SunCulture",
    summary: "He helps develop solar-powered pumping and irrigation systems designed for the everyday challenges facing smallholder farmers.",
    spotlight: "He co-founded a company combining solar power, water pumping and irrigation solutions for farms.",
  },
};

const englishMonths: Record<string, string> = {
  jan: "Jan",
  fev: "Feb",
  mar: "Mar",
  abr: "Apr",
  mai: "May",
  jun: "Jun",
  jul: "Jul",
  ago: "Aug",
  set: "Sep",
  out: "Oct",
  nov: "Nov",
  dez: "Dec",
};

function localizeDate(date: string) {
  return date.replace(
    /\b(\d{1,2})\s+(jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)\.\s+(\d{4})\b/i,
    (_, day: string, month: string, year: string) =>
      `${englishMonths[month.toLowerCase()]} ${Number(day)}, ${year}`,
  );
}

export function localizeArticle(article: Article, locale: Locale): Article {
  if (locale !== "en") return article;
  const copy = englishArticles[article.slug];
  if (!copy) return article;
  return {
    ...article,
    ...copy,
    ...(englishArticleBodies[article.slug] ? { markdown: englishArticleBodies[article.slug] } : {}),
    ...(article.partnerName
      ? {
          sponsorDisclosure:
            "Partnership disclosed: according to Kioo Africa, SoftEdge contributed to software development for the group under its complimentary plan. This is not presented as a paid premium package.",
        }
      : {}),
    ...(article.sources
      ? {
          sources: article.sources.map((source) => ({
            ...source,
            title: englishSourceLabels[source.title] ?? source.title,
            publisher: source.publisher ? englishSourceLabels[source.publisher] ?? source.publisher : null,
          })),
        }
      : {}),
    author: article.author === "Redação Kioo" ? "Kioo Africa Editorial" : article.author,
    date: localizeDate(article.date),
  };
}

export function hasEnglishArticleCopy(slug: string) {
  return slug in englishArticles;
}

export function localizeBiography(profile: Biography, locale: Locale): Biography {
  if (locale !== "en") return profile;
  const copy = englishBiographies[profile.slug];
  if (!copy) return profile;
  const { portraitAlt, ...localizedCopy } = copy;
  return {
    ...profile,
    ...localizedCopy,
    portrait: profile.portrait && portraitAlt
      ? { ...profile.portrait, alt: portraitAlt }
      : profile.portrait,
  };
}

export function hasEnglishBiographyCopy(slug: string) {
  return slug in englishBiographies;
}
