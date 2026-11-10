import type { Article, Biography } from "@/lib/content";
import { localizeCategory, localizeCountry, type Locale } from "@/lib/i18n";

type ArticleCopy = Pick<Article, "title" | "standfirst" | "imageAlt"> & {
  markdown?: string;
  personRole?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string[];
};
type BiographyCopy = Pick<Biography, "role" | "summary" | "spotlight"> & {
  name?: string;
  portraitAlt?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
};

const englishArticles: Record<string, ArticleCopy> = {
  "softedge-ia-angolana-akira": {
    title: "SoftEdge Corporation and AKIRA: artificial intelligence built in Angola",
    standfirst: "From software engineering to the AKIRA assistant, the Luanda-based company presents digital products focused on Portuguese. Here is what official sources say — and what still needs to be assessed.",
    imageAlt: "Official AKIRA logo, an artificial intelligence assistant by SoftEdge",
    seoDescription: "An editorial overview of SoftEdge Corporation and AKIRA, with information attributed to public company sources and clear limits on what has not been independently verified.",
    seoKeywords: ["SoftEdge Corporation", "AKIRA AI", "artificial intelligence in Angola", "Angolan AI", "Isaac Quarenta", "José Lopes SoftEdge", "Stefânio Costa SoftEdge", "Tiago Rodrigues SoftEdge", "technology in Angola"],
  },
  "isaac-nascimento-quarenta": {
    title: "Isaac Nascimento Quarenta",
    standfirst: "An editorial profile of the Angolan technology entrepreneur, based on public company and personal sources.",
    imageAlt: "Editorial profile of Angolan technology entrepreneur Isaac Nascimento Quarenta",
    personRole: "Technology entrepreneur and founder of SoftEdge Corporation",
    seoTitle: "Isaac Nascimento Quarenta: an Angolan technology profile",
    seoDescription: "An editorial profile of Isaac Nascimento Quarenta, based on public professional and company sources, with unverified details clearly distinguished.",
    seoKeywords: ["Isaac Quarenta", "Isaac Nascimento Quarenta", "SoftEdge Corporation", "AKIRA AI", "Angolan entrepreneur", "Who is Isaac Quarenta"],
  },
  "angola-crescimento-economico-emprego-2026": {
    title: "Angola is growing in 2026, but jobs remain the decisive test",
    standfirst: "The African Development Bank reported faster economic activity in the first half of the year. Employment, informality and poverty data show why growth and better living conditions are not the same measure.",
    imageAlt: "Commercial buildings in an African city",
    seoTitle: "Angola in 2026: growth, employment and diversification",
    seoDescription: "A reading of 2026 data on Angola's growth, inflation, youth employment and economic diversification, with sources from the African Development Bank and World Bank.",
    seoKeywords: ["Angola economy 2026", "Angola economic growth", "youth employment Angola", "Angola economic diversification", "African Development Bank", "World Bank Angola"],
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
  "afcfta-integracao-mercados-africanos": {
    title: "AfCFTA: turning trade integration into local opportunities",
    standfirst: "The continental agreement creates a framework for deeper trade between African countries. Its implementation depends on clear rules, logistics, payments and productive capacity.",
    imageAlt: "Commercial buildings in an African city",
    seoTitle: "AfCFTA: trade integration across African countries",
    seoDescription: "What AfCFTA could change in African trade, and which logistical, regulatory and financing barriers still need attention.",
    seoKeywords: ["AfCFTA", "intra-African trade", "African market", "African economic integration", "African Continental Free Trade Area"],
  },
  "desert-to-power-energia-solar-sahel": {
    title: "Desert to Power: the Sahel's solar ambition and the work ahead",
    standfirst: "The African Development Bank initiative sets a 10 GW solar-power target for 2030. It is a long-term goal, not capacity already installed.",
    imageAlt: "Solar panels under intense sunlight",
    seoTitle: "Desert to Power: solar energy and development in the Sahel",
    seoDescription: "The African Development Bank's Desert to Power initiative aims to mobilise 10 GW of solar capacity in the Sahel by 2030.",
    seoKeywords: ["Desert to Power", "solar energy in the Sahel", "African Development Bank", "electricity in Africa", "African renewable energy"],
  },
  "africa-cdc-seguranca-sanitaria-capacidade-local": {
    title: "Health security in Africa starts with local public capacity",
    standfirst: "Africa CDC highlights surveillance, health institutions and coordinated response. Lasting preparedness requires funding, community trust and transparency.",
    imageAlt: "Health professionals in a clinical setting",
    seoTitle: "Africa CDC and health security in Africa",
    seoDescription: "An analysis of surveillance, health-system capacity and continental cooperation, based on Africa CDC's public mandate.",
    seoKeywords: ["Africa CDC", "public health in Africa", "African health security", "epidemic preparedness", "African health systems"],
  },
  "ashesi-educacao-lideranca-empreendedorismo-africa": {
    title: "Ashesi and the ambition to educate entrepreneurial African leaders",
    standfirst: "The Ghanaian university presents ethics, entrepreneurship and leadership as pillars of its mission. The challenge is turning educational ambition into access and lasting outcomes.",
    imageAlt: "Students on a university campus",
    seoTitle: "Ashesi University: education, leadership and innovation in Africa",
    seoDescription: "Ashesi University's educational model in Ghana emphasises ethical leadership and entrepreneurship, with Patrick Awuah as its founder.",
    seoKeywords: ["Ashesi University", "higher education in Ghana", "Patrick Awuah", "African entrepreneurship", "ethical leadership in Africa"],
  },
  "industria-africana-valor-acrescentado-producao-local": {
    title: "Local production in Africa: jobs, scale and difficult questions",
    standfirst: "Industrialisation is often framed around value addition and jobs. Regional conglomerates also raise questions about competition, costs and impact.",
    imageAlt: "Industrial production facility",
    seoTitle: "African industrialisation: local production and value addition",
    seoDescription: "What local production can mean for jobs and value chains, and which evidence helps assess its results.",
    seoKeywords: ["industrialisation in Africa", "African local production", "value addition", "industrial employment", "Dangote Group"],
  },
  "ngozi-okonjo-iweala": {
    title: "Ngozi Okonjo-Iweala",
    standfirst: "A profile of the Nigerian economist whose career spans public finance, development and international trade.",
    imageAlt: "Biographical profile of Ngozi Okonjo-Iweala",
    personRole: "Economist and international leader",
    seoTitle: "Ngozi Okonjo-Iweala: economics and global leadership",
    seoDescription: "A profile of Nigerian economist Ngozi Okonjo-Iweala, whose career includes leading the World Trade Organization.",
    seoKeywords: ["Ngozi Okonjo-Iweala", "African women economists", "international trade", "Nigeria", "World Trade Organization"],
  },
  "aliko-dangote": {
    title: "Aliko Dangote",
    standfirst: "A Nigerian businessman associated with the expansion of industrial operations in cement, food and energy.",
    imageAlt: "Biographical profile of Aliko Dangote",
    personRole: "Founder of Dangote Group",
    seoTitle: "Aliko Dangote: industry and local production in Africa",
    seoDescription: "A profile of Aliko Dangote and the industrial strategy of the group he founded, distinguishing company statements from independent findings.",
    seoKeywords: ["Aliko Dangote", "Dangote Group", "African business leaders", "industry in Nigeria", "local production in Africa"],
  },
  "vera-songwe": {
    title: "Vera Songwe",
    standfirst: "A Cameroonian economist whose career includes roles at the World Bank, IFC and the United Nations Economic Commission for Africa.",
    imageAlt: "Biographical profile of Vera Songwe",
    personRole: "Economist and development specialist",
    seoTitle: "Vera Songwe: economics and finance for Africa",
    seoDescription: "A profile of economist Vera Songwe, focusing on her experience in development, fiscal policy and sustainable finance.",
    seoKeywords: ["Vera Songwe", "African women economists", "climate finance", "Economic Commission for Africa", "African development"],
  },
  "patrick-awuah": {
    title: "Patrick Awuah",
    standfirst: "A Ghanaian entrepreneur and educator associated with founding Ashesi University and its mission to develop ethical, entrepreneurial leaders.",
    imageAlt: "Biographical profile of Patrick Awuah",
    personRole: "Founder of Ashesi University",
    seoTitle: "Patrick Awuah: education and leadership in Ghana",
    seoDescription: "Meet Patrick Awuah, founder of Ashesi University, and the educational mission connecting ethical leadership with entrepreneurship.",
    seoKeywords: ["Patrick Awuah", "Ashesi University", "education in Ghana", "African entrepreneurship", "ethical leadership"],
  },
  "abdulrazak-gurnah": {
    title: "Abdulrazak Gurnah",
    standfirst: "The Zanzibar-born writer and Nobel laureate explores colonialism, displacement and the experience of living between cultures.",
    imageAlt: "Biographical profile of Abdulrazak Gurnah",
    personRole: "Writer and Nobel Prize laureate in Literature",
    seoTitle: "Abdulrazak Gurnah: literature, memory and displacement",
    seoDescription: "A profile of writer Abdulrazak Gurnah, the 2021 Nobel Prize in Literature laureate born in Zanzibar, Tanzania.",
    seoKeywords: ["Abdulrazak Gurnah", "2021 Nobel Prize in Literature", "African literature", "Zanzibar", "Tanzanian writers"],
  },
};

const englishArticleBodies: Record<string, string> = {
  "angola-crescimento-economico-emprego-2026": `Angola's economy accelerated in the first half of 2026, but the indicators do not tell the same story. The African Development Bank (AfDB) reported real growth of 7.15% over the six-month period, while poverty, youth employment and informality continue to limit how widely the gains are shared.

## Acceleration concentrated in non-oil activity

In an update published on 5 October 2026, AfDB attributed first-half growth mainly to the non-oil sector, which expanded by 9.24%, alongside a 5.64% recovery in oil activity. The institution reported different year-on-year quarterly rates: 5.32% in the first quarter and 8.74% in the second. These are different measures and periods, and should not be confused with the cumulative first-half rate.

## Lower inflation does not by itself ease pressure on households

AfDB recorded inflation at 8.78% in August 2026, down from 28.2% in 2024. The decline may ease pressure on purchasing power, but it does not mean prices have returned to earlier levels or describe the cost of living for every household. The institution also points to differences between economic activity and consumers' lived experience.

## Employment: growth without enough formal jobs

AfDB estimates youth unemployment at 43.3% and informal work at 78.6% of total employment in 2025. These indicators refer to specific groups and periods. The World Bank, by comparison, reports an overall unemployment rate of 21.5% in the second quarter of 2026. The overall and youth rates are not directly comparable, but both help explain why stable job creation matters when assessing the recovery.

## Diversification remains a process, not a guaranteed outcome

The World Bank estimates that oil accounts for around 20% of Angola's GDP, 60% of government revenue and 95% of exports. Growth in non-oil activity matters, but reliance on exports and public revenue leaves the country vulnerable to external shocks. Agriculture, industry, trade and logistics may contribute to diversification; outcomes depend on investment, productivity, infrastructure and jobs.

The figures in this article are data and estimates published by AfDB and the World Bank, not original research by Kioo Africa. Methodologies, reference dates and revisions may differ. Assessing the recovery requires tracking not only GDP and inflation but also incomes, formal employment, regional inequality and access to services.`,
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

## Who is listed on the SoftEdge team?

The company page identifies Isaac Quarenta as founder and CEO, and lists José Lopes as CTO, Stefânio Costa as Lead Developer, and Tiago Rodrigues in DevOps & Security. The source does not describe the latter three as co-founders, so this article uses the roles published by SoftEdge rather than assigning them that title.

## What is AKIRA AI?

SoftEdge describes AKIRA as an artificial intelligence assistant created in Angola. Its public product description highlights conversations in Portuguese and an understanding of local context. The product page also lists document and image analysis, image generation, web search, and task organisation with conversation history. These are features advertised by the provider, not results tested by the newsroom.

## Why a Portuguese-language experience matters

A Portuguese-language interface may make an initial interaction with AI tools easier for people who work, study or run a business in that language. That alone does not guarantee accuracy or suitability for every African context: languages, connectivity, devices, costs and needs vary across communities and countries. A tool's usefulness depends on the real experience of the people using it.

## What should people assess before using an AI assistant?

Businesses and users should check what data is sent, how it is stored, who can access it and what controls are available to delete it. It is also sensible to confirm important answers against independent sources and avoid sending confidential documents without understanding the service terms. These are general recommendations for AI tools, not claims about AKIRA's specific practices.`,
  "isaac-nascimento-quarenta": `## Who is Isaac Quarenta?

Isaac Nascimento Quarenta, professionally known as Isaac Quarenta, is an Angolan technology entrepreneur and the founder of SoftEdge Corporation. The company's website, based in Luanda, identifies him as founder and CEO. On his public GitHub profile, he describes himself as a full-stack developer and Computer Science student in Angola.

## Career and education

On his public GitHub profile, Isaac describes himself as a full-stack developer and Computer Science student in Angola. This is autobiographical information; no independent source was located to confirm further details about his education or professional history.

## SoftEdge Corporation

SoftEdge describes itself as an Angolan technology company founded in Luanda in 2023, working in software, digital products and artificial intelligence. Its company pages list web and mobile development, business systems, integrations and digital consultancy. The timeline and metrics on the site are company statements; this profile does not treat them as independently verified indicators.

## AKIRA and artificial intelligence in Portuguese

Among the projects associated with Isaac, SoftEdge highlights AKIRA, an artificial intelligence assistant created in Angola. The product page advertises conversations in Portuguese, document and image analysis, image generation, web search, and task organisation with conversation history. These capabilities are described by the company and the AKIRA website, without an independent technical assessment from the newsroom.

## Public presence and professional journey

Isaac's public GitHub and X profiles provide information about his professional and company activity. This profile distinguishes autobiographical information, company statements and advertised product features from claims that would require independent confirmation.`,
  "afcfta-integracao-mercados-africanos": `The African Continental Free Trade Area (AfCFTA) is an African Union economic integration agreement. Its goal is to reduce barriers to trade between African countries and support the movement of goods, services and investment. The official portal includes areas such as digital trade and investment protection within the agreement's agenda.

## An agreement is not yet a borderless market

A continental framework does not automatically remove differences in customs procedures, documentation, product standards, rules of origin and port processes. For an exporting business, the actual cost also depends on reliable transport, access to foreign currency, cross-border payments and up-to-date information about requirements in the destination country.

## Continental scale starts with local decisions

Small and medium-sized businesses need to know where to find buyers, how to certify products and what costs to expect before investing in expansion. Chambers of commerce, trade associations and public agencies can make the rules easier to understand, but implementation varies by country and should be assessed with national data.

## What to watch next

AfCFTA identifies digital trade and investment as areas of work. The practical impact will depend on enforceable rules, infrastructure, competition and dispute-resolution mechanisms. A responsible reading distinguishes the agreement's goals and institutional framework from outcomes that still need to be measured.

Integration can widen opportunities, but it does not by itself guarantee that gains will be shared fairly. Businesses, workers and governments will need to track who can access new markets, which sectors face adjustment costs and whether value is retained in local economies.`,
  "desert-to-power-energia-solar-sahel": `The African Development Bank describes the Desert to Power initiative as an effort to harness the solar potential of Sahel countries. Its stated goal is to mobilise 10 gigawatts of solar generation capacity by 2030 through public and private projects, both on-grid and off-grid.

## A target that depends on complete systems

Panels and power plants are only part of the infrastructure. Electricity must reach users through grids, mini-grids or decentralised solutions that can be maintained. The effort also requires procurement rules, sustainable financing, storage, grid management and local technical capacity.

## What the target does not mean

The 10 GW figure is a 2030 goal announced by the bank, not a claim that this capacity has already been built or is operating. The institutional page brings together different kinds of projects; tracking delivery requires country-level updates, approved financing, completed construction and electricity actually supplied.

## Benefits and safeguards

Solar projects can help increase energy supply, but their value depends on cost, reliability and fit with community needs. Assessment should consider land use, local consultation, hiring and training, equipment maintenance, and the final price for households and businesses.

The Sahel's energy transition is not simply a choice of technology. The challenge is to turn potential and investment into reliable services without confusing announcements, targets and results. The African Development Bank is the source for the target cited here; this analysis is not an independent audit of the portfolio.`,
  "africa-cdc-seguranca-sanitaria-capacidade-local": `Africa CDC is the African Union's public health agency. It describes its work as strengthening the capacity of health services and institutions to detect and respond to threats, through data-led interventions and cooperation between countries.

## Preparedness that works between crises

Disease surveillance, laboratories, response teams and public communication need to function before an emergency. When these capabilities depend only on temporary funding, continuity can be lost between outbreaks. Investing in health systems includes training, maintenance, usable data and conditions that help health professionals remain in service.

## Regional production and access

Africa CDC also highlights the Partnerships for African Vaccine Manufacturing (PAVM) in its institutional work. Developing regional manufacturing capacity is both an industrial and a public-health issue: it requires regulatory quality, research, predictable investment, sustainable procurement and supply chains. The existence of an initiative does not, by itself, prove that these barriers have been resolved.

## Trust and accountability

An effective response depends on clear information, community participation and trust in services. Transparency about funding, outcomes and limitations helps distinguish confirmed data from projections or institutional statements. Needs and risks vary by country, so a continental initiative does not replace guidance from local health authorities.

This analysis describes the mandate and priorities published by Africa CDC; it is not medical advice or an epidemiological bulletin. For current alerts and recommendations, consult Africa CDC and your country's health authorities.`,
  "ashesi-educacao-lideranca-empreendedorismo-africa": `Ashesi University in Ghana presents the education of ethical and entrepreneurial leaders as part of its mission. The Ashesi Foundation's institutional page identifies Patrick Awuah as its founder and president and connects the organisation's work with supporting the university's educational mission.

## From education to problem-solving capacity

The idea of combining technical knowledge, ethics and enterprise addresses a practical question: how can students be prepared to create value in diverse economic and social contexts? Curriculum, campus experience, employer links and the ability to afford education all shape both the student experience and opportunities after graduation.

## What needs to be measured

Institutional ambition should be assessed against verifiable indicators: access for students from different backgrounds, course completion, employment and entrepreneurship after graduation, teaching quality and financial sustainability. A narrative of innovation does not replace evidence about these outcomes.

## A conversation about what can be replicated

Educational models do not transfer automatically from one country to another. Scale depends on teachers, accreditation, funding, infrastructure and local priorities. Ashesi's experience can inform debate about African higher education when examined in context, without assuming there is one formula for the continent.

The source used here is institutional and describes the foundation's mission and leadership. Kioo Africa has not independently assessed Ashesi's academic outcomes; impact data should be checked against official publications and independent studies.`,
  "industria-africana-valor-acrescentado-producao-local": `Producing locally goods that were previously imported can develop skills, suppliers and jobs, but the effect depends on the sector, production costs and access to markets. Dangote Group describes its strategy as focused on local production of essential goods and industrial operations across several sectors. This is the company's position, not an independent impact assessment.

## Business scale and value chains

Large-scale industrial operations can require reliable energy, transport, long-term financing and suppliers able to meet consistent standards. Sourcing raw materials locally and developing suppliers can distribute some value through the economy; there may also be import dependence, market concentration or costs passed on to consumers.

## The continental market as an opportunity

AfCFTA aims to reduce barriers to trade between countries and could expand the potential market for African businesses. Turning that potential into sales still depends on rules of origin, customs, logistics, payments and technical standards. A factory being located on the continent does not automatically mean its products can move easily across it.

## How to assess impact

A full analysis asks how many jobs were created and on what terms, what share of inputs is sourced locally, what taxes are paid, how prices and competition change, and what the environmental costs are. Corporate statements and public targets are starting points; verification requires comparable data and independent sources.

Industrialisation is not just about building factories. It connects production, skills, infrastructure, competition and environmental responsibility to measurable outcomes. This article summarises a business perspective and AfCFTA's framework without presenting promotional claims as verified facts.`,
};

const englishSourceLabels: Record<string, string> = {
  "Banco Africano de Desenvolvimento": "African Development Bank",
  "Banco Mundial": "World Bank",
  "Quem somos — SoftEdge Corporation": "About us — SoftEdge Corporation",
  "AKIRA: a IA oficial da SoftEdge": "AKIRA: SoftEdge's official AI",
  "AKIRA — assistente de inteligência artificial": "AKIRA — artificial intelligence assistant",
  "Quem somos — Isaac Nascimento Quarenta": "About us — Isaac Nascimento Quarenta",
  "Perfil e descrição profissional de Isaac Quarenta": "Isaac Quarenta's profile and professional description",
  "Isaac Quarenta no X": "Isaac Quarenta on X",
  "Angola: visão geral económica": "Angola: economic overview",
  "UNESCO destaca o potencial de crescimento da indústria cinematográfica africana": "UNESCO highlights the growth potential of Africa's film industry",
  "Relatório sobre a indústria cinematográfica em África": "Report on Africa's film industry",
  "Organização Mundial do Comércio": "World Trade Organization",
  "Ficheiro: Bethlehem Tilahun Alemu, fundadora da soleRebels": "Bethlehem Tilahun Alemu, founder of soleRebels",
  "Ficheiro: Mo Abudu": "Mo Abudu",
  "Ficheiro: Nelly Cheboi no palco após receber o prémio CNN Hero of the Year": "Nelly Cheboi on stage after receiving the CNN Hero of the Year award",
  "Ficheiro: Rebecca Enonchong durante a E-Commerce Week 2019": "Rebecca Enonchong at E-Commerce Week 2019",
  "AppsTech: soluções empresariais e história da empresa": "AppsTech: enterprise solutions and company history",
  "Digitalização e lacunas de competências digitais em África: um perfil empírico": "Digitalisation and digital skills gaps in Africa: an empirical profile",
  "Iniciativa para a Economia Digital em África": "Africa Digital Economy Initiative",
  "The Mobile Economy Africa": "The Mobile Economy Africa",
  "About SunCulture": "About SunCulture",
  "Our Impact": "Our Impact",
  "Our Purpose and Our Story": "Our Purpose and Our Story",
  "Blood safety and availability": "Blood safety and availability",
  "Heart And Sole": "Heart and Sole",
  "The Blockbuster Named Nollywood": "The Blockbuster Named Nollywood",
  "Parcerias para a Produção de Vacinas em África": "Partnerships for African Vaccine Manufacturing",
  "Africa Centres for Disease Control and Prevention": "Africa Centres for Disease Control and Prevention",
  "About Ashesi": "About Ashesi",
  "Ashesi University Foundation": "Ashesi University Foundation",
  "About Dangote Industries Limited": "About Dangote Industries Limited",
  "economistas africanas": "African women economists",
  "comércio internacional": "international trade",
  "Nigéria": "Nigeria",
  "empresários africanos": "African business leaders",
  "indústria na Nigéria": "industry in Nigeria",
  "produção local em África": "local production in Africa",
  "financiamento climático": "climate finance",
  "Comissão Económica para África": "Economic Commission for Africa",
  "desenvolvimento africano": "African development",
  "educação no Gana": "education in Ghana",
  "empreendedorismo africano": "African entrepreneurship",
  "liderança ética": "ethical leadership",
  "Nobel de Literatura 2021": "2021 Nobel Prize in Literature",
  "literatura africana": "African literature",
};

const englishBiographies: Record<string, BiographyCopy> = {
  "isaac-nascimento-quarenta": {
    name: "Isaac Nascimento Quarenta",
    role: "Technology entrepreneur and founder of SoftEdge Corporation",
    summary: "An editorial profile of an Angolan technology entrepreneur, based on public company and personal sources.",
    spotlight: "His public work connects software development and company leadership in Angola.",
  },
  "jose-eduardo-agualusa": {
    name: "José Eduardo Agualusa",
    role: "Angolan writer",
    summary: "His fiction brings memory, history and urban life together; in A General Theory of Oblivion, Luanda is central to the narrative.",
    spotlight: "The International Dublin Literary Award's account of his novel places Luanda and Angola's history at the centre of its literary context.",
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
  "ngozi-okonjo-iweala": {
    role: "Economist and international leader",
    summary: "A Nigerian economist whose career spans public finance, development and international trade.",
    spotlight: "She became the first woman and first African to lead the World Trade Organization in 2021.",
    seoTitle: "Ngozi Okonjo-Iweala: economics and global leadership",
    seoDescription: "A profile of Nigerian economist Ngozi Okonjo-Iweala, whose career includes leading the World Trade Organization.",
    seoKeywords: ["Ngozi Okonjo-Iweala", "African women economists", "international trade", "Nigeria", "World Trade Organization"],
  },
  "aliko-dangote": {
    role: "Founder of Dangote Group",
    summary: "A Nigerian businessman associated with the expansion of industrial operations in cement, food and energy.",
    spotlight: "He founded a diversified group whose operations span cement, food, fertiliser, energy and petrochemicals.",
    seoTitle: "Aliko Dangote: industry and local production in Africa",
    seoDescription: "A profile of Aliko Dangote and the industrial strategy of the group he founded, distinguishing company statements from independent findings.",
    seoKeywords: ["Aliko Dangote", "Dangote Group", "African business leaders", "industry in Nigeria", "local production in Africa"],
  },
  "vera-songwe": {
    role: "Economist and development specialist",
    summary: "A Cameroonian economist whose career includes roles at the World Bank, IFC and the United Nations Economic Commission for Africa.",
    spotlight: "Her work spans economic policy, development finance, agriculture and climate-related investment.",
    seoTitle: "Vera Songwe: economics and finance for Africa",
    seoDescription: "A profile of economist Vera Songwe, focusing on her experience in development, fiscal policy and sustainable finance.",
    seoKeywords: ["Vera Songwe", "African women economists", "climate finance", "Economic Commission for Africa", "African development"],
  },
  "patrick-awuah": {
    role: "Founder of Ashesi University",
    summary: "A Ghanaian entrepreneur and educator associated with founding Ashesi University and its mission to develop ethical, entrepreneurial leaders.",
    spotlight: "He founded Ashesi University, an institution whose mission emphasises ethical leadership and entrepreneurship.",
    seoTitle: "Patrick Awuah: education and leadership in Ghana",
    seoDescription: "Meet Patrick Awuah, founder of Ashesi University, and the educational mission connecting ethical leadership with entrepreneurship.",
    seoKeywords: ["Patrick Awuah", "Ashesi University", "education in Ghana", "African entrepreneurship", "ethical leadership"],
  },
  "abdulrazak-gurnah": {
    role: "Writer and Nobel Prize laureate in Literature",
    summary: "The Zanzibar-born writer explores colonialism, displacement and the experience of living between cultures.",
    spotlight: "The 2021 Nobel Prize in Literature recognised his writing on colonialism and the lives shaped by displacement.",
    seoTitle: "Abdulrazak Gurnah: literature, memory and displacement",
    seoDescription: "A profile of writer Abdulrazak Gurnah, the 2021 Nobel Prize in Literature laureate born in Zanzibar, Tanzania.",
    seoKeywords: ["Abdulrazak Gurnah", "2021 Nobel Prize in Literature", "African literature", "Zanzibar", "Tanzanian writers"],
  },
};

const englishBiographyBodies: Record<string, string[]> = {
  "jose-eduardo-agualusa": [
    "José Eduardo Agualusa is an Angolan writer who publishes fiction in Portuguese. Among his works, A General Theory of Oblivion follows characters in Luanda against the backdrop of independence and the changes of the following decades.",
    "The International Dublin Literary Award's page for the novel describes the city as central to the story and connects individual memory with Angolan history. The novel received the award in 2017, according to the prize record.",
    "Agualusa's fiction offers a literary entry point—not documentary reporting—for thinking about memory, identity and social change. Reading the novel in context helps distinguish its narrative construction from the historical sources used to understand the period.",
  ],
  "nelly-cheboi": [
    "Nelly Cheboi is a Kenyan software engineer and founder of TechLit Africa, a non-profit that introduces digital skills in rural schools. Her work connects education, technology and the belief that access to digital tools can expand opportunities for young people.",
    "In a 2023 report, CNN described TechLit Africa's work with refurbished computers and students in Mogotio, Kenya. The report also recorded that Cheboi was named CNN Hero of the Year for 2022. These details refer to the period covered by the report, not an update on the programme's current scale.",
    "The organisation says it sets up computer labs in rural primary schools, offers regular digital lessons and supports students with local teachers. Its institutional page reports the programme's reach and results using its own data.",
    "Cheboi's journey shifts the conversation about innovation beyond apps and funding rounds. Skills, teachers, equipment and continuity are all part of the infrastructure needed for more people to participate in the digital economy.",
  ],
  "rebecca-enonchong": [
    "Rebecca Enonchong is a Cameroonian technology entrepreneur and founder of AppsTech, an international enterprise software company. Her work brings together business, technology and efforts to broaden African entrepreneurs' presence in global conversations.",
    "Over the course of her career, she has become a prominent voice for founders and professionals building technology on the continent. Her participation in entrepreneurship and innovation networks highlights issues including access to capital, public policy and cooperation between ecosystems.",
    "Enonchong's story is also a reminder that building technology in Africa means navigating diverse markets, developing teams and advocating for conditions that allow more companies to grow from their communities.",
  ],
  "bethlehem-tilahun-alemu": [
    "Born in Addis Ababa, Bethlehem Tilahun Alemu founded soleRebels in 2005. The footwear brand grew from a desire to create work in her community and bring local craftsmanship to international audiences.",
    "The company's proposition combines traditional production techniques, locally available materials and a global brand identity. Her journey shows how a creative business can connect local employment, knowledge and access to new markets.",
    "Alemu has also launched initiatives connected to leather and Ethiopian coffee. Her work broadens conversations about African entrepreneurship beyond the familiar narratives of technology and venture capital.",
  ],
  "mo-abudu": [
    "Mosunmola Abudu, known as Mo Abudu, is a Nigerian media entrepreneur and founder of EbonyLife. Her work is connected to producing and distributing African stories to audiences on and beyond the continent.",
    "With television, film and distribution partnerships in her career, Abudu has argued that local stories can travel without losing their specificity. The strategy brings together talent development, content production and the building of a recognisable brand.",
    "EbonyLife represents part of a changing creative industry: one seeking new sources of financing, stronger structures for paying creators and greater control over how its own stories circulate.",
  ],
  "temie-giwa-tubosun": [
    "Temie Giwa-Tubosun is a Nigerian health entrepreneur and founder of LifeBank. Her work starts from a practical problem: essential products only help when a supply network can locate them and deliver them to the people who need them.",
    "TED describes LifeBank as a company founded in 2016 to build a healthcare supply chain serving hospitals in Nigeria and Kenya. The profile describes operations using different forms of transport and coordinating deliveries with hospitals' needs. This information is presented by TED in its profile of the founder and company.",
    "Giwa-Tubosun's work draws attention to a less visible dimension of innovation: connecting data, inventory, transport and teams on the ground. In healthcare, a solution depends as much on operational reliability as on the technology it uses.",
    "The World Health Organization recommends integrated and coordinated networks to support blood safety and availability. That context helps explain the importance of the challenge, but should not be mistaken for an independent assessment of LifeBank's specific impact.",
  ],
  "iyinoluwa-aboyeji": [
    "Iyinoluwa Aboyeji is a Nigerian entrepreneur associated with two important stages of Africa's technology ecosystem: developing talent for the digital industry and building payments infrastructure.",
    "A 2018 Forbes profile describes Aboyeji as a co-founder of two African startups before launching Flutterwave in 2017. It identifies Andela as one of his earlier projects and presents funding and activity figures from that time. Those figures are historical, not current metrics.",
    "The path from Andela to Flutterwave brings together two distinct market needs: connecting professionals with technology opportunities and making payments more accessible to businesses operating across borders. In both cases, continental ambitions depend on execution across different regulatory, financial and linguistic contexts.",
    "The experience described by Forbes invites readers to consider how different companies address complementary needs in the ecosystem. The profile dates from 2018; current information is needed to assess the organisations today.",
  ],
  "samir-ibrahim": [
    "Samir Ibrahim is an entrepreneur working at the intersection of clean energy and agriculture in Kenya. He co-founded SunCulture, which develops off-grid solar systems to address needs such as water access, irrigation and energy on small farms.",
    "SunCulture's institutional page describes systems combining solar pumping and drip irrigation, alongside instalment payments, installation and support. These features are reported by the company; performance and returns depend on each farm's conditions.",
    "A 2017 Forbes profile identifies Ibrahim as a SunCulture co-founder and describes the company's solar irrigation systems. Productivity and water-saving figures cited in that profile were company estimates at the time, not independent measurements or current results.",
    "Ibrahim's work shows how energy, agriculture and finance can come together in a product aimed at everyday needs. It also raises questions that accompany innovation: who can afford the equipment, how it is maintained, where the water comes from and what evidence exists about long-term outcomes.",
  ],
  "ngozi-okonjo-iweala": [
    "Ngozi Okonjo-Iweala is a Nigerian economist whose career has included public policy, development and international trade. The World Trade Organization records that she took office as its director-general in March 2021, becoming the first woman and first African to hold the role.",
    "Her career is relevant to discussions about African representation in multilateral institutions and the relationship between trade, finance and development. The WTO's institutional profile brings together information about her mandate and work; roles and dates should be checked against the organisation's latest updates.",
    "Rather than reducing a career to one position, this profile highlights movement between national and global institutions. Assessing a leader's impact means distinguishing a biography from decisions made by a collective organisation and considering the concrete outcomes of specific policies.",
    "The sources consulted are institutional. This profile does not attribute economic outcomes involving many actors to the economist alone, nor does it replace analysis of the decisions made during each mandate.",
  ],
  "aliko-dangote": [
    "Aliko Dangote is a Nigerian businessman and founder of Dangote Group. The group's institutional page describes a diversified company operating in sectors including cement, food, fertiliser, energy and petrochemicals, and presents local production as part of its strategy.",
    "The group dates the beginning of Dangote's commercial career to 1978 and links its growth to a shift from trading to industrial production. These biographical details and the account of the strategy come from the company; they are not an independent audit of operations or their impact.",
    "Industrial scale raises important economic questions: which local suppliers participate, what jobs are created, how competition changes and how production costs affect consumers. The answers vary by sector and country and require evidence beyond corporate communications.",
    "Dangote's story is useful for discussing African industrialisation without assuming that company size automatically means inclusive development. Analysis should consider productivity, working conditions, tax, environmental effects and how value is distributed across supply chains.",
  ],
  "vera-songwe": [
    "Vera Songwe is a Cameroonian economist and non-resident fellow with the Africa Growth Initiative at the Brookings Institution. Her institutional profile describes a career that includes chairing the board of the Liquidity and Sustainability Facility and co-leading the Food System Economics Commission.",
    "Before those roles, Songwe served as a United Nations under-secretary-general and executive secretary of the United Nations Economic Commission for Africa. She also worked at the World Bank and the International Finance Corporation in roles connected to development, economic policy and operations in African countries.",
    "Brookings associates her work with fiscal policy, financing mechanisms, agriculture, energy and economic governance. These subjects are interconnected: debt and liquidity decisions influence the room available for public investment, while agriculture and energy shape employment and resilience.",
    "This profile draws on Brookings' professional biography, which may be updated over time. Describing positions is not an independent evaluation of the institutions or policies with which the economist has been associated.",
  ],
  "patrick-awuah": [
    "Patrick Awuah is a Ghanaian educator and entrepreneur associated with founding Ashesi University. The Ashesi Foundation identifies him as its founder and president and presents its work as supporting the university's mission to educate ethical and entrepreneurial leaders.",
    "Ashesi is often part of discussions about higher education, skills development and innovation on the continent. The institution defines its own mission; assessing its impact requires further information about access, academic quality, graduation and opportunities for alumni.",
    "Awuah's journey makes it possible to discuss the relationship between individual initiative and lasting institutions. Creating a university takes more than an idea: it requires accreditation, faculty, funding, governance and the trust of students and families.",
    "This profile distinguishes Ashesi's institutional account from an independent measurement of outcomes. The source may update roles and the foundation's structure, so its information should be read in the context of its publication date.",
  ],
  "abdulrazak-gurnah": [
    "Abdulrazak Gurnah is a writer born in Zanzibar, Tanzania, and the 2021 Nobel Prize in Literature laureate. The Nobel Committee recognised his writing for its treatment of colonialism and the experience of refugees across cultures and continents.",
    "According to the biography published by the Nobel Prize, Gurnah grew up in Zanzibar and left the island in the 1960s amid the persecution of people of Arab origin. He later settled in England. The Nobel account places displacement and East African history within the context of his work.",
    "Gurnah's writing invites readers to consider how memory, migration and colonialism shape individual lives. His significance extends beyond representing a region: his novels explore the complexity of identities and experiences that do not fit a single story about Africa.",
    "This profile summarises biographical information and the prize citation published by the Nobel Prize. To understand the work, readers should engage with the books and literary criticism rather than treating an award as a substitute for interpretation.",
  ],
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
  const articleCopy = englishArticles[article.slug];
  const biographyCopy = article.kind === "biography" ? englishBiographies[article.slug] : undefined;
  if (!articleCopy && !biographyCopy) return article;
  return {
    ...article,
    ...articleCopy,
    ...(biographyCopy ? {
      title: biographyCopy.name ?? articleCopy?.title ?? article.title,
      standfirst: biographyCopy.summary,
      personRole: biographyCopy.role,
      seoTitle: biographyCopy.seoTitle ?? articleCopy?.seoTitle,
      seoDescription: biographyCopy.seoDescription ?? articleCopy?.seoDescription,
      seoKeywords: biographyCopy.seoKeywords ?? articleCopy?.seoKeywords,
      imageAlt: biographyCopy.portraitAlt ?? article.imageAlt,
      category: localizeCategory(article.category, locale),
      personField: localizeCategory(article.personField ?? article.category, locale),
      personCountry: article.personCountry ? localizeCountry(article.personCountry, locale) : article.personCountry,
    } : {}),
    ...(englishBiographyBodies[article.slug] ? { markdown: englishBiographyBodies[article.slug].join("\n\n") } : {}),
    ...(englishArticleBodies[article.slug] ? { markdown: englishArticleBodies[article.slug] } : {}),
    ...(article.isSponsored
      ? {
          sponsorDisclosure: article.partnerName
            ? `Sponsored content from ${article.partnerName}. The sponsor does not determine independent editorial coverage.`
            : "Sponsored content is paid promotion and is clearly identified. It does not determine independent editorial coverage.",
        }
      : {}),
    ...(article.sources
      ? {
          sources: article.sources.map((source) => ({
            ...source,
            title: englishSourceLabels[source.title] ?? source.title,
            publisher: source.publisher
              ? englishSourceLabels[source.publisher]
                ?? (source.publisher === "Wikimedia Commons / UNCTAD" ? "Wikimedia Commons / UNCTAD" : source.publisher)
              : null,
          })),
        }
      : {}),
    author: article.author === "Redação Kioo" ? "Kioo Africa Editorial" : article.author,
    date: localizeDate(article.date),
  };
}

export function hasEnglishArticleCopy(slug: string) {
  return slug in englishArticles || slug in englishBiographies;
}

export function hasContentForLocale(content: { slug: string; locale?: string }, locale: Locale) {
  if (locale === "en") {
    return hasEnglishArticleCopy(content.slug) || content.locale?.toLowerCase().startsWith("en") === true;
  }
  return content.locale === undefined || content.locale.toLowerCase().startsWith("pt");
}

export function localizeBiography(profile: Biography, locale: Locale): Biography {
  if (locale !== "en") return profile;
  const copy = englishBiographies[profile.slug];
  if (!copy) return profile;
  const { portraitAlt, ...localizedCopy } = copy;
  return {
    ...profile,
    ...localizedCopy,
    body: englishBiographyBodies[profile.slug]
      ?? englishArticleBodies[profile.slug]?.split(/\n\n+/).filter(Boolean)
      ?? profile.body,
    country: localizeCountry(profile.country, locale),
    field: localizeCategory(profile.field, locale),
    portrait: profile.portrait && portraitAlt
      ? { ...profile.portrait, alt: portraitAlt }
      : profile.portrait,
  };
}

export function hasEnglishBiographyCopy(slug: string) {
  return slug in englishBiographies;
}
