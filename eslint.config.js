import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import stylistic from '@stylistic/eslint-plugin';
import jsdoc from 'eslint-plugin-jsdoc';
import reactCompiler from 'eslint-plugin-react-compiler';

/**
 * Centered application quality gate pipeline.
 * Synchronizes abstract syntactic controls, type checking, and documentation rules.
 */
export default tseslint.config(
  {
    ignores: ['dist', 'build', 'node_modules', 'agents.md', '.agents/**'],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  jsdoc.configs['flat/recommended-typescript'],

  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@stylistic': stylistic,
      prettier: eslintPluginPrettier,
      jsdoc: jsdoc,
      'react-compiler': reactCompiler,
      'react-refresh': reactRefresh,
    },
    settings: {
      jsdoc: {
        mode: 'typescript',
      },
    },
    rules: {
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      'prettier/prettier': [
        'error',
        { endOfLine: 'auto' },
        { usePrettierrc: true },
      ],

      // Restricts raw development logging mechanisms inside system runtime boundaries.
      // Total lockdown on standard console methods; logging must route via AppLogger.
      'no-console': 'error',

      // Demands mandatory operation routing inside exception handlers.
      // Explicitly forbids silent failure states and completely empty catch structures.
      'no-empty': ['error', { allowEmptyCatch: false }],

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
      'jsdoc/require-param-type': 'off',
      'jsdoc/require-returns': 'off',
      'jsdoc/require-returns-description': 'off',
      'jsdoc/require-returns-type': 'off',
      'jsdoc/require-property': 'off',
      'jsdoc/require-property-description': 'off',

      // Enforce TSDoc standard: completely forbid plain JS types in comments
      'jsdoc/no-types': 'error',

      // Forbids ALL standard JSDoc/TSDoc tags, forcing developers to write only descriptive text.
      'jsdoc/no-restricted-tags': [
        'error',
        {
          tags: {
            '*': {
              message:
                'Tags are forbidden in Strict Tagless Mode. Use clean markdown text blocks instead.',
            },
          },
        },
      ],

      // Enforces strict execution safety boundaries for the React 19 automatic memoization matrix
      'react-compiler/react-compiler': 'error',

      // Secures error catching blocks by demanding transparent stack tracing cause assignments
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },

  eslintConfigPrettier,

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
  }
);
