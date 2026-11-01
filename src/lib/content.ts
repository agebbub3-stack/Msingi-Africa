export type Article = {
  slug: string;
  title: string;
  standfirst: string;
  category: string;
  author: string;
  date: string;
  readingTime: string;
  image: string;
  imageAlt: string;
  body?: { heading?: string; text: string }[];
  markdown?: string;
  id?: string;
  kind?: "article" | "biography" | "sponsored";
  isSponsored?: boolean;
  sponsorDisclosure?: string | null;
  authorSlug?: string | null;
  publishedAt?: string | null;
  modifiedAt?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string[];
  canonicalUrl?: string | null;
  personCountry?: string | null;
  personField?: string | null;
  personRole?: string | null;
  sources?: { title: string; publisher: string | null; url: string }[];
};

export const researchArticles: Article[] = [
  {
    slug: "inclusao-digital-africa-uso-internet-movel",
    title: "A próxima fronteira digital africana é transformar cobertura em uso",
    standfirst:
      "A GSMA estima que quase mil milhões de pessoas em África ainda não usam internet móvel. Preço dos dispositivos, competências digitais e conteúdo relevante continuam a separar cobertura de acesso real.",
    category: "Tecnologia",
    author: "Redação Msingi",
    date: "1 nov. 2026",
    readingTime: "5 min de leitura",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Pessoa a utilizar um telemóvel para aceder a serviços digitais",
    seoTitle: "Internet móvel em África: o desafio da inclusão digital",
    seoDescription:
      "A GSMA aponta preço, competências e conteúdo como barreiras ao uso da internet móvel em África. Uma análise sobre a próxima etapa da inclusão digital.",
    seoKeywords: [
      "inclusão digital em África",
      "internet móvel África",
      "GSMA Mobile Economy Africa",
      "economia digital africana",
      "conectividade móvel",
    ],
    sources: [
      {
        title: "The Mobile Economy Africa",
        publisher: "GSMA",
        url: "https://www.gsma.com/solutions-and-impact/connectivity-for-good/mobile-economy/africa/",
      },
    ],
    body: [
      {
        text: "A expansão das redes móveis costuma ser apresentada como sinónimo de inclusão digital. Mas cobertura não garante que uma pessoa tenha um equipamento compatível, consiga pagar pelo acesso ou encontre serviços e conteúdos úteis na sua língua e no seu contexto.",
      },
      {
        heading: "Uma distância entre sinal e utilização",
        text: "No seu relatório Mobile Economy Africa, a GSMA afirma que quase mil milhões de pessoas no continente ainda não utilizam internet móvel, apesar da cobertura disponível. A organização identifica barreiras como a acessibilidade dos telemóveis, competências digitais limitadas e falta de conteúdo relevante.",
      },
      {
        text: "A diferença entre estar coberto por uma rede e conseguir utilizá-la com regularidade é importante para empresas e governos. Uma política que mede apenas antenas instaladas pode não revelar quem continua excluído por custo, literacia, acessibilidade ou falta de confiança nos serviços digitais.",
      },
      {
        heading: "O que os negócios podem aprender",
        text: "Para startups e prestadores de serviços, desenhar para a inclusão significa compreender como os clientes recebem rendimentos, que dispositivos conseguem manter e que tarefas pretendem resolver. Planos de pagamento, interfaces simples, apoio local e conteúdo de utilidade concreta podem ajudar — desde que o custo total e os termos sejam transparentes.",
      },
      {
        text: "A GSMA calcula que as tecnologias e os serviços móveis contribuíram com 240 mil milhões de dólares para a economia africana em 2025, equivalentes a 7,8% do PIB do continente. A escala económica é expressiva; o desafio editorial e empresarial é perguntar quem consegue participar nesse crescimento e o que falta para reduzir a distância entre acesso potencial e benefício efetivo.",
      },
      {
        text: "Os números citados são estimativas e análises da GSMA, não uma medição independente da Msingi Africa. A inclusão digital deve ser avaliada não só pelo número de ligações, mas também pela qualidade, preço e utilidade do acesso.",
      },
    ],
  },
  {
    slug: "m-kopa-financiamento-smartphones-servicos-digitais",
    title: "M-KOPA e o smartphone como porta de entrada para serviços financeiros",
    standfirst:
      "O modelo combina uma entrada inicial, pagamentos frequentes e acesso progressivo a serviços. A oportunidade de inclusão depende também de transparência, custo total e proteção do cliente.",
    category: "Startups & Inovação",
    author: "Redação Msingi",
    date: "1 nov. 2026",
    readingTime: "6 min de leitura",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Smartphone utilizado para aceder a serviços digitais",
    seoTitle: "M-KOPA: financiamento de smartphones e inclusão digital",
    seoDescription:
      "Como o modelo da M-KOPA liga financiamento de smartphones, pagamentos flexíveis e serviços digitais nos mercados africanos — e que perguntas deixa.",
    seoKeywords: [
      "M-KOPA África",
      "financiamento de smartphones África",
      "inclusão financeira africana",
      "fintech africana",
      "pagamentos flexíveis",
    ],
    sources: [
      {
        title: "Our Purpose and Our Story",
        publisher: "M-KOPA",
        url: "https://www.m-kopa.com/about",
      },
      {
        title: "Our Impact",
        publisher: "M-KOPA",
        url: "https://www.m-kopa.com/impact",
      },
    ],
    body: [
      {
        text: "Em muitos mercados, possuir um smartphone é o primeiro passo para aceder a pagamentos digitais, informação, ferramentas de trabalho e serviços financeiros. O preço de compra, porém, pode excluir pessoas com rendimentos irregulares ou sem histórico de crédito formal.",
      },
      {
        heading: "Financiar o equipamento e construir uma relação",
        text: "A M-KOPA descreve o seu modelo como uma combinação de software, equipamento e distribuição. Segundo a empresa, o cliente faz um pagamento inicial e liquida o restante em prestações frequentes; o histórico de pagamentos pode depois dar acesso a outros produtos, como crédito digital, proteção do dispositivo, cobertura de saúde e dados móveis.",
      },
      {
        text: "A empresa afirma que começou em 2010 e que opera em cinco mercados africanos: Quénia, Uganda, Nigéria, Gana e África do Sul. Na sua página de impacto, apresenta indicadores próprios de clientes, crédito disponibilizado e conectividade. São números reportados pela própria organização e devem ser lidos como tal, não como auditoria independente.",
      },
      {
        heading: "A conveniência não elimina as perguntas difíceis",
        text: "Pagamentos alinhados com a frequência dos rendimentos podem reduzir a barreira inicial à compra. Ao mesmo tempo, qualquer modelo de crédito exige que o cliente compreenda o preço total, os encargos, as consequências de falhar prestações, as condições de bloqueio do equipamento e a forma como os seus dados são utilizados.",
      },
      {
        text: "Para avaliar o impacto de uma fintech, não basta contar dispositivos distribuídos ou empréstimos concedidos. Também importa perceber se o serviço melhora a capacidade de gerar rendimento, se o custo é sustentável para diferentes perfis e se existem mecanismos claros para resolver reclamações.",
      },
      {
        text: "O caso da M-KOPA ajuda a observar uma tendência mais ampla: empresas africanas estão a ligar infraestrutura física, dados e serviços financeiros num único percurso de cliente. O resultado depende da execução local e de regras que protejam o consumidor tanto quanto facilitam o acesso.",
      },
    ],
  },
  {
    slug: "logistica-saude-acesso-sangue",
    title: "Na saúde, a logística também pode decidir o acesso",
    standfirst:
      "A segurança do sangue depende de redes coordenadas e entregas oportunas. O caso da LifeBank mostra como tecnologia e operação física se encontram na saúde.",
    category: "Tecnologia",
    author: "Redação Msingi",
    date: "1 nov. 2026",
    readingTime: "5 min de leitura",
    image:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Profissional de saúde a trabalhar numa unidade clínica",
    seoTitle: "Logística de saúde em África: o caso LifeBank",
    seoDescription:
      "Como redes de distribuição, tecnologia e coordenação podem apoiar o acesso a sangue e outros produtos essenciais de saúde em África.",
    seoKeywords: [
      "logística de saúde em África",
      "LifeBank",
      "distribuição de sangue",
      "saúde digital africana",
      "cadeia de abastecimento hospitalar",
    ],
    sources: [
      {
        title: "Temie Giwa-Tubosun is saving lives, one bag of blood at a time",
        publisher: "TED",
        url: "https://www.ted.com/speakers/temie_giwa_tubosun",
      },
      {
        title: "Blood safety and availability",
        publisher: "Organização Mundial da Saúde",
        url: "https://www.who.int/news-room/fact-sheets/detail/blood-safety-and-availability",
      },
      {
        title: "LifeBank",
        publisher: "LifeBank",
        url: "https://lifebank.ng/",
      },
    ],
    body: [
      {
        text: "Quando um hospital precisa de sangue, medicamentos ou equipamento, a existência de um fornecedor não basta: a rede tem de localizar o produto certo, confirmar a sua disponibilidade e fazê-lo chegar a tempo. A logística é parte da infraestrutura clínica, embora muitas vezes fique fora da conversa sobre inovação em saúde.",
      },
      {
        heading: "Uma rede coordenada, não apenas uma aplicação",
        text: "A Organização Mundial da Saúde recomenda que as atividades de recolha, análise, processamento, armazenamento e distribuição de sangue sejam coordenadas através de redes integradas. Na sua atualização com dados de 2023, a OMS identifica 36 países da Região Africana entre os 55 países que reportaram menos de dez dádivas de sangue por mil habitantes. O indicador descreve a disponibilidade reportada; não explica, por si só, as causas em cada país.",
      },
      {
        text: "A TED descreve a LifeBank como uma empresa fundada por Temie Giwa-Tubosun em 2016 para desenvolver uma cadeia de abastecimento de produtos de saúde, com entregas a hospitais na Nigéria e no Quénia. O perfil refere a utilização de diferentes meios de transporte, incluindo motas, barcos, camiões, triciclos e drones. É um retrato da operação apresentado pela própria organização à TED, não uma avaliação independente dos seus resultados clínicos.",
      },
      {
        heading: "Tecnologia ligada ao trabalho no terreno",
        text: "O exemplo ajuda a olhar para além do software: inventário, comunicação com hospitais, conservação dos produtos, coordenação de transporte e protocolos de qualidade precisam de funcionar em conjunto. Uma plataforma pode melhorar a visibilidade de uma encomenda, mas a entrega depende também de equipas, infraestrutura e processos adequados a cada território.",
      },
      {
        text: "Para avaliar iniciativas deste tipo, importa perguntar que produtos cobre a rede, como confirma a qualidade e a cadeia de custódia, que zonas consegue servir e que dados sustentam as alegações de impacto. A questão central não é apenas a velocidade da tecnologia, mas a fiabilidade do sistema que ela ajuda a coordenar.",
      },
    ],
  },
  {
    slug: "venture-capital-africa-2025-rondas-contexto",
    title: "O que os números do capital tecnológico africano de 2025 revelam",
    standfirst:
      "O financiamento de capital próprio cresceu 8%, mas o número de rondas avançou apenas 1%. A diferença ajuda a separar recuperação de uma nova expansão.",
    category: "Mercados",
    author: "Redação Msingi",
    date: "1 nov. 2026",
    readingTime: "5 min de leitura",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Gráficos e indicadores financeiros num ecrã de análise",
    seoTitle: "Capital de risco em África em 2025: rondas e tendências",
    seoDescription:
      "A Partech registou US$2,4 mil milhões em capital próprio e 462 rondas na tecnologia africana em 2025. Veja o que esses indicadores mostram — e o que não mostram.",
    seoKeywords: [
      "capital de risco África 2025",
      "venture capital africano",
      "startups africanas investimento",
      "Partech Africa Tech Venture Capital Report",
      "mercado de tecnologia africano",
    ],
    sources: [
      {
        title: "2025 Africa Tech Venture Capital Report",
        publisher: "Partech",
        url: "https://partechpartners.com/africa-reports/2025-africa-tech-venture-capital-report",
      },
    ],
    body: [
      {
        text: "O volume de financiamento é uma medida útil, mas incompleta, da saúde de um ecossistema. Para perceber se o mercado está a crescer, também é preciso observar quantas empresas conseguem captar, em que fases, com que dimensão de ronda e com que distribuição entre países e setores.",
      },
      {
        heading: "Mais capital, quase o mesmo número de rondas",
        text: "No Africa Tech Venture Capital Report de 2025, a Partech registou US$2,4 mil milhões em financiamento de capital próprio para empresas tecnológicas africanas, um aumento de 8% face a 2024. O número de rondas foi 462, apenas 1% acima do ano anterior. Segundo o relatório, a diferença reflete sobretudo bilhetes médios maiores, não um aumento equivalente na quantidade de operações.",
      },
      {
        text: "A Partech descreve 2025 como um período de normalização depois da correção iniciada nos anos anteriores. O relatório assinala maior atividade de crescimento e uma distribuição mais equilibrada dos valores investidos, mas também volatilidade ao longo do ano: o quarto trimestre concentrou US$876 milhões em capital próprio, enquanto o ritmo e os montantes variaram entre trimestres.",
      },
      {
        heading: "Ler o agregado com cautela",
        text: "Um total continental não mostra, por si só, se o capital está acessível a empresas em fase inicial, a fundadores fora dos principais centros ou a setores que exigem ciclos de retorno mais longos. Também não substitui informação sobre sobrevivência, receitas, emprego criado ou condições de financiamento.",
      },
      {
        text: "O relatório da Partech é uma fonte especializada e abrangente sobre rondas divulgadas, mas continua a ser uma medição construída segundo os critérios da própria organização. A leitura mais prudente é que o mercado de 2025 deixou de encolher de forma acentuada; afirmar que começou um novo ciclo de expansão exige mais evidência e acompanhamento.",
      },
    ],
  },
];

export const articles: Article[] = [
  ...researchArticles,
  {
    slug: "capital-africano-novas-rotas",
    title: "O capital africano está a encontrar novas rotas",
    standfirst:
      "Mais do que seguir o próximo grande investimento, vale perceber quem está a financiar o crescimento — e em que condições.",
    category: "Mercados",
    author: "Redação Msingi",
    date: "31 out. 2026",
    readingTime: "6 min de leitura",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Edifícios comerciais vistos de baixo numa cidade",
    sources: [
      {
        title: "2025 Africa Tech Venture Capital Report",
        publisher: "Partech",
        url: "https://partechpartners.com/africa-reports/2025-africa-tech-venture-capital-report",
      },
    ],
    body: [
      {
        text: "Falar de investimento em África como se fosse uma única história esconde a parte mais importante: cada mercado tem regras, moedas, infraestruturas e ritmos próprios. O capital que chega é apenas metade da conversa. A outra metade é perceber quem consegue transformá-lo em capacidade produtiva — e em que condições.",
      },
      {
        heading: "O contexto antes do anúncio",
        text: "A edição de 2025 do Africa Tech Venture Capital Report, da Partech, estima que startups tecnológicas africanas captaram US$ 4,1 mil milhões em capital próprio e dívida. A componente de dívida atingiu US$ 1,6 mil milhões, enquanto o financiamento por capital próprio chegou a US$ 2,4 mil milhões. São números do ecossistema tecnológico acompanhado pelo relatório — não uma medida de todo o investimento ou de todos os setores do continente.",
      },
      {
        text: "A distinção importa: dívida e capital próprio têm custos, riscos e expectativas diferentes para quem empreende. Uma ronda pode revelar confiança, mas não explica, por si só, a saúde de um setor. Convém observar a origem do capital, o horizonte do investimento e a forma como a empresa gera receita.",
      },
      {
        heading: "Ler vários mercados, não uma média",
        text: "O relatório atribui parte do total a operações de dívida de grande dimensão e identifica concentração geográfica entre os principais ecossistemas. Por isso, um total continental não descreve a experiência de uma startup em Luanda, Dakar ou Kigali. Políticas nacionais, moeda, pagamentos, logística e procura local continuam a determinar que empresas conseguem crescer.",
      },
      {
        heading: "O que acompanhar a seguir",
        text: "Investidores locais, fundos regionais, bancos de desenvolvimento e parceiros internacionais cumprem papéis diferentes. Acompanhar a distribuição por país, setor, instrumento financeiro e fase de crescimento ajuda a perceber quem beneficia — e o que ainda não está a ser medido. Os valores aqui citados são estimativas da Partech, não uma medição independente da Msingi Africa.",
      },
    ],
  },
  {
    slug: "angola-para-la-dos-recursos",
    title: "Angola para lá dos recursos: onde nascem as próximas oportunidades",
    standfirst:
      "Empreendedores e investidores estão a olhar para novas cadeias de valor. O primeiro passo é entender as condições locais.",
    category: "Angola",
    author: "Redação Msingi",
    date: "29 out. 2026",
    readingTime: "5 min de leitura",
    image:
      "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Vista urbana ao anoitecer",
    sources: [
      {
        title: "Angola: visão geral económica",
        publisher: "Banco Mundial",
        url: "https://www.worldbank.org/ext/en/country/angola",
      },
    ],
    body: [
      {
        text: "A diversificação económica costuma ser apresentada como um destino. Na prática, é uma sequência de decisões sobre infraestruturas, talento, acesso a financiamento e capacidade de ligar produtores a clientes.",
      },
      {
        heading: "Oportunidade é também execução",
        text: "A dependência do petróleo continua a moldar a economia angolana. Na sua visão geral de 2026, o Banco Mundial estima que o setor representa cerca de 20% do PIB, 60% das receitas fiscais e 95% das exportações. Estes indicadores ajudam a explicar por que diversificar exige mais do que identificar setores promissores: é preciso reduzir obstáculos concretos à produção e à circulação de bens.",
      },
      {
        text: "Agricultura, logística, serviços financeiros e indústrias criativas podem abrir espaço para novas cadeias de valor. O potencial, contudo, não substitui uma análise de custos, regulação e procura real em cada província. O próprio Banco Mundial aponta agricultura e serviços — incluindo logística, comunicações e comércio — entre os motores esperados para o médio prazo.",
      },
      {
        heading: "Uma agenda de longo prazo",
        text: "A mesma análise projeta crescimento de 4,5% em 2026, mas uma previsão não é um resultado garantido. Atrair investimento produtivo pede previsibilidade e colaboração entre empresas, instituições e quem já trabalha nas cadeias de valor. As histórias que merecem atenção mostram como essas relações funcionam — e o que ainda precisa de mudar.",
      },
    ],
  },
  {
    slug: "criatividade-como-industria",
    title: "A criatividade africana merece ser lida como indústria",
    standfirst:
      "Da música ao design, o talento cruza fronteiras. A pergunta é como construir negócios sustentáveis à volta dessa circulação.",
    category: "Cultura & Negócios",
    author: "Lina Matondo",
    date: "26 out. 2026",
    readingTime: "7 min de leitura",
    image:
      "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Público reunido num evento cultural",
    sources: [
      {
        title: "UNESCO destaca o potencial de crescimento da indústria cinematográfica africana",
        publisher: "UNESCO",
        url: "https://www.unesco.org/en/articles/unesco-spotlights-growth-potential-africas-film-industry",
      },
      {
        title: "Relatório sobre a indústria cinematográfica em África",
        publisher: "UNESCO",
        url: "https://www.unesco.org/en/articles/new-unesco-publication-highlights-growth-potential-africas-film-industry",
      },
    ],
    body: [
      {
        text: "A música, o audiovisual, a moda e o design não são apenas expressões culturais: também envolvem propriedade intelectual, empregos, tecnologia e cadeias de distribuição. Tratar estes setores como uma economia exige olhar para o trabalho que acontece antes e depois do palco.",
      },
      {
        heading: "O valor que nem sempre aparece",
        text: "A UNESCO estima que o cinema e o audiovisual empregam cerca de cinco milhões de pessoas e representam US$ 5 mil milhões do PIB em África. A estimativa refere-se a esses setores específicos, não a toda a economia criativa. Direitos, contratos claros, meios de pagamento e acesso a novos públicos continuam a determinar se a circulação de uma obra se transforma em rendimento para quem a criou.",
      },
      {
        text: "Para que as indústrias criativas cresçam, é importante investir em formação, infraestrutura e dados comparáveis. As recomendações da UNESCO sobre o audiovisual também chamam atenção para formação, financiamento, distribuição e políticas públicas. As soluções precisam de ouvir artistas, produtores e profissionais que conhecem os desafios de cada mercado.",
      },
      {
        heading: "Uma conversa de negócios e cultura",
        text: "Analisar criatividade como indústria não diminui a sua dimensão cultural. Pelo contrário: ajuda a compreender o ecossistema que permite às histórias viajar, remunerar os seus autores e criar novas possibilidades no continente.",
      },
    ],
  },
  {
    slug: "talento-economia-digital",
    title: "O talento é a infraestrutura invisível da economia digital",
    standfirst:
      "Tecnologia e investimento chamam a atenção. A capacidade de formar, reter e apoiar equipas decide o que acontece depois.",
    category: "Tecnologia",
    author: "Redação Msingi",
    date: "22 out. 2026",
    readingTime: "4 min de leitura",
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Equipa a colaborar numa mesa de trabalho",
    sources: [
      {
        title: "Digitalização e lacunas de competências digitais em África: um perfil empírico",
        publisher: "Brookings Institution",
        url: "https://www.brookings.edu/articles/digitalization-and-digital-skills-gaps-in-africa-an-empirical-profile/",
      },
      {
        title: "Iniciativa para a Economia Digital em África",
        publisher: "Banco Mundial",
        url: "https://www.worldbank.org/en/programs/all-africa-digital-transformation",
      },
    ],
    body: [
      {
        text: "É fácil falar de inovação como se ela começasse com uma aplicação ou uma ronda de investimento. Quase sempre, a parte decisiva é menos visível: as pessoas que aprendem, adaptam ferramentas e tornam um produto útil no seu contexto.",
      },
      {
        heading: "Capacidades que ficam",
        text: "A formação técnica importa, mas não é suficiente. Equipas fortes precisam de experiência de gestão, canais para partilhar conhecimento e ambientes onde seja possível experimentar sem perder de vista as necessidades dos clientes.",
      },
      {
        text: "Uma análise empírica da Brookings mede a digitalização em cinco dimensões, entre elas competências, infraestrutura, finanças e plataformas digitais. O estudo também procura comparar lacunas entre países, em vez de tratar o continente como um mercado uniforme. Essa diferença de contexto importa tanto para governos como para empregadores.",
      },
      {
        text: "Quando as empresas investem em talento local, os benefícios podem atravessar setores: fornecedores mais capazes, novos serviços e mais conhecimento acumulado. Medir esses efeitos ajuda a ir além do número de vagas anunciadas. Os resultados citados são da análise da Brookings e dos seus autores, não de uma pesquisa própria da Msingi Africa.",
      },
    ],
  },
];

export type Biography = {
  slug: string;
  name: string;
  monogram: string;
  country: string;
  field: string;
  role: string;
  summary: string;
  accent: "sage" | "clay" | "gold";
  organization?: string;
  organizationUrl?: string;
  contactUrl?: string;
  spotlight?: string;
  body: string[];
  sources?: { title: string; publisher: string | null; url: string }[];
  portrait?: {
    src: string;
    alt: string;
    credit: string;
    sourceUrl: string;
    license: string;
    licenseUrl: string;
  };
};

export const biographies: Biography[] = [
  {
    slug: "nelly-cheboi",
    name: "Nelly Cheboi",
    monogram: "NC",
    country: "Quénia",
    field: "Educação e tecnologia",
    role: "Fundadora da TechLit Africa",
    summary:
      "A engenheira de software queniana criou uma iniciativa que leva computadores recondicionados e aulas de informática a escolas rurais.",
    accent: "sage",
    organization: "TechLit Africa",
    organizationUrl: "https://techlitafrica.org/",
    spotlight:
      "Fundou uma iniciativa que equipa escolas rurais com laboratórios de informática, aulas digitais regulares e professores locais.",
    portrait: {
      src: "/images/profiles/nelly-cheboi.jpg",
      alt: "Nelly Cheboi no palco após receber o prémio CNN Hero of the Year",
      credit: "Cheboinelly",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Nelly_cheboi_on_stage_cnn_hero_of_year.jpg",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    },
    body: [
      "Nelly Cheboi é uma engenheira de software queniana e fundadora da TechLit Africa, organização sem fins lucrativos que introduz competências digitais em escolas rurais. A sua trajetória liga educação, tecnologia e a convicção de que o acesso a ferramentas digitais pode ampliar as oportunidades disponíveis para os jovens.",
      "Em reportagem publicada em 2023, a CNN descreveu o trabalho da TechLit Africa com computadores recondicionados e estudantes em Mogotio, no Quénia. A mesma reportagem registou que Cheboi foi distinguida como CNN Hero of the Year de 2022. Esses dados correspondem ao período coberto pela reportagem e não devem ser confundidos com uma atualização sobre a dimensão atual do programa.",
      "A organização explica que instala laboratórios de informática em escolas primárias rurais, oferece aulas digitais regulares e coloca professores locais a acompanhar os alunos. A sua página institucional reporta os resultados e o alcance do programa segundo dados próprios.",
      "O percurso de Cheboi ajuda a deslocar a conversa sobre inovação para além de aplicações e rondas de investimento. Competências, professores, equipamentos e continuidade são parte da infraestrutura necessária para que mais pessoas possam participar na economia digital.",
    ],
    sources: [
      {
        title: "CNN Hero of the Year Nelly Cheboi returned to Kenya with plans to lift more students out of poverty",
        publisher: "CNN",
        url: "https://www.cnn.com/2023/03/31/world/kenya-tech-literacy-nelly-cheboi-cnnheroes",
      },
      {
        title: "TechLit Africa",
        publisher: "TechLit Africa",
        url: "https://techlitafrica.org/",
      },
      {
        title: "Ficheiro: Nelly Cheboi no palco após receber o prémio CNN Hero of the Year",
        publisher: "Wikimedia Commons",
        url: "https://commons.wikimedia.org/wiki/File:Nelly_cheboi_on_stage_cnn_hero_of_year.jpg",
      },
    ],
  },
  {
    slug: "rebecca-enonchong",
    name: "Rebecca Enonchong",
    monogram: "RE",
    country: "Camarões",
    field: "Tecnologia",
    role: "Fundadora da AppsTech",
    summary:
      "Uma das vozes mais reconhecidas na defesa do empreendedorismo tecnológico africano.",
    accent: "sage",
    organization: "AppsTech",
    organizationUrl: "https://appstech.com/en/",
    contactUrl: "https://appstech.com/en/#contact",
    spotlight:
      "Fundou a AppsTech em 1999. A empresa descreve uma operação internacional de tecnologia empresarial, com clientes em mais de 50 países.",
    portrait: {
      src: "/images/profiles/rebecca-enonchong.jpg",
      alt: "Rebecca Enonchong durante um evento da UNCTAD em 2019",
      credit: "UNCTAD / Jean Marc Ferré",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:ECommerce_Week_2019_-_Rebecca_Enonchong.jpg",
      license: "CC BY-SA 2.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
    },
    body: [
      "Rebecca Enonchong é uma empresária tecnológica camaronense e fundadora da AppsTech, empresa internacional de soluções de software. A sua trajetória cruza negócios, tecnologia e o trabalho de ampliar a presença de empreendedores africanos em conversas globais.",
      "Ao longo da carreira, tornou-se uma referência para fundadores e profissionais que procuram construir tecnologia a partir do continente. A sua participação em redes de empreendedorismo e inovação dá visibilidade a questões como acesso a capital, políticas públicas e colaboração entre ecossistemas.",
      "A história de Enonchong é também um lembrete de que construir tecnologia em África significa navegar por mercados diversos, formar equipas e defender condições para que mais empresas cresçam a partir das suas comunidades.",
    ],
    sources: [
      {
        title: "AppsTech: soluções empresariais e história da empresa",
        publisher: "AppsTech",
        url: "https://appstech.com/en/",
      },
      {
        title: "Ficheiro: Rebecca Enonchong durante a E-Commerce Week 2019",
        publisher: "Wikimedia Commons / UNCTAD",
        url: "https://commons.wikimedia.org/wiki/File:ECommerce_Week_2019_-_Rebecca_Enonchong.jpg",
      },
    ],
  },
  {
    slug: "bethlehem-tilahun-alemu",
    name: "Bethlehem Tilahun Alemu",
    monogram: "BA",
    country: "Etiópia",
    field: "Economia criativa",
    role: "Fundadora da soleRebels",
    summary:
      "Transformou saber artesanal e materiais locais numa marca etíope com ambição internacional.",
    accent: "clay",
    organization: "soleRebels",
    spotlight:
      "Fundou a soleRebels em 2005, ligando o saber artesanal etíope à criação de uma marca de calçado com ambição internacional.",
    portrait: {
      src: "/images/profiles/bethlehem-tilahun-alemu.png",
      alt: "Bethlehem Tilahun Alemu entrevistada para a NdaniTV",
      credit: "NdaniTV",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:SoleRebels_Bethlehem_Tilahun_Alemu.png",
      license: "CC BY 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by/3.0/",
    },
    body: [
      "Nascida em Addis Abeba, Bethlehem Tilahun Alemu fundou a soleRebels em 2005. A marca de calçado nasceu da vontade de criar trabalho na sua comunidade e de dar visibilidade internacional ao saber artesanal local.",
      "A proposta da empresa combina técnicas de produção tradicionais, materiais disponíveis na região e uma identidade de marca global. O percurso mostra como um negócio criativo pode aproximar emprego local, conhecimento e acesso a novos mercados.",
      "Alemu também lançou iniciativas ligadas ao couro e ao café etíope. O seu trabalho ajuda a ampliar a conversa sobre empreendedorismo africano para além das narrativas convencionais de tecnologia e capital de risco.",
    ],
    sources: [
      {
        title: "Heart And Sole",
        publisher: "Forbes Africa",
        url: "https://www.forbesafrica.com/life/2015/08/01/heart-and-sole",
      },
      {
        title: "Ficheiro: Bethlehem Tilahun Alemu, fundadora da soleRebels",
        publisher: "Wikimedia Commons / NdaniTV",
        url: "https://commons.wikimedia.org/wiki/File:SoleRebels_Bethlehem_Tilahun_Alemu.png",
      },
    ],
  },
  {
    slug: "mo-abudu",
    name: "Mo Abudu",
    monogram: "MA",
    country: "Nigéria",
    field: "Media & cultura",
    role: "Fundadora da EbonyLife",
    summary:
      "Construiu uma plataforma de media que coloca histórias africanas no centro da conversa.",
    accent: "gold",
    organization: "EbonyLife",
    spotlight:
      "Fundou a EbonyLife, uma plataforma de televisão e cinema dedicada à produção e circulação de histórias africanas.",
    portrait: {
      src: "/images/profiles/mo-abudu.jpg",
      alt: "Mo Abudu num retrato de 2010",
      credit: "Nkemonwudiwe",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Mosunmola_Abudu_1.jpg",
      license: "CC BY 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by/3.0/",
    },
    body: [
      "Mosunmola Abudu, conhecida como Mo Abudu, é uma empresária nigeriana de media e fundadora da EbonyLife. A sua trajetória está ligada à produção e distribuição de histórias africanas para audiências dentro e fora do continente.",
      "Com televisão, cinema e parcerias de distribuição no seu percurso, Abudu tem defendido que histórias locais podem viajar sem perder a sua especificidade. A estratégia combina desenvolvimento de talento, produção de conteúdos e construção de uma marca reconhecível.",
      "A EbonyLife representa uma parte importante de uma indústria criativa em transformação: uma indústria que procura novas fontes de financiamento, melhores estruturas para remunerar criadores e maior controlo sobre a circulação das suas próprias narrativas.",
    ],
    sources: [
      {
        title: "The Blockbuster Named Nollywood",
        publisher: "Forbes Africa",
        url: "https://www.forbesafrica.com/cover-story/2020/10/08/the-blockbuster-named-nollywood",
      },
      {
        title: "Ficheiro: Mo Abudu",
        publisher: "Wikimedia Commons",
        url: "https://commons.wikimedia.org/wiki/File:Mosunmola_Abudu_1.jpg",
      },
    ],
  },
  {
    slug: "temie-giwa-tubosun",
    name: "Temie Giwa-Tubosun",
    monogram: "TG",
    country: "Nigéria",
    field: "Saúde e logística",
    role: "Fundadora da LifeBank",
    summary:
      "Construiu uma empresa de cadeia de abastecimento de saúde que coordena a entrega de produtos essenciais a hospitais.",
    accent: "sage",
    organization: "LifeBank",
    organizationUrl: "https://lifebank.ng/",
    spotlight:
      "Fundou a LifeBank em 2016 para ligar hospitais a produtos essenciais através de uma operação de distribuição que combina tecnologia e logística.",
    body: [
      "Temie Giwa-Tubosun é uma empreendedora nigeriana na área da saúde e fundadora da LifeBank. O seu trabalho parte de um problema concreto: produtos essenciais só são úteis quando a rede de abastecimento consegue localizá-los e fazê-los chegar a quem deles precisa.",
      "A TED descreve a LifeBank como uma empresa fundada em 2016 para construir uma cadeia de abastecimento de produtos de saúde, com hospitais na Nigéria e no Quénia. O perfil refere uma operação que recorre a diferentes meios de transporte e funciona em coordenação com as necessidades dos hospitais. Estas informações são apresentadas pela TED a partir do perfil da fundadora e da empresa.",
      "A trajetória de Giwa-Tubosun chama a atenção para uma dimensão frequentemente menos visível da inovação: ligar dados, inventário, transporte e equipas no terreno. Na saúde, a eficácia de uma solução depende tanto da fiabilidade operacional como da tecnologia utilizada.",
      "A Organização Mundial da Saúde recomenda redes integradas e coordenadas para apoiar a segurança e a disponibilidade de sangue. Esse contexto ajuda a compreender a relevância do desafio, mas não deve ser confundido com uma avaliação independente do impacto específico da LifeBank.",
    ],
    sources: [
      {
        title: "Temie Giwa-Tubosun is saving lives, one bag of blood at a time",
        publisher: "TED",
        url: "https://www.ted.com/speakers/temie_giwa_tubosun",
      },
      {
        title: "Blood safety and availability",
        publisher: "Organização Mundial da Saúde",
        url: "https://www.who.int/news-room/fact-sheets/detail/blood-safety-and-availability",
      },
      {
        title: "LifeBank",
        publisher: "LifeBank",
        url: "https://lifebank.ng/",
      },
    ],
  },
  {
    slug: "iyinoluwa-aboyeji",
    name: "Iyinoluwa Aboyeji",
    monogram: "IA",
    country: "Nigéria",
    field: "Tecnologia e pagamentos",
    role: "Empreendedor tecnológico e cofundador",
    summary:
      "Participou na construção de empresas tecnológicas africanas como Andela e Flutterwave, ligadas a talento e pagamentos digitais.",
    accent: "clay",
    organization: "Flutterwave",
    organizationUrl: "https://flutterwave.com/",
    spotlight:
      "O perfil da Forbes regista o seu percurso de cofundador de startups e a criação da Flutterwave em 2017, ligando talento tecnológico e pagamentos digitais.",
    body: [
      "Iyinoluwa Aboyeji é um empreendedor nigeriano associado a duas etapas marcantes do ecossistema tecnológico africano: a formação de talento para a indústria digital e a construção de infraestrutura de pagamentos.",
      "O perfil da Forbes, publicado em 2018, descreve Aboyeji como cofundador de duas startups africanas antes de lançar a Flutterwave em 2017. O mesmo texto identifica a Andela como um dos projetos anteriores e apresenta números de financiamento e atividade referentes àquele momento. Esses valores são históricos e não devem ser lidos como métricas atuais.",
      "A trajetória entre Andela e Flutterwave reúne duas necessidades distintas do mercado: ligar profissionais a oportunidades de tecnologia e tornar os pagamentos mais acessíveis a negócios que operam entre países. Em ambos os casos, a ambição continental depende de execução em contextos regulatórios, financeiros e linguísticos diferentes.",
      "A experiência descrita pela Forbes convida a observar como diferentes empresas procuram responder a necessidades complementares do ecossistema. O perfil é um registo de 2018; para avaliar a situação atual das organizações, é necessário consultar informação mais recente.",
    ],
    sources: [
      {
        title: "Iyinoluwa Aboyeji",
        publisher: "Forbes",
        url: "https://www.forbes.com/profile/iyinoluwa-aboyeji/",
      },
    ],
  },
];

export const topics = ["Todos", "Mercados", "Angola", "Tecnologia", "Startups & Inovação", "Cultura & Negócios"];

export const imageForCategory: Record<string, string> = {
  Mercados:
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=85",
  Angola:
    "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1000&q=85",
  Tecnologia:
    "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1000&q=85",
  "Cultura & Negócios":
    "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=1000&q=85",
};
