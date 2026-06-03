# ==========================
# Etapa 1: Build
# ==========================
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN NODE_OPTIONS="--max-old-space-size=512" npm run build

# ==========================
# Etapa 2: Servir la aplicación
# ==========================
FROM nginx:alpine

# Eliminamos configuración por defecto y creamos la nuestra inline
RUN rm -f /etc/nginx/conf.d/default.conf && \
    echo 'server { \
    listen 80; \
    server_name localhost; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Copiamos el build de Vite
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]