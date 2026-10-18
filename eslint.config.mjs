import js from '@eslint/js';
import ts from 'typescript-eslint';
import vue from 'eslint-plugin-vue';
import importX from 'eslint-plugin-import-x';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import globals from 'globals';
export default ts.config(
  {
    ignores: [
      'node_modules/**',
      '.cache/**',
      '.data/**',
      '.nuxt/**',
      '.output/**',
      '.output-spa/**',
      'dist/**',
      'coverage/**',
      'shared/api/generated/**',
      'public/**',
      'playwright-report/**',
      'test-results/**',
      '.lighthouseci/**',
    ],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  ...vue.configs['flat/recommended'],
  {
    languageOptions: {
      parserOptions: { parser: ts.parser },
      globals: {
        ...globals.browser,
        ...globals.node,
        defineNuxtConfig: 'readonly',
        defineAppConfig: 'readonly',
        defineI18nConfig: 'readonly',
        defineNuxtPlugin: 'readonly',
        useRuntimeConfig: 'readonly',
        useRequestFetch: 'readonly',
        useAsyncData: 'readonly',
        useHead: 'readonly',
        useSeoMeta: 'readonly',
        useRoute: 'readonly',
        useResponseHeader: 'readonly',
        definePageMeta: 'readonly',
        clearError: 'readonly',
        defineNuxtRouteMiddleware: 'readonly',
        abortNavigation: 'readonly',
        createError: 'readonly',
        navigateTo: 'readonly',
      },
    },
    plugins: { 'import-x': importX },
    settings: {
      'import-x/resolver-next': [
        createTypeScriptImportResolver({ project: '.nuxt/tsconfig.app.json' }),
      ],
      'import-x/extensions': ['.js', '.mjs', '.ts', '.vue'],
      'import-x/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
        'vue-eslint-parser': ['.vue'],
      },
    },
    rules: {
      'import-x/no-cycle': ['error', { ignoreExternal: true }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: { parserOptions: { parser: ts.parser } },
    rules: {
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/html-indent': 'off',
      'vue/html-closing-bracket-newline': 'off',
      'vue/no-v-html': 'error',
      'vue/component-api-style': ['error', ['options']],
      'vue/block-lang': ['error', { script: { lang: 'ts' }, style: { lang: 'stylus' } }],
      'vue/no-setup-props-reactivity-loss': 'error',
    },
  },
  {
    files: ['shared/**/*.{ts,vue}'],
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: ['**/features/**', '@features/*', '**/app/**', '~/pages/**'] },
      ],
    },
  },
  {
    files: ['features/**/*.{ts,vue}'],
    rules: { 'no-restricted-imports': ['error', { patterns: ['**/app/**', '~/pages/**'] }] },
  },
  {
    files: ['server/**/*.ts'],
    languageOptions: {
      globals: {
        defineEventHandler: 'readonly',
        defineNitroPlugin: 'readonly',
        setHeader: 'readonly',
        getHeader: 'readonly',
        getRequestURL: 'readonly',
        getQuery: 'readonly',
        proxyRequest: 'readonly',
        sendRedirect: 'readonly',
        getUserSession: 'readonly',
        setUserSession: 'readonly',
        replaceUserSession: 'readonly',
        clearUserSession: 'readonly',
        oidcConfiguration: 'readonly',
      },
    },
  },
);
