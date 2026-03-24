# Consulta NCM - Self-Hosted

Documentação do modo self-hosted atualmente utilizado no ambiente de laboratório.

## Arquitetura atual

A implantação em laboratório está organizada assim:

- hostname público: `ncm.lab.intruser.cloud`;
- frontend estático servido pelo Hestia/Nginx em:
  - `/home/user/web/ncm.lab.intruser.cloud/public_html`
- backend self-hosted em container Docker, escutando em:
  - `127.0.0.1:3001`
- proxy reverso via Hestia/Nginx para:
  - `/api/`
  - `/health`
- DNS do hostname em modo `DNS only`.

## Diretórios principais no servidor

```text
/opt/ncm-lookup-hub/
├── current/
│   ├── src/            # checkout do repositório
│   ├── app/            # runtime self-hosted
│   └── evidence/       # evidências e diagnósticos
├── releases/           # releases staged
└── shared/             # reservado para compartilhamento futuro
```

## Runtime atual

```text
/opt/ncm-lookup-hub/current/app/
├── Dockerfile
├── docker-compose.yml
├── index.js
├── package.json
└── public/
```

## Subida do backend

```bash
cd /opt/ncm-lookup-hub/current/app
docker compose up -d --build
```

## Atualização após mudanças no frontend

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

No estado atual da implantação:
- mudanças somente de frontend normalmente não exigem rebuild do container;
- o container continua responsável principalmente pela API e pelo health check.

## Atualização após mudanças no backend

Se houver alteração em arquivos como:

- `server/index.js`
- `server/package.json`
- `server/Dockerfile`
- `server/docker-compose.yml`

então, além do pull, é necessário rebuildar o serviço Docker:

```bash
cd /opt/ncm-lookup-hub/current/src
git pull origin main

rsync -a --delete /opt/ncm-lookup-hub/current/src/server/ /opt/ncm-lookup-hub/current/app/

cd /opt/ncm-lookup-hub/current/app
docker compose up -d --build
```

## Health check

```text
/health
```

Resposta esperada:

```json
{"status":"ok"}
```

## Logs úteis

```bash
cd /opt/ncm-lookup-hub/current/app
docker compose ps
docker compose logs --tail=100
docker compose logs -f
```
