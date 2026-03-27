import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import svelteConfig from './svelte.config.js';

export default defineConfig(
  {
    ignores: ['dist', 'node_modules'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...svelte.configs.recommended,
  {
    files: ['**/*.{js,ts,svelte}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'object-curly-spacing': ['error', 'always'],
      'semi': ['error', 'always'],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.eslint.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
        },
      ],
    },
  },
  {
    files: ['**/*.svelte', '**/*.svelte.ts'],
    languageOptions: {
      parserOptions: {
        project: null,
        projectService: {
          allowDefaultProject: ['eslint.config.js', 'svelte.config.js'],
        },
        extraFileExtensions: ['.svelte'],
        tsconfigRootDir: import.meta.dirname,
        parser: tseslint.parser,
        svelteConfig,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
        },
      ],
      'svelte/first-attribute-linebreak': [
        'error',
        {
          multiline: 'below',
          singleline: 'beside',
        },
      ],
      'svelte/html-closing-bracket-new-line': [
        'error',
        {
          multiline: 'always',
          singleline: 'never',
        },
      ],
      'svelte/max-attributes-per-line': [
        'error',
        {
          multiline: 1,
          singleline: 1,
        },
      ],
      'svelte/indent': [
        'error',
        {
          indent: 2,
        },
      ],
    },
  }
);
