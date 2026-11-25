# syntax=docker/dockerfile:1

# этап сборки
FROM node:24-alpine AS build
WORKDIR /app
# бинарник Cypress (~500 МБ) в прод-сборке не нужен — только для e2e
ENV CYPRESS_INSTALL_BINARY=0
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# продакшн-образ: статика через nginx
FROM nginx:alpine AS prod
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 5174
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null "http://127.0.0.1:5174/" || exit 1
