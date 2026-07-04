import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import stylistic from '@stylistic/eslint-plugin';
import jsdoc from 'eslint-plugin-jsdoc';

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
      jsdoc: jsdoc,
    },
    settings: {
      jsdoc: {
        mode: 'typescript',
      },
    },
    rules: {
      'prettier/prettier': [
        'error',
        { endOfLine: 'auto' },
        { usePrettierrc: true },
      ],

      // TS-First Documentation Validation (Strict Tagless Mode)
      'jsdoc/require-jsdoc': [
        'error',
        {
          enableFixer: false,
          require: {
            FunctionDeclaration: false,
            MethodDefinition: false,
            ClassDeclaration: false,
            ArrowFunctionExpression: false,
          },
          contexts: [
            // Target all exported functional modules (React components and hooks)
            'ExportNamedDeclaration > VariableDeclaration > VariableDeclarator > ArrowFunctionExpression',
            'ExportNamedDeclaration > FunctionDeclaration',

            // Target every TypeScript interface definition itself
            'TSInterfaceDeclaration',

            // Target every single property descriptor inside interfaces and type mappings
            'TSInterfaceDeclaration TSPropertySignature',
            'TSTypeAliasDeclaration TSPropertySignature',
          ],
        },
      ],

      // Completely deactivate legacy JS function-level parameters and property validations
      'jsdoc/require-param': 'off',
      'jsdoc/require-param-description': 'off',
      'jsdoc/require-returns': 'off',
      'jsdoc/require-returns-description': 'off',
      'jsdoc/require-property': 'off',
      'jsdoc/require-property-description': 'off',

      // Enforce TSDoc standard: completely forbid plain JS types in comments
      'jsdoc/no-types': 'error',

      // Strict enforcement of the Tagless Paradigm: block completely all standard tags starting with @
      'jsdoc/check-tag-names': [
        'error',
        {
          definedTags: [],
        },
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
