# Consulta NCM - Self-Hosted com Docker

## Estrutura: `lab.intruser.cloud/ccpf`

## Pré-requisitos
- Docker e Docker Compose instalados
- Nginx já configurado para `lab.intruser.cloud`

## Deploy Passo a Passo

### 1. Build do Frontend (na sua máquina local)
```bash
# No diretório raiz do projeto
npm install
npm run build
```

### 2. Copiar arquivos para o servidor
```bash
# Copiar pasta server/ para o servidor
scp -r server/ usuario@lab.intruser.cloud:/opt/consulta-ncm/

# Copiar o build do frontend para dentro de server/public
scp -r dist/* usuario@lab.intruser.cloud:/opt/consulta-ncm/public/
```

### 3. No servidor: subir o container
```bash
cd /opt/consulta-ncm
docker compose up -d --build
```

### 4. Configurar Nginx (subpath /ccpf)
Adicione ao seu `server {}` existente de `lab.intruser.cloud`:

```nginx
location /ccpf/ {
    proxy_pass http://127.0.0.1:3001/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 5. Testar
Acesse: `https://lab.intruser.cloud/ccpf`

## Comandos Úteis
```bash
docker compose logs -f        # Ver logs em tempo real
docker compose restart         # Reiniciar
docker compose down            # Parar
docker compose up -d --build   # Rebuild após mudanças
```

## Estrutura no Servidor
```
/opt/consulta-ncm/
├── Dockerfile
├── docker-compose.yml
├── index.js
├── package.json
└── public/          # Build do React (conteúdo da pasta dist/)
    ├── index.html
    └── assets/
```

## Atualizar
```bash
# Na máquina local: rebuild
npm run build

# Copiar novo build
scp -r dist/* usuario@lab.intruser.cloud:/opt/consulta-ncm/public/

# No servidor: rebuild container
cd /opt/consulta-ncm
docker compose up -d --build
```
