# ==========================
# Etapa 1: Build
# ==========================
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Vite "hornea" las variables VITE_* EN TIEMPO DE BUILD.
# La URL del backend se lee de .env.production (incluido en el repo).
RUN npm run build

# ==========================
# Etapa 2: Servir con nginx
# ==========================
FROM nginx:alpine

# Copiamos el build estático generado por Vite
COPY --from=build /app/dist /usr/share/nginx/html

# Config de nginx para que React Router funcione al recargar rutas (/anuncios/5, etc.)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx","-g","daemon off;"]