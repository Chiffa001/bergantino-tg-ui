# Авторизация через Telegram

Описание плана реализации авторизации: получение `initData` из Telegram SDK, обмен на JWT через API, хранение токена и защита маршрутов.

---

## Содержание

1. [Общая схема](#1-общая-схема)
2. [Получение initData из Telegram SDK](#2-получение-initdata-из-telegram-sdk)
3. [API-запрос авторизации](#3-api-запрос-авторизации)
4. [Хранение токена и данных пользователя](#4-хранение-токена-и-данных-пользователя)
5. [Защита маршрутов](#5-защита-маршрутов)
6. [Структура файлов](#6-структура-файлов)

---

## 1. Общая схема

```
app.svelte
  └── setupTelegramSdk()          — получаем доступ к initData
  └── AuthGuard                   — обёртка над Screens
        └── useQuery(authQuery)   — POST /auth/telegram с initData
              ├── pending  → экран загрузки
              ├── error 4xx → /not-in-telegram
              ├── error 5xx → /internal-server-error
              └── success  → сохраняем токен
                    ├── is_super_admin: false → /forbidden
                    └── is_super_admin: true  → рендерим Screens (/ → список workspace-ов)
```

---

## 2. Получение initData из Telegram SDK

`initData` — строка с данными запуска Mini App, подписанная Telegram. Берётся из `@tma.js/sdk-svelte`.

```ts
// src/lib/tma.ts — добавить экспорт
import { initData } from '@tma.js/sdk-svelte';

export function getInitData(): string {
  return initData.raw() ?? '';
}
```

`initData.raw()` возвращает URL-encoded строку вида:
```
query_id=AAE...&user=%7B%22id%22%3A123...%7D&auth_date=1700000000&hash=abc123...
```

Она передаётся на бэкенд без изменений.

---

## 3. API-запрос авторизации

### Эндпоинт

```
POST /auth/telegram
Content-Type: application/json

{ "init_data": "<raw initData string>" }
```

### Ответ

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "full_name": "Ivan Petrov",
    "username": "ivanpetrov",
    "is_super_admin": false
  }
}
```

### Типы

```ts
// src/api/auth/types.ts
export type AuthResponse = {
  access_token: string;
  token_type: 'bearer';
  user: CurrentUser;
};

export type CurrentUser = {
  id: string;
  full_name: string;
  username: string | null;
  is_super_admin: boolean;
};
```

### Функция запроса

```ts
// src/api/auth/requests.ts
import { getInitData } from '@/lib/tma';

export const authByTelegram = async (): Promise<AuthResponse> => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/telegram`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ init_data: getInitData() }),
  });

  if (res.status >= 400 && res.status < 500) throw new Error('client_error');
  if (!res.ok) throw new Error('server_error');

  return res.json();
};
```

### Query через TanStack Query

```ts
// src/api/auth/queries.ts
import { createQuery } from '@tanstack/svelte-query';
import { authByTelegram } from './requests';

export const createAuthQuery = () =>
  createQuery({
    queryKey: ['auth'],
    queryFn: authByTelegram,
    retry: false,
    staleTime: Infinity,
  });
```

`staleTime: Infinity` — токен не протухает в течение сессии, повторный запрос не нужен.
`retry: false` — не стоит ретраить 401/403.

---

## 4. Хранение токена и данных пользователя

Токен хранится в `localStorage`. Для доступа к нему из любой части приложения — отдельный модуль.

```ts
// src/lib/auth.ts
import type { CurrentUser } from '@/api/auth/types';

const TOKEN_KEY = 'access_token';

export const authStore = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};
```

Данные текущего пользователя (объект `user`) берутся напрямую из кэша TanStack Query — `queryClient.getQueryData(['auth'])`. Отдельно хранить не нужно.

### Добавление токена в запросы

Создать вспомогательную функцию для авторизованных запросов:

```ts
// src/lib/fetch.ts
import { authStore } from './auth';

export const apiFetch = (path: string, init?: RequestInit) =>
  fetch(`${import.meta.env.VITE_API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
      Authorization: `Bearer ${authStore.getToken()}`,
    },
  });
```

---

## 5. Защита маршрутов

Создать компонент `AuthGuard`, который оборачивает `Screens` в `app.svelte`.

```svelte
<!-- src/components/auth-guard.svelte -->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { router } from '@/lib/router';
  import { authStore } from '@/lib/auth';
  import { createAuthQuery } from '@/api/auth/queries';

  type Props = { children: Snippet };
  let { children }: Props = $props();

  const query = createAuthQuery();

  $effect(() => {
    if ($query.isSuccess) {
      authStore.setToken($query.data.access_token);

      if (!$query.data.user.is_super_admin) {
        router.navigate('/forbidden', { replace: true });
      }
    }

    if ($query.isError) {
      const isClientError = $query.error.message === 'client_error';
      router.navigate(isClientError ? '/not-in-telegram' : '/internal-server-error', { replace: true });
    }
  });
</script>

{#if $query.isPending}
  <!-- TODO: заменить на компонент загрузки -->
{:else if $query.isSuccess && $query.data.user.is_super_admin}
  {@render children()}
{/if}
```

В `app.svelte` обернуть `Screens`:

```svelte
<!-- app.svelte -->
<AuthGuard>
  <Screens />
</AuthGuard>
```

---

## 6. Структура файлов

```
src/
├── api/
│   └── auth/
│       ├── types.ts       — AuthResponse, CurrentUser
│       ├── requests.ts    — authByTelegram()
│       └── queries.ts     — createAuthQuery()
├── components/
│   └── auth-guard.svelte  — обёртка с логикой авторизации
└── lib/
    ├── auth.ts            — работа с токеном в localStorage
    ├── fetch.ts           — apiFetch() с Authorization header
    └── tma.ts             — добавить getInitData()
```

### Переменные окружения

```env
VITE_API_URL=https://api.example.com
```
