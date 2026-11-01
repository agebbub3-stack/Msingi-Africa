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
  isFeatured?: boolean;
  isSponsored?: boolean;
  sponsorDisclosure?: string | null;
  partnerName?: string | null;
  partnerLogoUrl?: string | null;
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
    author: "Redação Kioo",
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
        text: "Os números citados são estimativas e análises da GSMA, não uma medição independente da Kioo Africa. A inclusão digital deve ser avaliada não só pelo número de ligações, mas também pela qualidade, preço e utilidade do acesso.",
      },
    ],
  },
  {
    slug: "m-kopa-financiamento-smartphones-servicos-digitais",
    title: "M-KOPA e o smartphone como porta de entrada para serviços financeiros",
    standfirst:
      "O modelo combina uma entrada inicial, pagamentos frequentes e acesso progressivo a serviços. A oportunidade de inclusão depende também de transparência, custo total e proteção do cliente.",
    category: "Startups & Inovação",
    author: "Redação Kioo",
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
    author: "Redação Kioo",
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
    author: "Redação Kioo",
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
  {
    slug: "energia-solar-irrigacao-agricultura-africa",
    title: "Como a energia solar pode apoiar a agricultura africana?",
    standfirst:
      "Bombas solares e irrigação gota a gota podem reduzir a dependência da chuva. O impacto depende do custo, da água disponível e do apoio ao agricultor.",
    category: "Startups & Inovação",
    author: "Redação Kioo",
    date: "1 nov. 2026",
    readingTime: "6 min de leitura",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Campo agrícola irrigado sob luz natural",
    seoTitle: "Energia solar e irrigação em África: oportunidade e limites",
    seoDescription:
      "Como sistemas solares de irrigação podem apoiar pequenos agricultores africanos, e que custos, riscos hídricos e condições de financiamento precisam ser considerados.",
    seoKeywords: [
      "energia solar para agricultura em África",
      "irrigação solar África",
      "agricultura sustentável africana",
      "SunCulture",
      "pequenos agricultores africanos",
      "energia limpa em África",
    ],
    sources: [
      {
        title: "Africa Energy Outlook 2022",
        publisher: "Agência Internacional de Energia",
        url: "https://www.iea.org/reports/africa-energy-outlook-2022",
      },
      {
        title: "About SunCulture",
        publisher: "SunCulture",
        url: "https://sunculture.io/about-us/",
      },
      {
        title: "Samir Ibrahim",
        publisher: "Forbes",
        url: "https://www.forbes.com/profile/samir-ibrahim/",
      },
    ],
    body: [
      {
        text: "Como a energia solar pode ajudar pequenos agricultores em África? Uma resposta possível está em sistemas que ligam painéis solares, bombagem de água e irrigação eficiente. Mas instalar equipamento não resolve, por si só, os desafios de acesso à água, financiamento, manutenção e comercialização das colheitas.",
      },
      {
        heading: "Da energia à água na exploração agrícola",
        text: "A SunCulture apresenta sistemas solares fora da rede que podem combinar bombagem de água, irrigação gota a gota, iluminação e carregamento de telemóveis. A empresa também oferece uma modalidade de pagamento parcelado. Estas são características descritas pela própria organização; os resultados variam conforme a exploração e não devem ser tratados como garantias universais.",
      },
      {
        text: "A Agência Internacional de Energia destaca a ligação entre energia acessível, desenvolvimento e transição para fontes mais limpas no seu Africa Energy Outlook 2022. Para uma exploração rural, eletricidade pode apoiar tarefas produtivas, mas a solução precisa de corresponder à dimensão da atividade, aos recursos hídricos e à capacidade de pagar e manter o sistema.",
      },
      {
        heading: "A oportunidade e os limites da irrigação solar",
        text: "A irrigação pode reduzir a dependência de períodos de chuva, mas bombear água sem gestão adequada também pode pressionar aquíferos e fontes locais. Uma análise responsável considera a origem da água, a eficiência do sistema, as regras de captação e os custos completos de instalação, financiamento e reparação.",
      },
      {
        text: "O perfil da Forbes sobre Samir Ibrahim documenta a cofundação da SunCulture e os sistemas de irrigação solar da empresa numa publicação de 2017. Os indicadores de produtividade e poupança de água ali mencionados eram estimativas reportadas pela empresa naquele momento, não resultados independentes nem métricas atuais.",
      },
      {
        text: "A oportunidade de negócio está em combinar equipamento adequado, crédito compreensível, assistência técnica local e gestão sustentável da água. É essa combinação — e não apenas a tecnologia solar — que determina se a inovação melhora de forma duradoura a vida e a produtividade de quem cultiva.",
      },
    ],
  },
  {
    slug: "energia-limpa-africa-acesso-economico",
    title: "Energia limpa em África precisa de ser também acessível",
    standfirst:
      "A transição energética só será inclusiva se expandir o acesso moderno sem ignorar preço, infraestrutura e prioridades de desenvolvimento.",
    category: "Mercados",
    author: "Redação Kioo",
    date: "1 nov. 2026",
    readingTime: "5 min de leitura",
    image:
      "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1400&q=85",
    imageAlt: "Turbinas eólicas a produzir energia numa paisagem aberta",
    seoTitle: "Energia limpa em África: acesso, custo e transição justa",
    seoDescription:
      "O que significa uma transição energética justa em África? A IEA analisa acesso, acessibilidade, infraestrutura, investimento e fontes mais limpas.",
    seoKeywords: [
      "energia limpa em África",
      "transição energética africana",
      "acesso à energia em África",
      "energia acessível África",
      "Africa Energy Outlook",
      "investimento em energia renovável",
    ],
    sources: [
      {
        title: "Africa Energy Outlook 2022",
        publisher: "Agência Internacional de Energia",
        url: "https://www.iea.org/reports/africa-energy-outlook-2022",
      },
    ],
    body: [
      {
        text: "O que significa uma transição energética justa em África? Significa avançar para sistemas menos poluentes enquanto se amplia o acesso a serviços modernos e a energia continua financeiramente acessível. Não existe uma única solução para países com redes, recursos e necessidades muito diferentes.",
      },
      {
        heading: "Acesso e descarbonização devem avançar juntos",
        text: "A Agência Internacional de Energia enquadra a transformação do setor energético africano em torno de objetivos que incluem acesso universal a serviços modernos e acessíveis até 2030, expansão de infraestrutura e cumprimento das metas climáticas nacionais. O relatório Africa Energy Outlook 2022 analisa caminhos possíveis, necessidades de investimento, financiamento e prioridades de política pública.",
      },
      {
        text: "Na prática, a combinação pode incluir expansão de redes, soluções descentralizadas, melhorias de eficiência e fontes renováveis, de acordo com o contexto local. Para famílias e pequenas empresas, a fiabilidade e o preço do serviço importam tanto quanto a origem da eletricidade.",
      },
      {
        heading: "O que investidores e decisores devem perguntar",
        text: "Um projeto deve ser avaliado pelo custo total, pela capacidade de operar e manter os equipamentos, pelo acesso que cria e pela forma como distribui benefícios e riscos. Também importa perceber se as comunidades participaram no planeamento e como o projeto se integra nas prioridades energéticas e de emprego de cada país.",
      },
      {
        text: "O relatório da IEA é uma análise de 2022, não um retrato estatístico atualizado de 2026. A sua utilidade aqui está no enquadramento das escolhas e dos compromissos envolvidos. Para números atuais sobre cada país, é necessário consultar dados recentes e nacionais.",
      },
    ],
  },
];

const softedgePartnershipDisclosure =
  "Parceria identificada: segundo o Kioo, a SoftEdge colaborou no desenvolvimento de software no âmbito do plano gratuito; não se declara compra de pacote premium.";

const softedgeFeature: Article = {
  slug: "softedge-ia-angolana-akira",
  title: "SoftEdge Corporation e AKIRA: inteligência artificial criada em Angola",
  standfirst:
    "Da engenharia de software à assistente AKIRA, a empresa de Luanda apresenta produtos digitais com foco no português. Conheça o que as fontes oficiais dizem — e o que ainda deve ser avaliado.",
  category: "Tecnologia",
  author: "Redação Kioo",
  date: "1 nov. 2026",
  readingTime: "7 min de leitura",
  image: "/images/partners/akira-web.png",
  imageAlt: "Logótipo oficial da AKIRA, assistente de inteligência artificial da SoftEdge",
  kind: "article",
  isFeatured: true,
  isSponsored: true,
  sponsorDisclosure: softedgePartnershipDisclosure,
  partnerName: "SoftEdge Corporation",
  partnerLogoUrl: "/images/partners/softedge-logo.jpeg",
  seoTitle: "SoftEdge Corporation e AKIRA IA: tecnologia angolana",
  seoDescription:
    "Conheça Isaac Quarenta, a SoftEdge Corporation e a AKIRA IA, assistente angolana descrita nas fontes oficiais como focada no português.",
  seoKeywords: [
    "SoftEdge Corporation",
    "SoftEdge Corporation Angola",
    "AKIRA IA",
    "inteligência artificial em Angola",
    "IA angolana",
    "Isaac Quarenta",
    "Isaac Nascimento Quarenta SoftEdge",
    "tecnologia angolana",
    "software em Angola",
    "assistente de inteligência artificial em português",
    "inovação tecnológica africana",
    "o que é a AKIRA IA",
  ],
  sources: [
    {
      title: "Quem somos — SoftEdge Corporation",
      publisher: "SoftEdge Corporation",
      url: "https://softedge-corporation.up.railway.app/sobre",
    },
    {
      title: "AKIRA: a IA oficial da SoftEdge",
      publisher: "SoftEdge Corporation",
      url: "https://softedge-corporation.up.railway.app/projetos",
    },
    {
      title: "AKIRA — assistente de inteligência artificial",
      publisher: "AKIRA",
      url: "https://akira-ia.onrender.com/",
    },
  ],
  body: [
    {
      text: "A SoftEdge Corporation apresenta-se como uma empresa angolana de tecnologia, fundada em Luanda em 2023, com atividade em desenvolvimento de software, produtos digitais e inteligência artificial. Entre os projetos que destaca está a AKIRA, uma assistente criada pela empresa. As descrições de serviços e produto neste artigo são atribuídas às páginas oficiais; não constituem uma avaliação técnica independente.",
    },
    {
      heading: "O que é a SoftEdge Corporation?",
      text: "Segundo a sua página institucional, a SoftEdge desenvolve aplicações web e móveis, sistemas empresariais, integrações e soluções de inteligência artificial. O site identifica Isaac Nascimento Quarenta como fundador e CEO. A empresa também apresenta uma cronologia própria de atividade desde 2023; indicadores promocionais publicados no site não são reproduzidos aqui porque não foi possível confirmá-los de forma independente.",
    },
    {
      heading: "O que é a AKIRA IA?",
      text: "A AKIRA é apresentada pela própria empresa como uma assistente de inteligência artificial criada em Angola. Na descrição pública do produto, a SoftEdge destaca conversação em português e compreensão do contexto local. A página do produto lista ainda análise de documentos e imagens, geração de imagens, pesquisa na web e organização de tarefas com histórico de conversas. Estas são funcionalidades anunciadas pelo fornecedor, não resultados testados pela redação.",
    },
    {
      heading: "Porque importa a experiência em português",
      text: "Uma interface em português pode facilitar o primeiro contacto com ferramentas de IA para quem trabalha, estuda ou gere um negócio nesse idioma. Isso, por si só, não garante precisão nem adequação a todos os contextos africanos: idiomas, conectividade, dispositivos, custos e necessidades variam entre comunidades e países. A utilidade de uma ferramenta depende da experiência real de quem a utiliza.",
    },
    {
      heading: "O que avaliar antes de usar uma assistente de IA",
      text: "Empresas e utilizadores devem verificar que dados são enviados, como são armazenados, quem pode aceder-lhes e que controlos existem para os apagar. Também é prudente confirmar respostas importantes em fontes independentes e não enviar documentos confidenciais sem compreender as condições do serviço. Estas são recomendações gerais para ferramentas de IA; não são afirmações sobre práticas específicas da AKIRA.",
    },
    {
      heading: "O que se sabe sobre a parceria entre a SoftEdge e o Kioo?",
      text: "O Kioo Africa informa que a SoftEdge colaborou no desenvolvimento de software para o grupo no âmbito de um plano gratuito. Por transparência, este perfil é identificado como conteúdo de parceria. A publicação não apresenta essa colaboração como compra do pacote premium nem atribui um valor monetário ao acordo.",
    },
  ],
};

export const articles: Article[] = [
  softedgeFeature,
  ...researchArticles,
  {
    slug: "capital-africano-novas-rotas",
    title: "O capital africano está a encontrar novas rotas",
    standfirst:
      "Mais do que seguir o próximo grande investimento, vale perceber quem está a financiar o crescimento — e em que condições.",
    category: "Mercados",
    author: "Redação Kioo",
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
        text: "Investidores locais, fundos regionais, bancos de desenvolvimento e parceiros internacionais cumprem papéis diferentes. Acompanhar a distribuição por país, setor, instrumento financeiro e fase de crescimento ajuda a perceber quem beneficia — e o que ainda não está a ser medido. Os valores aqui citados são estimativas da Partech, não uma medição independente da Kioo Africa.",
      },
    ],
  },
  {
    slug: "angola-para-la-dos-recursos",
    title: "Angola para lá dos recursos: onde nascem as próximas oportunidades",
    standfirst:
      "Empreendedores e investidores estão a olhar para novas cadeias de valor. O primeiro passo é entender as condições locais.",
    category: "Angola",
    author: "Redação Kioo",
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
    author: "Redação Kioo",
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
        text: "Quando as empresas investem em talento local, os benefícios podem atravessar setores: fornecedores mais capazes, novos serviços e mais conhecimento acumulado. Medir esses efeitos ajuda a ir além do número de vagas anunciadas. Os resultados citados são da análise da Brookings e dos seus autores, não de uma pesquisa própria da Kioo Africa.",
      },
    ],
  },
];

export type Biography = {
  slug: string;
  name: string;
  alternateName?: string;
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
  isFeatured?: boolean;
  isSponsored?: boolean;
  sponsorDisclosure?: string | null;
  partnerName?: string | null;
  partnerLogoUrl?: string | null;
  relatedArticleSlugs?: string[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  sameAs?: string[];
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
    slug: "isaac-nascimento-quarenta",
    name: "Isaac Nascimento Quarenta",
    alternateName: "Isaac Quarenta",
    monogram: "IQ",
    country: "Angola",
    field: "Tecnologia",
    role: "Empreendedor tecnológico e fundador da SoftEdge Corporation",
    summary:
      "Programador angolano e fundador da SoftEdge Corporation, Isaac Quarenta acompanha o desenvolvimento de software e da AKIRA, assistente de inteligência artificial criada em Angola.",
    accent: "gold",
    organization: "SoftEdge Corporation",
    organizationUrl: "https://softedge-corporation.up.railway.app/",
    spotlight:
      "Fundou a SoftEdge Corporation em Luanda e lidera a empresa que apresenta a AKIRA, uma assistente de inteligência artificial em português.",
    isFeatured: true,
    isSponsored: true,
    sponsorDisclosure: softedgePartnershipDisclosure,
    partnerName: "SoftEdge Corporation",
    partnerLogoUrl: "/images/partners/softedge-logo.jpeg",
    relatedArticleSlugs: ["softedge-ia-angolana-akira"],
    seoTitle: "Isaac Quarenta: SoftEdge Corporation e AKIRA IA",
    seoDescription:
      "Quem é Isaac Nascimento Quarenta? Perfil do empreendedor angolano associado à SoftEdge Corporation e à AKIRA IA, baseado em fontes públicas.",
    seoKeywords: [
      "Isaac Quarenta",
      "Isaac Nascimento Quarenta",
      "biografia de Isaac Quarenta",
      "quem é Isaac Quarenta",
      "SoftEdge Corporation",
      "SoftEdge Corporation Angola",
      "fundador da SoftEdge Corporation",
      "AKIRA IA",
      "empreendedor angolano",
      "programador angolano",
      "inteligência artificial em Angola",
    ],
    sameAs: [
      "https://github.com/isaac-quarenta",
      "https://x.com/IQuarenta98960",
    ],
    body: [
      "## Quem é Isaac Quarenta?\n\nIsaac Nascimento Quarenta, conhecido profissionalmente como Isaac Quarenta, é um empreendedor tecnológico angolano e fundador da SoftEdge Corporation. O site da empresa, sediada em Luanda, identifica-o como fundador e CEO. No seu perfil público do GitHub, apresenta-se como programador full-stack e estudante de Ciência da Computação em Angola.",
      "## Origem e formação\n\nSegundo informação biográfica fornecida pelo próprio Isaac à redação, nasceu em Luanda, Angola, a 21 de março de 2007. Não foi localizada uma fonte pública independente que confirme essa data. O perfil do GitHub descreve a sua formação como estudante de Ciência da Computação e o seu trabalho como desenvolvimento de aplicações modernas, escaláveis e de fácil manutenção.",
      "## SoftEdge Corporation\n\nA SoftEdge descreve-se como uma empresa angolana de tecnologia fundada em Luanda em 2023, com atividade em software, produtos digitais e soluções de inteligência artificial. Nas páginas institucionais, apresenta serviços de desenvolvimento web e móvel, sistemas empresariais, integrações e consultoria digital. A cronologia e as métricas divulgadas no site são declarações da própria empresa; este perfil não as trata como indicadores verificados por terceiros.",
      "## AKIRA e inteligência artificial em português\n\nEntre os projetos associados a Isaac, a SoftEdge destaca a AKIRA, uma assistente de inteligência artificial criada em Angola. A página do produto anuncia conversação em português, análise de documentos e imagens, geração de imagens, pesquisa na web e organização de tarefas com histórico de conversas. Estas capacidades são descritas pela empresa e pelo site da AKIRA, sem uma avaliação técnica independente da redação.",
      "## Presença pública e percurso\n\nIsaac mantém um perfil no GitHub com informação sobre o seu trabalho de programação e um perfil no X identificado com a SoftEdge. A sua trajetória pública liga desenvolvimento de software, liderança empresarial e criação de um produto de IA. Como se trata de um percurso em desenvolvimento, este retrato distingue informação autobiográfica, declarações da empresa e funcionalidades anunciadas do que ainda exigiria confirmação independente.",
    ],
    sources: [
      {
        title: "Quem somos — Isaac Nascimento Quarenta",
        publisher: "SoftEdge Corporation",
        url: "https://softedge-corporation.up.railway.app/sobre",
      },
      {
        title: "Perfil e descrição profissional de Isaac Quarenta",
        publisher: "GitHub",
        url: "https://github.com/isaac-quarenta",
      },
      {
        title: "Isaac Quarenta no X",
        publisher: "X",
        url: "https://x.com/IQuarenta98960",
      },
      {
        title: "AKIRA — assistente de inteligência artificial",
        publisher: "AKIRA",
        url: "https://akira-ia.onrender.com/",
      },
    ],
  },
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
    relatedArticleSlugs: ["inclusao-digital-africa-uso-internet-movel", "talento-economia-digital"],
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
    relatedArticleSlugs: ["venture-capital-africa-2025-rondas-contexto", "talento-economia-digital"],
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
    relatedArticleSlugs: ["criatividade-como-industria"],
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
    relatedArticleSlugs: ["criatividade-como-industria"],
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
    relatedArticleSlugs: ["logistica-saude-acesso-sangue"],
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
    relatedArticleSlugs: ["venture-capital-africa-2025-rondas-contexto", "talento-economia-digital"],
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
  {
    slug: "samir-ibrahim",
    name: "Samir Ibrahim",
    monogram: "SI",
    country: "Quénia",
    field: "Energia limpa e agricultura",
    role: "Cofundador e CEO da SunCulture",
    summary:
      "Ajuda a desenvolver sistemas solares de bombagem e irrigação pensados para os desafios diários de pequenos agricultores.",
    accent: "sage",
    organization: "SunCulture",
    organizationUrl: "https://sunculture.io/about-us/",
    spotlight:
      "Cofundou uma empresa que combina energia solar, bombagem de água e soluções de irrigação para explorações agrícolas.",
    relatedArticleSlugs: ["energia-solar-irrigacao-agricultura-africa", "energia-limpa-africa-acesso-economico"],
    seoKeywords: [
      "Samir Ibrahim",
      "SunCulture",
      "empreendedores do Quénia",
      "energia limpa em África",
      "irrigação solar",
      "inovação agrícola africana",
      "Kioo Africa",
    ],
    body: [
      "Samir Ibrahim é um empreendedor ligado à energia limpa e à agricultura no Quénia. É cofundador da SunCulture, empresa que desenvolve sistemas solares fora da rede para responder a necessidades como acesso à água, irrigação e energia em pequenas explorações.",
      "A página institucional da SunCulture descreve sistemas que combinam bombagem solar e irrigação gota a gota, e apresenta modalidades de pagamento parcelado e serviços de instalação e apoio. Estas características são reportadas pela própria empresa; o desempenho e o retorno dependem das condições de cada exploração.",
      "Um perfil publicado pela Forbes em 2017 identifica Ibrahim como cofundador da SunCulture e descreve os sistemas solares de irrigação da empresa. Os números de produtividade e poupança de água citados naquele perfil eram estimativas da empresa naquele período, não medições independentes nem resultados atuais.",
      "O percurso de Ibrahim mostra como energia, agricultura e financiamento podem convergir num produto orientado para necessidades quotidianas. Também evidencia as perguntas que acompanham a inovação: quem consegue pagar o equipamento, como é feita a manutenção, de onde vem a água e que evidência existe sobre os resultados a longo prazo.",
    ],
    sources: [
      {
        title: "Samir Ibrahim",
        publisher: "Forbes",
        url: "https://www.forbes.com/profile/samir-ibrahim/",
      },
      {
        title: "About SunCulture",
        publisher: "SunCulture",
        url: "https://sunculture.io/about-us/",
      },
      {
        title: "Africa Energy Outlook 2022",
        publisher: "Agência Internacional de Energia",
        url: "https://www.iea.org/reports/africa-energy-outlook-2022",
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
