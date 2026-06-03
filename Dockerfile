# ==========================
# Etapa 1: Build
# ==========================
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ==========================
# Etapa 2: Servir la aplicación
# ==========================
FROM nginx:alpine

# Eliminamos configuración por defecto
RUN rm /etc/nginx/conf.d/default.conf

# Copiamos nuestra config personalizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiamos el build de Vite
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]