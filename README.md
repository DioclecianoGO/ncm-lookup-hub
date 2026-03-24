# Consulta NCM PF

Ferramenta web para consulta de NCM, com frontend em React/Vite e opção de execução self-hosted com backend Node.js/Express.

## Objetivo

A aplicação foi construída para apoiar consultas e conferências internas de NCM em ambiente de laboratório, com interface simples para pesquisa e API própria para operação self-hosted.

## Principais recursos

- consulta de NCM por código de 8 dígitos;
- frontend em React + Vite;
- backend self-hosted em Node.js + Express;
- endpoint de health check para validação operacional;
- publicação atrás de reverse proxy (ex.: Nginx/Hestia).

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

## Fluxo de trabalho

### Lovable
Use para ajustes visuais e preview rápido. As mudanças sincronizam com o GitHub na branch padrão.

### GitHub
Use para versionamento, documentação e alterações manuais em frontend e backend.

### Servidor self-hosted
O deploy no VPS não é automático. Depois de mudanças no Lovable ou no GitHub, o servidor precisa ser atualizado manualmente ou por CI/CD.

## Estado atual do laboratório

- hostname: `ncm.lab.intruser.cloud`;
- frontend estático servido pelo Hestia/Nginx em `public_html`;
- backend self-hosted em container Docker escutando em `127.0.0.1:3001`;
- proxy reverso para `/api/` e `/health` via Nginx/Hestia;
- DNS do hostname em modo `DNS only`.

## Atualização do servidor após mudanças no frontend

```bash
cd /opt/ncm-lookup-hub/current/src
git pull origin main

docker run --rm \
  -v /opt/ncm-lookup-hub/current/src:/app \
  -w /app \
  node:20-bookworm \
  bash -lc 'npm install && npm run build'

rsync -a --delete /opt/ncm-lookup-hub/current/src/dist/ /opt/ncm-lookup-hub/current/app/public/
rsync -a --delete /opt/ncm-lookup-hub/current/app/public/ /home/user/web/ncm.lab.intruser.cloud/public_html/
```

## Importante

- alterações somente de frontend normalmente não exigem rebuild do container no ambiente atual;
- alterações no backend (`server/index.js`, `server/package.json`, `Dockerfile`, `docker-compose.yml`) exigem rebuild do serviço Docker.

## Deploy

Para instruções específicas do modo self-hosted, consulte:

- [`server/README.md`](server/README.md)

## Health check

Endpoint exposto pela aplicação self-hosted:

```text
/health
```

Resposta esperada:

```json
{"status":"ok"}
```
