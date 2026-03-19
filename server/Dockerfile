FROM node:18-alpine

WORKDIR /app

# Copiar dependências
COPY package.json ./
RUN npm install --production

# Copiar código do servidor
COPY index.js ./

# Copiar build do frontend (será copiado no docker-compose ou no build)
COPY public/ ./public/

EXPOSE 3001

CMD ["node", "index.js"]
