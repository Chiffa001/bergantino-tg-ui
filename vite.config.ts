import path from 'node:path';

import { svelte } from '@sveltejs/vite-plugin-svelte';
import mkcert from 'vite-plugin-mkcert';
import { defineConfig } from 'vitest/config';

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => ({
  plugins: [
    svelte(),
    command === 'serve' && mode !== 'test' && mode !== 'playwright' ? mkcert() : null,
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      ...(mode === 'playwright'
        ? { '@tma.js/sdk-svelte': path.resolve(import.meta.dirname, 'e2e/mocks/tma-sdk.mock.ts') }
        : {}),
    },
  },
  test: {
    exclude: ['e2e/**', 'node_modules/**'],
  },
  server: {
    fs: {
      allow: [
        path.resolve(import.meta.dirname),
        path.resolve(import.meta.dirname, '../tg-svelte-ui'),
      ],
    },
  },
}));
