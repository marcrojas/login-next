# Etapa 1: Construcción de la aplicación
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar archivos de la aplicación
COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Construir la aplicación Next.js
RUN npm run build

# Etapa 2: Servir la aplicación usando Next.js
FROM node:18-alpine AS runner

WORKDIR /app

# Copiar solo los archivos necesarios del builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/node_modules node_modules

# Exponer el puerto 3000
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]