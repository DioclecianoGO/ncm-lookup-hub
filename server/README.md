# Consulta NCM - Self-Hosted

## Pré-requisitos
- Node.js 18+ (`curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt install nodejs`)
- Nginx (já instalado no seu servidor)

## Deploy Passo a Passo

### 1. Build do Frontend
No diretório raiz do projeto:
```bash
npm install
npm run build
```
Isso gera a pasta `dist/` com os arquivos estáticos.

### 2. Preparar o Servidor
```bash
# Criar diretório no servidor
sudo mkdir -p /var/www/consulta-ncm

# Copiar a pasta server/ e o build
scp -r server/ usuario@seuservidor:/var/www/consulta-ncm/
scp -r dist/ usuario@seuservidor:/var/www/consulta-ncm/server/public
```

### 3. Instalar Dependências no Servidor
```bash
cd /var/www/consulta-ncm/server
npm install --production
```

### 4. Rodar com PM2 (processo em background)
```bash
# Instalar PM2 globalmente
sudo npm install -g pm2

# Iniciar o servidor
cd /var/www/consulta-ncm/server
pm2 start index.js --name consulta-ncm
pm2 save
pm2 startup  # para iniciar automaticamente no boot
```

### 5. Configurar Nginx
```bash
# Copiar configuração
sudo cp nginx.conf.example /etc/nginx/sites-available/consulta-ncm
sudo ln -s /etc/nginx/sites-available/consulta-ncm /etc/nginx/sites-enabled/

# Editar o server_name com seu domínio
sudo nano /etc/nginx/sites-available/consulta-ncm

# Testar e reiniciar
sudo nginx -t
sudo systemctl reload nginx
```

### 6. HTTPS com Certbot (opcional mas recomendado)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d seudominio.com.br
```

## Estrutura Final no Servidor
```
/var/www/consulta-ncm/server/
├── index.js          # Servidor Node.js (API + static)
├── package.json
├── nginx.conf.example
└── public/           # Build do React (conteúdo da pasta dist/)
    ├── index.html
    └── assets/
```

## Comandos Úteis
```bash
pm2 logs consulta-ncm    # Ver logs
pm2 restart consulta-ncm # Reiniciar
pm2 status               # Status dos processos
```
