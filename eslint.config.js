const eslint = require('@eslint/js');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsparser = require('@typescript-eslint/parser');
const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const reactNative = require('eslint-plugin-react-native');
const security = require('eslint-plugin-security');
const reactNativeA11y = require('eslint-plugin-react-native-a11y');
const checkFile = require('eslint-plugin-check-file');
const prettier = require('eslint-config-prettier');

module.exports = [
  // ============================================================================
  // IGNORES BLOCK - Files and directories to skip
  // ============================================================================
  {
    ignores: [
      // Build artifacts
      'node_modules/',
      'ios/',
      'android/',
      'dist/',
      'build/',
      'coverage/',
      '.expo/',
      // Configuration files (JS only)
      '*.config.js',
      '.eslintrc.js',
      'babel.config.js',
      'metro.config.js',
      // Generated files
      '*.generated.ts',
      '*.d.ts',
      // Backup files
      '*.backup.js',
      // Build scripts (excluded from tsconfig.json)
      'scripts/build/**',
    ],
  },

  // ============================================================================
  // BASE CONFIG - ESLint recommended rules
  // ============================================================================
  eslint.configs.recommended,

  // ============================================================================
  // JAVASCRIPT CONFIG - For JS files (scripts, config)
  // ============================================================================
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

  // ============================================================================
  // TYPESCRIPT CONFIG - Type-aware strict rules
  // ============================================================================
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
        // Enable type-aware linting
        projectService: true,
        tsconfigRootDir: __dirname,
      },
      globals: {
        // React Native specific
        __DEV__: 'readonly',
        Alert: 'readonly',
        // Common globals
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        fetch: 'readonly',
        FormData: 'readonly',
        AbortController: 'readonly',
        // Module system
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        process: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      react: react,
      'react-hooks': reactHooks,
      'react-native': reactNative,
      security: security,
      'react-native-a11y': reactNativeA11y,
      'check-file': checkFile,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // ========================================================================
      // TypeScript Strict Rules
      // Using strictTypeChecked preset with React Native-appropriate adjustments
      // ========================================================================
      ...tseslint.configs['strict-type-checked'].rules,
      ...tseslint.configs['stylistic-type-checked'].rules,

      // Disable base ESLint rule in favor of TypeScript version
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
          allowHigherOrderFunctions: true,
          allowDirectConstAssertionInArrowFunctions: true,
          allowConciseArrowFunctionExpressionsStartingWithVoid: true,
          allowFunctionsWithoutTypeParameters: true,
          allowIIFEs: true,
        },
      ],

      // Adjusted for React Native patterns
      '@typescript-eslint/no-misused-promises': [
        'warn',
        {
          checksVoidReturn: {
            attributes: false, // Allow async in JSX event handlers
          },
        },
      ],
      '@typescript-eslint/restrict-template-expressions': [
        'warn',
        {
          allowNumber: true,
          allowBoolean: true,
          allowNullish: true,
          allowAny: true,
        },
      ],
      '@typescript-eslint/no-unnecessary-condition': [
        'warn',
        {
          allowConstantLoopConditions: true,
        },
      ],
      '@typescript-eslint/prefer-promise-reject-errors': 'warn',
      '@typescript-eslint/use-unknown-in-catch-callback-variable': 'warn',
      '@typescript-eslint/require-await': 'warn',
      '@typescript-eslint/no-floating-promises': [
        'warn',
        {
          ignoreVoid: true,
          ignoreIIFE: true,
        },
      ],
      '@typescript-eslint/prefer-nullish-coalescing': [
        'warn',
        {
          ignoreTernaryTests: true,
          ignoreConditionalTests: true,
          ignoreMixedLogicalExpressions: true,
        },
      ],
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/no-redundant-type-constituents': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/return-await': 'warn',
      '@typescript-eslint/no-unnecessary-type-parameters': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',

      // ========================================================================
      // React Rules
      // ========================================================================
      ...react.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      // CRITICAL: Vercel Skills 1.1 - Never use && with potentially falsy values
      // Prevents production crashes when rendering 0 or "" outside <Text>
      'react/jsx-no-leaked-render': [
        'error',
        {
          validStrategies: ['ternary', 'coerce'],
        },
      ],

      // ========================================================================
      // React Hooks Rules - exhaustive-deps as error
      // ========================================================================
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',

      // ========================================================================
      // Security Rules - Only essential ones
      // ========================================================================
      'no-eval': 'error',
      'security/detect-eval-with-expression': 'error',

      // ========================================================================
      // React Native Rules
      // ========================================================================
      'react-native/no-inline-styles': 'error',
      'react-native/no-unused-styles': 'warn',
      'react-native/no-single-element-style-arrays': 'error',
      'react-native/split-platform-components': 'error',
      'react-native/no-raw-text': 'error',

      // ========================================================================
      // Accessibility Rules
      // ========================================================================
      'react-native-a11y/has-accessibility-props': 'error',
      'react-native-a11y/has-valid-accessibility-role': 'error',
      'react-native-a11y/has-valid-accessibility-state': 'error',
      'react-native-a11y/has-valid-accessibility-value': 'error',
      'react-native-a11y/no-nested-touchables': 'error',
      'react-native-a11y/has-accessibility-hint': 'warn',

      // ========================================================================
      // Naming Conventions
      // ========================================================================
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'default', format: ['camelCase'] },
        { selector: 'variable', format: ['camelCase', 'UPPER_CASE', 'PascalCase'] },
        { selector: 'function', format: ['camelCase', 'PascalCase'] },
        { selector: 'typeLike', format: ['PascalCase'] },
        { selector: 'enumMember', format: ['PascalCase', 'UPPER_CASE'] },
        { selector: 'parameter', format: ['camelCase', 'PascalCase'], leadingUnderscore: 'allow' },
        { selector: 'property', format: null },
        { selector: 'import', format: null },
        { selector: 'objectLiteralMethod', format: ['camelCase', 'UPPER_CASE', 'PascalCase'] },
        { selector: 'classMethod', format: ['camelCase'] },
      ],

      // ========================================================================
      // File/Folder Naming - kebab-case enforcement
      // ========================================================================
      'check-file/filename-naming-convention': [
        'error',
        {
          '**/*.{ts,tsx}': 'KEBAB_CASE',
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],
      'check-file/folder-naming-convention': [
        'error',
        {
          'app/**': 'KEBAB_CASE',
          'core/**': 'KEBAB_CASE',
          'modules/**': 'KEBAB_CASE',
          'shared/**': 'KEBAB_CASE',
        },
      ],

      // ========================================================================
      // Complexity Rules - Warnings only
      // ========================================================================
      complexity: ['warn', { max: 10 }],
      'max-depth': ['warn', { max: 3 }],
      'max-params': ['warn', { max: 4 }],
      'max-nested-callbacks': ['warn', { max: 3 }],
    },
  },

  // ============================================================================
  // PRETTIER CONFIG - MUST BE LAST to disable conflicting rules
  // ============================================================================
  prettier,
];
