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
    body: [
      {
        text: "Falar de investimento em África como se fosse uma única história esconde a parte mais importante: cada mercado tem regras, moedas, infraestruturas e ritmos próprios. O capital que chega é apenas metade da conversa. A outra metade é perceber quem consegue transformá-lo em capacidade produtiva.",
      },
      {
        heading: "O contexto antes do anúncio",
        text: "Uma ronda de financiamento pode revelar confiança, mas não explica, por si só, a saúde de um setor. Para compreender a oportunidade, importa observar a origem do capital, o horizonte do investimento e a forma como as empresas geram receita nos mercados onde operam.",
      },
      {
        text: "Investidores locais, fundos regionais, bancos de desenvolvimento e parceiros internacionais cumprem papéis diferentes. Misturá-los numa única métrica deixa de fora a qualidade das ligações que mantêm os negócios de pé quando as condições mudam.",
      },
      {
        heading: "Ler vários mercados, não uma média",
        text: "A economia africana não cabe numa média continental. Uma leitura útil cruza políticas nacionais, acesso a pagamentos, custos logísticos e hábitos dos consumidores. É esse trabalho de contexto que separa uma tendência passageira de uma mudança com potencial para durar.",
      },
      {
        text: "Na Msingi, acompanhamos estas dinâmicas com perguntas simples: quem beneficia, que dados sustentam a narrativa e o que ainda não está a ser medido? As respostas começam nos mercados, mas terminam nas pessoas que os constroem.",
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
    body: [
      {
        text: "A diversificação económica costuma ser apresentada como um destino. Na prática, é uma sequência de decisões sobre infraestruturas, talento, acesso a financiamento e capacidade de ligar produtores a clientes.",
      },
      {
        heading: "Oportunidade é também execução",
        text: "Agricultura, logística, serviços financeiros e indústrias criativas são áreas frequentemente apontadas como promissoras. O potencial, contudo, não substitui uma análise de custos, regulação e procura real em cada província.",
      },
      {
        text: "Empresas que conhecem a realidade do terreno podem transformar gargalos em serviços úteis. Isso exige dados mais próximos das comunidades, parcerias duradouras e a disposição de ajustar o modelo de negócio às condições locais.",
      },
      {
        heading: "Uma agenda de longo prazo",
        text: "Atrair investimento produtivo pede previsibilidade e colaboração entre setor privado, instituições e quem já trabalha nas cadeias de valor. As histórias que merecem atenção são as que mostram como essas relações funcionam — e o que ainda precisa de mudar.",
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
    body: [
      {
        text: "A música, o audiovisual, a moda e o design não são apenas expressões culturais: também envolvem propriedade intelectual, empregos, tecnologia e cadeias de distribuição. Tratar estes setores como uma economia exige olhar para o trabalho que acontece antes e depois do palco.",
      },
      {
        heading: "O valor que nem sempre aparece",
        text: "Direitos, contratos claros, meios de pagamento e acesso a novos públicos determinam se a popularidade se transforma em rendimento sustentável. Sem estes alicerces, a circulação global de uma obra pode beneficiar quase todos, menos quem a criou.",
      },
      {
        text: "Para que as indústrias criativas cresçam, é importante investir em formação, infraestrutura e dados. Também é preciso ouvir artistas, produtores e profissionais que conhecem os desafios de cada mercado.",
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
    body: [
      {
        text: "É fácil falar de inovação como se ela começasse com uma aplicação ou uma ronda de investimento. Quase sempre, a parte decisiva é menos visível: as pessoas que aprendem, adaptam ferramentas e tornam um produto útil no seu contexto.",
      },
      {
        heading: "Capacidades que ficam",
        text: "A formação técnica importa, mas não é suficiente. Equipas fortes precisam de experiência de gestão, canais para partilhar conhecimento e ambientes onde seja possível experimentar sem perder de vista as necessidades dos clientes.",
      },
      {
        text: "Quando as empresas investem em talento local, os benefícios podem atravessar setores: fornecedores mais capazes, novos serviços e mais conhecimento acumulado. Medir esses efeitos ajuda a ir além do número de vagas anunciadas.",
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
  body: string[];
  sources?: { title: string; publisher: string | null; url: string }[];
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
    body: [
      "Rebecca Enonchong é uma empresária tecnológica camaronense e fundadora da AppsTech, empresa internacional de soluções de software. A sua trajetória cruza negócios, tecnologia e o trabalho de ampliar a presença de empreendedores africanos em conversas globais.",
      "Ao longo da carreira, tornou-se uma referência para fundadores e profissionais que procuram construir tecnologia a partir do continente. A sua participação em redes de empreendedorismo e inovação dá visibilidade a questões como acesso a capital, políticas públicas e colaboração entre ecossistemas.",
      "A história de Enonchong é também um lembrete de que construir tecnologia em África significa navegar por mercados diversos, formar equipas e defender condições para que mais empresas cresçam a partir das suas comunidades.",
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
    body: [
      "Nascida em Addis Abeba, Bethlehem Tilahun Alemu fundou a soleRebels em 2005. A marca de calçado nasceu da vontade de criar trabalho na sua comunidade e de dar visibilidade internacional ao saber artesanal local.",
      "A proposta da empresa combina técnicas de produção tradicionais, materiais disponíveis na região e uma identidade de marca global. O percurso mostra como um negócio criativo pode aproximar emprego local, conhecimento e acesso a novos mercados.",
      "Alemu também lançou iniciativas ligadas ao couro e ao café etíope. O seu trabalho ajuda a ampliar a conversa sobre empreendedorismo africano para além das narrativas convencionais de tecnologia e capital de risco.",
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
    body: [
      "Mosunmola Abudu, conhecida como Mo Abudu, é uma empresária nigeriana de media e fundadora da EbonyLife. A sua trajetória está ligada à produção e distribuição de histórias africanas para audiências dentro e fora do continente.",
      "Com televisão, cinema e parcerias de distribuição no seu percurso, Abudu tem defendido que histórias locais podem viajar sem perder a sua especificidade. A estratégia combina desenvolvimento de talento, produção de conteúdos e construção de uma marca reconhecível.",
      "A EbonyLife representa uma parte importante de uma indústria criativa em transformação: uma indústria que procura novas fontes de financiamento, melhores estruturas para remunerar criadores e maior controlo sobre a circulação das suas próprias narrativas.",
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
