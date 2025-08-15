import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginTseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import pluginCompat from 'eslint-plugin-compat';
import pluginNoLoops from 'eslint-plugin-no-loops';
import pluginSonarjs from 'eslint-plugin-sonarjs';
import pluginNoUseExtendNative from 'eslint-plugin-no-use-extend-native';
import pluginOptimizeRegex from 'eslint-plugin-optimize-regex';
import pluginPromise from 'eslint-plugin-promise';
import pluginJest from 'eslint-plugin-jest';
import pluginPrettierVue from 'eslint-plugin-prettier-vue';
// import pluginImport from 'eslint-plugin-import';
// import pluginImportConfig from 'eslint-plugin-import/config/flat/recommended.js';

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Plugins setup
  pluginJs.configs['recommended'],
  ...pluginTseslint.configs['recommended'],
  ...pluginVue.configs['flat/strongly-recommended'],
  pluginCompat.configs['flat/recommended'],
  pluginNoUseExtendNative.configs['recommended'],
  pluginPromise.configs['flat/recommended'],
  pluginJest.configs['flat/recommended'],
  // pluginImportConfig, // Not working with .vue files
  {
    plugins: {
      'optimize-regex': pluginOptimizeRegex,
      sonarjs: pluginSonarjs,
      'no-loops': pluginNoLoops,
      'prettier-vue': pluginPrettierVue,
      // 'import': pluginImport,
    },
    settings: {
      'prettier-vue': {
        SFCBlocks: {
          template: true,
          script: true,
          style: false, // lints by stylelint
        },
      },
    },
  },

  {
    name: 'Global ignores',
    ignores: ['dist/', 'certbot/', 'coverage/', 'docs/'],
  },

  // Custom setup
  {
    name: 'All es6 code files',
    files: ['src/**/*.{js,mjs,cjs,ts,mts,jsx,tsx,vue}'],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        parser: pluginTseslint.parser,
        ecmaVersion: 2020,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    name: 'Node.js builders files',
    files: ['vite.config.{js,ts,mjs,mts}', 'jsdoc.config.{js,ts,mjs,mts}'],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    name: 'Jest test files',
    files: ['**/*.(test|spec).?(m)(js|ts)?(x)'],
    languageOptions: {
      globals: globals.jest,
    },
  },
  {
    name: 'Vue files',
    files: ['src/**/*.vue'],
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-mutating-props': 'off',
      // 'vue/v-for-delimiter-style': ['error', 'of'],
      'vue/require-v-for-key': 'off',
      'vue/next-tick-style': ['error', 'promise'],
      'vue/require-prop-types': 'error',
      'vue/prop-name-casing': ['error', 'camelCase'],
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/component-definition-name-casing': ['error', 'PascalCase'],
      'vue/custom-event-name-casing': ['error', 'camelCase'],
      'vue/no-duplicate-attr-inheritance': 'error',
      'vue/this-in-template': ['error', 'never'],
      'vue/v-on-style': ['error', 'shorthand'],
      'vue/no-multi-spaces': 'error',
      'vue/html-indent': 'error',
      'vue/padding-line-between-blocks': 'error',
      'vue/block-order': [
        'error',
        {
          order: ['style', 'template', 'script'],
        },
      ],
      "vue/max-attributes-per-line": ["error", {
        "singleline": {
          "max": Infinity
        },
        "multiline": {
          "max": 1
        }
      }],
      'vue/singleline-html-element-content-newline': 'off',
      'vue/v-on-event-hyphenation': ['error', 'always'],
      'vue/attribute-hyphenation': ['error', 'always'],
      'vue/v-bind-style': 'error',
      'vue/v-slot-style': ['error', 'shorthand'],
      'vue/no-unused-properties': [
        'warn',
        {
          groups: ['props', 'data', 'computed', 'setup'], // 'methods'
          ignorePublicMembers: true,
        },
      ],
      'max-len': [
        'warn',
        140,
        2,
        {
          ignoreComments: true,
          ignoreRegExpLiterals: true,
          ignoreStrings: false,
          ignoreTemplateLiterals: false,
        },
      ],
      'vue/order-in-components': [
        'error',
        {
          order: [
            'name',
            'directives',
            'components',
            'mixins',
            ['provide', 'inject'],
            'model',
            'props',
            'filters',
            'data',
            'computed',
            'LIFECYCLE_HOOKS',
            'ROUTER_GUARDS',
            'methods',
            'watch',
          ],
        },
      ],
    },
  },
];
