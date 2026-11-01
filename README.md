# Bantaba Africa

Revista digital e grupo independente de pesquisa sobre pessoas, ideias e mercados africanos. A plataforma combina artigos e biografias editoriais com propostas de criadores, perfis, comentários, newsletter, revisão pela redação e oportunidades de divulgação patrocinada. Conteúdo pago é identificado e não compra aprovação editorial.

## Stack

- Next.js 16 App Router, React 19 e TypeScript.
- PostgreSQL (Supabase, Aiven ou outro fornecedor) com Drizzle ORM e migrações versionadas.
- Better Auth para contas, sessões, verificação de e-mail e recuperação de palavra-passe.
- Flutterwave para campanhas avulsas e assinatura Creator Plus (USD 5/mês).
- Resend para e-mails transacionais.
- Deploy em Vercel ou Docker, com saída Next.js `standalone`.

## Desenvolvimento local

1. Instale Node.js 22 LTS e copie `.env.example` para `.env.local`.
2. Preencha `DATABASE_URL` com a ligação PostgreSQL, `BETTER_AUTH_SECRET` (mínimo 32 caracteres) e `BETTER_AUTH_URL=http://localhost:3000`. Configure também `NEXT_PUBLIC_SITE_URL`.
3. Instale dependências e crie/aplique as migrações:

   ```bash
   npm ci
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   npm run dev
   ```

`db:generate` requer uma variável `DATABASE_URL`, mas não liga ao servidor. `db:migrate` e `db:seed` precisam de acesso real ao PostgreSQL. O comando de migração usa a mesma ligação PostgreSQL e validação TLS da aplicação. Os CAs públicos Aiven e Supabase são selecionados pelo hostname e incluídos no bundle, mantendo a validação TLS ativa. Para outro PostgreSQL com uma autoridade própria, configure o respetivo PEM em `DATABASE_CA_CERT`; não desative `rejectUnauthorized` para contornar erros de certificado.

Sem `DATABASE_URL`, as páginas públicas podem apresentar conteúdo de demonstração; autenticação, propostas, pagamentos e operações editoriais precisam de PostgreSQL. Erros de ligação a uma base de dados configurada são apresentados, não ocultados por conteúdo fictício.

## Contas e redação

- O registo cria uma conta de utilizador; verificar o endereço de e-mail é obrigatório. Em desenvolvimento, os links de verificação e recuperação são impressos no terminal se o Resend não estiver configurado. Em produção, configure `RESEND_API_KEY` e `RESEND_FROM_EMAIL`.
- Criadores editam o perfil e submetem artigos ou biografias em `/painel`. Submissões entram na fila de `/redacao`; somente a redação pode editar, aprovar ou rejeitar.
- O plano gratuito não aceita ligações ou fontes nas propostas. Creator Plus permite referências verificáveis enquanto a assinatura estiver ativa.
- Para criar um administrador: registe e verifique a conta, defina `ADMIN_EMAIL` com o endereço correspondente e execute `npm run db:seed`. O seed atualiza a função da conta existente; não promove automaticamente uma conta ainda não criada. Por omissão, publica apenas os artigos e perfis editoriais com fontes incluídos no projeto, incluindo as respetivas referências e metadados SEO. Para popular também um ambiente local de teste com exemplos demonstrativos, defina `SEED_DEMO_CONTENT=true` antes de executar `npm run db:seed`; o seed bloqueia expressamente esses exemplos em produção.
- Comentários passam pela fila de moderação. Likes requerem conta; artigos, perfis e entidades publicados têm páginas públicas e metadados estruturados.
- Cada artigo ou biografia tem metadados SEO independentes: título, descrição e palavras-chave editáveis pela redação, além de canonical, Open Graph, Twitter e dados estruturados. Quando as palavras-chave editoriais não são informadas, a página usa sugestões próprias derivadas do título, tema e dados da biografia, nunca uma lista global partilhada. Palavras-chave ajudam a descrever a página, mas não garantem posições nos resultados de pesquisa.
- As inscrições da newsletter podem ser canceladas pelo link no rodapé. O sistema envia uma ligação de cancelamento ao endereço inscrito.

## Pagamentos

Configure `FLW_SECRET_KEY` e `NEXT_PUBLIC_SITE_URL` para ativar pagamentos avulsos. Os valores dos pacotes são definidos e validados no servidor. As propostas ficam persistidas antes do checkout; a redação decide a publicação e identifica o patrocínio. Uma recusa pode exigir reembolso manual pela administração.

Para Creator Plus, crie no painel Flutterwave um plano de **USD 5 com periodicidade mensal** e configure o respetivo identificador em `FLW_PAYMENT_PLAN_ID`. Configure também `FLW_SECRET_HASH` e o webhook Flutterwave para `https://SEU-DOMINIO/api/payments/webhook`. O servidor verifica transações junto à API Flutterwave e deduplica eventos recebidos. Use credenciais de teste antes de produção.

## Migrações e publicação

Gere e versiona uma migração sempre que o schema mudar:

```bash
npm run db:generate
npm run db:migrate
```

`db:migrate` deve ser executado com credenciais de banco disponíveis e antes de expor a versão nova da aplicação. O comando e o seed carregam `.env.local` (ou `.env`) e verificam TLS com a CA oficial selecionada automaticamente para hostnames Aiven ou Supabase. Depois de configurar localmente a ligação PostgreSQL, execute `npm run db:migrate` e `npm run db:seed` a partir da raiz do projeto.

### Vercel

Importe o repositório com o preset Next.js. Configure `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_EDITORIAL_EMAIL` e, conforme os recursos ativados, as variáveis `RESEND_*`, `FLW_*` e `ADMIN_EMAIL`. Para Aiven e Supabase, o CA público correspondente é incluído e selecionado automaticamente pelo hostname — não é necessário guardar o certificado numa variável do Vercel. Para outro servidor PostgreSQL com uma CA própria, configure o PEM em `DATABASE_CA_CERT`. Aplique migrações ao banco antes de direcionar tráfego para a versão nova. A URL pública deve usar HTTPS e corresponder aos domínios permitidos para autenticação.

### Docker

Configure as variáveis necessárias num ficheiro `.env` local (não o adicione ao Git). O `compose.yaml` encaminha as variáveis para o contentor e passa os valores públicos ao build:

```bash
npm ci
npm run db:migrate
docker compose build
docker compose up -d
```

Execute a migração a partir do ambiente que tem o CLI Drizzle instalado e acesso ao PostgreSQL, antes de iniciar a nova versão.

Também é possível usar `docker build --build-arg NEXT_PUBLIC_SITE_URL=https://SEU-DOMINIO -t bantaba-africa .` e executar a imagem com as variáveis de runtime. A imagem usa utilizador sem privilégios e o servidor standalone do Next.js.

## Validação

```bash
npm run lint
npm run typecheck
npm run build
```
