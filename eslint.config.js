const eslint = require('@eslint/js');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsparser = require('@typescript-eslint/parser');
const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const reactNative = require('eslint-plugin-react-native');
const importPlugin = require('eslint-plugin-import');

module.exports = [
  {
    ignores: [
      'node_modules/',
      'ios/',
      'android/',
      'dist/',
      'build/',
      'coverage/',
      '.expo/',
      '*.config.js',
      '.eslintrc.js',
      'babel.config.js',
      'metro.config.js',
    ],
  },
  eslint.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        __dirname: 'readonly',
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        process: 'readonly',
        console: 'readonly',
        Buffer: 'readonly',
      },
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        __DEV__: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        fetch: 'readonly',
        FormData: 'readonly',
        AbortController: 'readonly',
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        process: 'readonly',
        URL: 'readonly',
        btoa: 'readonly',
        atob: 'readonly',
        Blob: 'readonly',
        File: 'readonly',
        FileReader: 'readonly',
        Headers: 'readonly',
        Request: 'readonly',
        Response: 'readonly',
        Promise: 'readonly',
        Map: 'readonly',
        Set: 'readonly',
        WeakMap: 'readonly',
        WeakSet: 'readonly',
        Symbol: 'readonly',
        Proxy: 'readonly',
        Reflect: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      react: react,
      'react-hooks': reactHooks,
      'react-native': reactNative,
      import: importPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...reactNative.rulesConfig,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'react-native/no-raw-text': 'off',
      'react-native/no-inline-styles': 'warn',
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          pathGroups: [
            // React ecosystem - grouped together without position to avoid subgroup newlines
            { pattern: 'react', group: 'external' },
            { pattern: 'react-native', group: 'external' },
            { pattern: 'react-native-*', group: 'external' },
            { pattern: 'expo', group: 'external' },
            { pattern: 'expo-*', group: 'external' },
            // Internal aliases - grouped together
            { pattern: '@app/**', group: 'internal' },
            { pattern: '@modules/**', group: 'internal' },
            { pattern: '@shared/**', group: 'internal' },
            { pattern: '@core/**', group: 'internal' },
            { pattern: '@assets/**', group: 'internal' },
          ],
          pathGroupsExcludedImportTypes: ['react', 'react-native'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
  },
];
