# bus-orel-admin

Админ-панель для управления автобусными турами (отелями), экскурсиями и гостиничными номерами. SPA на Vue 3, собирается Vite, работает на REST API бэкенда [bus-orel-backend](../bus-orel-backend) (NestJS + MongoDB). Публичный сайт — [bus-orel-front](../bus-orel-front).

API-контракт бэкенда описан в `swagger.json` (OpenAPI 3.0) в корне репозитория; источник истины — версия из репозитория бэкенда (регенерируется там командой `npm run swagger:generate`).

## Стек

- Vue 3 (Composition API, `<script setup>`) + TypeScript, Vite
- Vue Router, Pinia
- Tailwind CSS 4 (`@tailwindcss/vite`)
- vee-validate + yup (формы), dayjs, @vuepic/vue-datepicker, @lucide/vue
- Vitest (юнит-тесты), Cypress (e2e), ESLint + Prettier

Архитектура — Feature-Sliced Design (`app → pages → widgets → features → entities → shared`), алиас `@` → `./src`. Подробности — в `AGENTS.md`.

## Требования

- Node.js 24, npm 11 (как у бэкенда)

## Переменные окружения

Копируем `.env.example` в `.env` и заполняем:

| Переменная | Назначение |
|---|---|
| `BASE_URL` | URL бэкенда; dev-прокси Vite перенаправляет на него запросы `/api` |
| `APP_ENV` | Окружение приложения; доступно в коде как `__APP_ENV__` |
| `VITE_BASE_URL` | Заполняется CI при деплое (см. `.github/workflows/node.js.yml`) |

## Команды

| Команда | Назначение |
|---|---|
| `npm install` | Установка зависимостей |
| `npm run dev` | Dev-сервер (Vite, прокси `/api` → `BASE_URL`) |
| `npm run build` | Продакшн-сборка: type-check (`vue-tsc`) + `vite build` |
| `npm run build-only` | Сборка без проверки типов |
| `npm run type-check` | Проверка типов (`vue-tsc --build --force`) |
| `npm run lint` | ESLint с автофиксом |
| `npm run format` | Prettier для `src/**/*.ts` |
| `npm run test:unit` | Юнит-тесты (Vitest) |
| `npm run test:e2e` | E2e-тесты против продакшн-сборки (нужен предварительный `npm run build`) |
| `npm run test:e2e:dev` | E2e-тесты против dev-сервера (Cypress open, быстрее для разработки) |
| `npm run types:generate` | Генерация типов API из `../bus-orel-backend/swagger.json` в `src/shared/api/schema.d.ts` (openapi-typescript). Запускать при изменениях API-контракта бэкенда |

Доменные типы по мере актуализации swagger переводятся на сгенерированные схемы из `src/shared/api/schema.d.ts` (сейчас на них основан `SelectItem`). До закрытия bus-orel-backend IMP-025 часть схем в swagger неточна — такие типы остаются рукописными в `src/entities/*/model/types.d.ts`.

## Деплой

- Продакшн-сборка раздаётся статикой (`dist/`) через `serve` на порту 5174 (PM2, `ecosystem.config.cjs`).
- Vite проксирует `/api` только в dev-режиме; в проде `/api` должен проксировать внешний веб-сервер (nginx).
- Деплой запускается push'ем в `master` (GitHub Actions, self-hosted раннер): сборка + `pm2 restart`. Перед push должны быть зелёными `npm run type-check`, `npm run lint`, `npm run test:unit`, `npm run build`.

Актуальный чеклист выката и известные проблемы — в `BACKLOG.md`.
