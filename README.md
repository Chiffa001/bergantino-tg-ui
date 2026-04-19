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

В проекте добавлен workflow [`.github/workflows/ci.yml`](/Users/antonnakanechny/projects/bergantino-tg-ui/.github/workflows/ci.yml:1).

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

## Архитектура

Проект организован по доменам, а не по типам файлов. Цель структуры: держать логику одного бизнес-модуля рядом, чтобы при росте продукта код не расползался одновременно по `pages`, `components`, `api`, `lib` и `hooks`.

### Слои

- `src/shared/` — общий технический слой без доменной логики
- `src/core/` — обязательное бизнес-ядро приложения
- `src/modules/` — подключаемые вертикальные продуктовые модули

### Что лежит где

`src/shared/` содержит переиспользуемые технические части:

- `api/` — базовые HTTP-утилиты
- `lib/` — router, query client, TMA helpers, форматтеры
- `components/` — общий UI и error-компоненты
- `icons/` — общие иконки
- `constants/` — технические константы
- `pages/` — общие страницы вроде `403`, `404`, `500`, `not-in-telegram`

`src/core/` содержит базовые домены, без которых приложение не работает:

- `auth/` — Telegram auth, session, auth store, guard
  Внутри сейчас есть `api/`, `model/`, `store/`, `components/`.
- `workspace/` — workspace CRUD, роли, статусы, участники, маршруты и host-shell workspace
  Внутри сейчас есть `api/`, `model/`, `bot/`, `context/`, `members/`, `routing/`, `components/`, `pages/`.
- `invites/` — invite flow и связанная логика доступа
  Внутри сейчас есть `api/`, `model/`, `lib/`, `hooks/`, `pages/`.
- `groups/` — отдельный внутри `core` домен групп
  Внутри сейчас есть `api/`, `model/`, `components/`, `hooks/`, `pages/`.

`src/modules/` содержит отдельные продуктовые модули. Сейчас реализован:

- `billing/` — тарифы, биллинг, смена плана, лимиты и billing-domain logic
  Внутри сейчас есть `components/`, `domain/`, `pages/`.

### Текущие границы

- `shared` — только общая инфраструктура и нейтральные UI-части, без знания о бизнес-доменах.
- `core` — обязательные домены приложения. Домены внутри `core` могут зависеть от `shared` и друг от друга, если это часть базового продуктового flow.
- `modules` — факультативные или расширяемые продуктовые вертикали поверх ядра. Они могут зависеть от `core` и `shared`, но не друг от друга.

### Принципы

- Всё, что относится к конкретному модулю, хранится рядом: `types`, `requests`, `queries`, `components`, `pages`, локальная доменная логика.
- `shared` не знает о доменах.
- внутри `core` допустимы зависимости между доменами, если это базовый flow приложения.
- `modules` могут импортировать из `core` и `shared`, но не друг из друга.
- Новую функциональность нужно добавлять либо в существующий домен `core`, либо в отдельный каталог внутри `src/modules/`.

### Нюанс billing

`billing` сейчас организован как модуль с собственным `domain/`, но использует API-контракты и query/request слой из `core/workspace`.
Это осознанно:

- `core/workspace` остаётся источником общих backend-контрактов workspace
- `modules/billing` отвечает за billing-specific UI и business logic
- если billing API со временем станет полностью самостоятельным bounded context, `types/requests/queries` можно будет перенести внутрь `modules/billing/`

### Пример структуры

```text
src/
├── app.svelte
├── main.ts
├── screens.svelte
├── core/
│   ├── auth/
│   │   ├── api/
│   │   ├── components/
│   │   ├── model/
│   │   └── store/
│   ├── workspace/
│   │   ├── api/
│   │   ├── bot/
│   │   ├── components/
│   │   ├── context/
│   │   ├── members/
│   │   ├── model/
│   │   ├── pages/
│   │   └── routing/
│   ├── invites/
│   │   ├── api/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── model/
│   │   └── pages/
│   └── groups/
│       ├── api/
│       ├── components/
│       ├── hooks/
│       ├── model/
│       └── pages/
├── modules/
│   └── billing/
│       ├── components/
│       ├── domain/
│       └── pages/
└── shared/
    ├── api/
    ├── components/
    ├── constants/
    ├── icons/
    ├── lib/
    └── pages/
```
