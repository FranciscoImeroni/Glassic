# Etapa 1: frontend
FROM node:22-alpine AS build-frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

# Etapa 2: backend
FROM node:22-alpine AS build-backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ .
# Copiar dist de frontend
COPY --from=build-frontend /app/frontend/dist ./frontend
RUN npm run build

# Etapa 3: producción
FROM node:22-alpine
WORKDIR /app/backend
COPY --from=build-backend /app/backend ./
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
