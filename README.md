# Consulta NCM PF

Ferramenta web para consulta de NCM, com interface em React/Vite e opção de execução self-hosted com backend Node.js/Express.

## Objetivo

A aplicação foi construída para apoiar consultas e conferências internas de NCM em ambiente de laboratório, com uma interface simples para pesquisa e uma API própria para operação self-hosted.

## Principais recursos

- consulta de NCM por código de 8 dígitos;
- frontend em React + Vite;
- backend self-hosted em Node.js + Express;
- endpoint de health check para validação operacional;
- possibilidade de publicação atrás de reverse proxy (ex.: Nginx/Hestia).

## Tecnologias utilizadas

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Node.js
- Express
- Docker

## Estrutura do repositório

```text
.
├── src/                 # frontend React/Vite
├── public/              # ativos estáticos do frontend
├── server/              # backend self-hosted
├── supabase/            # artefatos do modo Lovable/Supabase
├── index.html           # documento base do frontend
└── package.json         # dependências e scripts da aplicação
```

## Desenvolvimento local

```bash
npm install
npm run dev
```

A aplicação será disponibilizada localmente pelo Vite em modo de desenvolvimento.

## Build do frontend

```bash
npm install
npm run build
```

O build gerado será criado na pasta `dist/`.

## Execução self-hosted

O modo self-hosted utiliza o backend da pasta `server/` para servir os arquivos estáticos do frontend e expor a API.

Fluxo resumido:

1. gerar o build do frontend na raiz do projeto;
2. copiar o conteúdo de `dist/` para `server/public/`;
3. subir o backend self-hosted.

Exemplo resumido:

```bash
npm install
npm run build
rsync -a dist/ server/public/
cd server
npm install
npm start
```

## Docker

O diretório `server/` contém os artefatos necessários para execução via Docker em ambiente self-hosted.

Exemplo:

```bash
cd server
docker compose up -d --build
```

## Deploy

A publicação self-hosted pode ser feita atrás de reverse proxy, com frontend servido estaticamente e rotas de API encaminhadas ao backend Node.js.

Para instruções mais específicas de implantação do servidor self-hosted, consulte:

- [`server/README.md`](server/README.md)

## Health check

A aplicação self-hosted expõe o endpoint:

```text
/health
```

Resposta esperada:

```json
{"status":"ok"}
```

## Observações

- o projeto foi inicialmente estruturado a partir de um fluxo gerado no Lovable, mas o repositório pode ser mantido e evoluído de forma independente;
- metadados sociais e branding do frontend podem ser ajustados conforme o ambiente de publicação;
- para ambientes públicos, recomenda-se uso de HTTPS válido e reverse proxy com controles mínimos de exposição.
