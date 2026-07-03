import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import stylistic from '@stylistic/eslint-plugin';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parser: tseslint.parser,
    },
    plugins: {
      '@stylistic': stylistic,
      prettier: eslintPluginPrettier,
    },
    rules: {
      'prettier/prettier': [
        'error',
        { endOfLine: 'auto' },
        { usePrettierrc: true },
      ],
    },
  },

  // 1. Turn off all formatting rules that conflict with Prettier first
  eslintConfigPrettier,

  // 2. Apply our custom stylistic rules LAST so they strictly override Prettier's clean-up
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@stylistic/padding-line-between-statements': [
        'error',
        // Enforce mandatory blank line before return and throw keywords
        { blankLine: 'always', prev: '*', next: ['return', 'throw'] },

        // Enforce logical splitting: add empty line after data initializations
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        {
          blankLine: 'any',
          prev: ['const', 'let', 'var'],
          next: ['const', 'let', 'var'],
        },

        // Isolate structural operations (loops, conditions) with whitespace
        {
          blankLine: 'always',
          prev: '*',
          next: ['try', 'if', 'switch', 'for', 'while'],
        },
        {
          blankLine: 'always',
          prev: ['try', 'if', 'switch', 'for', 'while'],
          next: '*',
        },
      ],
    },
  },
]);
