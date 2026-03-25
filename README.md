# rus-food

Frontend-проект на `Svelte 5`, `TypeScript` и `Vite`.

## Технологии

- `Svelte 5` для UI
- `TypeScript` для типизации
- `Vite` для dev server и production build
- `ESLint` для линтинга
- `svelte-check` для проверки Svelte + TypeScript

## Требования

- `Node.js` 20+
- `npm`

## Установка

```bash
npm install
```

## Запуск проекта

Запуск dev server:

```bash
npm run dev
```

Production build:

```bash
npm run build
```

Локальный preview production build:

```bash
npm run preview
```

## Проверки

Проверка Svelte и TypeScript:

```bash
npm run check
```

Проверка ESLint:

```bash
npm run lint
```

Автофикс ESLint:

```bash
npm run lint:fix
```

Полная проверка перед коммитом или пушем:

```bash
npm run lint-stage
```

## GitHub Actions

В проекте добавлен workflow [`.github/workflows/ci.yml`](/Users/antonnakanechny/projects/rus-food/.github/workflows/ci.yml#L1).

Он запускается на:

- `push` в `main`
- `pull_request`

Pipeline выполняет:

- `npm ci`
- `npm run lint`
- `npm run check`
- `npm run build`

## Правила линтинга

В проекте настроены:

- обязательные `;`
- сортировка импортов
- `import type` для type-only импортов в `.ts` и `.svelte`

## Алиасы импортов

Настроен alias `@/` на директорию `src`.

Пример:

```ts
import App from '@/app.svelte';
```

## Структура

Основной исходный код лежит в `src/`.
