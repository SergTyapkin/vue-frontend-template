import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginTseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import pluginCompat from "eslint-plugin-compat";
import pluginNoLoops from "eslint-plugin-no-loops";
import pluginSonarjs from "eslint-plugin-sonarjs";
import pluginNoUseExtendNative from 'eslint-plugin-no-use-extend-native';
import pluginOptimizeRegex from 'eslint-plugin-optimize-regex';
import pluginPromise from 'eslint-plugin-promise';
// import pluginImport from 'eslint-plugin-import';


/** @type {import('eslint').Linter.Config[]} */
export default [
  // Plugins setup
  pluginJs.configs['recommended'],
  ...pluginTseslint.configs['recommended'],
  ...pluginVue.configs['flat/recommended'],
  pluginCompat.configs['flat/recommended'],
  pluginNoUseExtendNative.configs['recommended'],
  // pluginImport.configs['recommended'], // Not working with .vue files
  pluginPromise.configs['flat/recommended'],
  {
    plugins: {
      'optimize-regex': pluginOptimizeRegex,
      'sonarjs': pluginSonarjs,
      'no-loops': pluginNoLoops,
    }
  },

  {
    name: 'Global ignores',
    ignores: ['dist/*'],
  },

  // Custom setup
  {
    name: 'All es6 code files',
    files: ['src/**/*.{js,mjs,cjs,ts,vue}'],
    languageOptions: { globals: globals.browser },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    name: 'Node.js files',
    files: ['vite.config.{js,ts}'],
    languageOptions: { globals: globals.node },
  },
  {
    name: 'Vue files',
    files: ['src/**/*.vue'],
    languageOptions: {parserOptions: {parser: pluginTseslint.parser}},
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-mutating-props': 'off',
    }
  },
];
