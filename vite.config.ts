import path from 'node:path';

import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert';

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => ({
  plugins: [svelte(), command === 'serve' && mode !== 'test' ? mkcert() : null].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
    },
  },
  server: {
    fs: {
      allow: [
        path.resolve(import.meta.dirname),
        path.resolve(import.meta.dirname, '../../tg-svelte-ui'),
      ],
    },
  },
}));
