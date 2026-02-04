const eslint = require('@eslint/js');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsparser = require('@typescript-eslint/parser');
const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const reactNative = require('eslint-plugin-react-native');
const importPlugin = require('eslint-plugin-import');
const security = require('eslint-plugin-security');
const reactNativeA11y = require('eslint-plugin-react-native-a11y');
const unicorn = require('eslint-plugin-unicorn').default;
const promise = require('eslint-plugin-promise');
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
        RequestInit: 'readonly',
        Alert: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      react: react,
      'react-hooks': reactHooks,
      'react-native': reactNative,
      import: importPlugin,
      security: security,
      'react-native-a11y': reactNativeA11y,
      unicorn: unicorn,
      promise: promise,
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
      // ========================================================================
      // TypeScript Strict Rules (T011-T013)
      // Using strictTypeChecked preset rules with React Native-appropriate adjustments
      // ========================================================================
      ...tseslint.configs['strict-type-checked'].rules,
      ...tseslint.configs['stylistic-type-checked'].rules,
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
        'warn', // Downgrade to warn - common in React Native event handlers
        {
          checksVoidReturn: {
            attributes: false, // Allow async in JSX event handlers
          },
        },
      ],
      '@typescript-eslint/restrict-template-expressions': [
        'warn', // Downgrade to warn
        {
          allowNumber: true,
          allowBoolean: true,
          allowNullish: true,
          allowAny: true,
        },
      ],
      '@typescript-eslint/no-unnecessary-condition': [
        'warn', // Downgrade to warn - too many false positives with optional chaining
        {
          allowConstantLoopConditions: true,
        },
      ],
      '@typescript-eslint/prefer-promise-reject-errors': 'warn', // Downgrade to warn
      '@typescript-eslint/use-unknown-in-catch-callback-variable': 'warn', // Downgrade to warn
      '@typescript-eslint/require-await': 'warn', // Downgrade to warn
      '@typescript-eslint/no-floating-promises': [
        'warn', // Downgrade to warn - common in React Native event handlers
        {
          ignoreVoid: true,
          ignoreIIFE: true,
        },
      ],
      '@typescript-eslint/prefer-nullish-coalescing': [
        'warn', // Downgrade to warn - many intentional uses of || for falsy values
        {
          ignoreTernaryTests: true,
          ignoreConditionalTests: true,
          ignoreMixedLogicalExpressions: true,
        },
      ],
      '@typescript-eslint/no-empty-function': 'warn', // Downgrade to warn
      '@typescript-eslint/no-redundant-type-constituents': 'warn', // Downgrade to warn
      '@typescript-eslint/no-unsafe-assignment': 'warn', // Downgrade to warn - may need gradual fixing
      '@typescript-eslint/no-unsafe-member-access': 'warn', // Downgrade to warn
      '@typescript-eslint/return-await': 'warn', // Downgrade to warn
      '@typescript-eslint/no-unnecessary-type-parameters': 'warn', // Downgrade to warn
      '@typescript-eslint/no-non-null-assertion': 'warn', // Downgrade to warn

      // ========================================================================
      // React Rules
      // ========================================================================
      ...react.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',

      // ========================================================================
      // React Hooks Rules (T014) - exhaustive-deps as error
      // ========================================================================
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',

      // ========================================================================
      // Security Rules (T015-T016)
      // ========================================================================
      'no-eval': 'error',
      'security/detect-eval-with-expression': 'error',
      'security/detect-non-literal-regexp': 'warn',
      'security/detect-object-injection': 'warn',
      'security/detect-non-literal-fs-filename': 'off', // Not applicable for React Native
      'security/detect-child-process': 'off', // Not applicable for React Native

      // ========================================================================
      // React Native Strict Rules (T017-T021)
      // ========================================================================
      'react-native/no-inline-styles': 'error',
      'react-native/no-unused-styles': 'warn', // Downgrade to warn - may have false positives with dynamic styles
      'react-native/no-single-element-style-arrays': 'error',
      'react-native/split-platform-components': 'error',
      'react-native/no-raw-text': 'error',
      'react-native/no-color-literals': 'warn',

      // ========================================================================
      // Accessibility Rules (T022-T026, T039)
      // ========================================================================
      'react-native-a11y/has-accessibility-props': 'error',
      'react-native-a11y/has-valid-accessibility-role': 'error',
      'react-native-a11y/has-valid-accessibility-state': 'error',
      'react-native-a11y/has-valid-accessibility-value': 'error',
      'react-native-a11y/no-nested-touchables': 'error',
      'react-native-a11y/has-accessibility-hint': 'warn', // T039

      // ========================================================================
      // Naming Conventions (T028-T032)
      // ========================================================================
      '@typescript-eslint/naming-convention': [
        'error',
        // Default: camelCase (T028)
        { selector: 'default', format: ['camelCase'] },
        // Variables: camelCase or UPPER_CASE for constants (T029)
        { selector: 'variable', format: ['camelCase', 'UPPER_CASE', 'PascalCase'] },
        // Functions: camelCase or PascalCase for React components (T030)
        { selector: 'function', format: ['camelCase', 'PascalCase'] },
        // Types, interfaces, enums: PascalCase (T031)
        { selector: 'typeLike', format: ['PascalCase'] },
        // Enum members: PascalCase or UPPER_CASE
        { selector: 'enumMember', format: ['PascalCase', 'UPPER_CASE'] },
        // Parameters: camelCase or PascalCase (for HOC component params), allow leading underscore for unused (T032)
        { selector: 'parameter', format: ['camelCase', 'PascalCase'], leadingUnderscore: 'allow' },
        // Properties: allow flexibility for external APIs
        { selector: 'property', format: null },
        // Import names: allow flexibility
        { selector: 'import', format: null },
        // Object literal methods: allow UPPER_CASE for API definitions
        { selector: 'objectLiteralMethod', format: ['camelCase', 'UPPER_CASE', 'PascalCase'] },
        // Class methods: camelCase
        { selector: 'classMethod', format: ['camelCase'] },
      ],

      // ========================================================================
      // Complexity Rules (T033-T037) - Warnings only
      // ========================================================================
      complexity: ['warn', { max: 10 }], // T033
      'max-lines-per-function': 'off', // Disabled - too restrictive for React components
      'max-depth': ['warn', { max: 3 }], // T035
      'max-params': ['warn', { max: 4 }], // T036
      'max-nested-callbacks': ['warn', { max: 3 }], // T037

      // ========================================================================
      // Import Rules
      // ========================================================================
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          pathGroups: [
            { pattern: 'react', group: 'external' },
            { pattern: 'react-native', group: 'external' },
            { pattern: 'react-native-*', group: 'external' },
            { pattern: 'expo', group: 'external' },
            { pattern: 'expo-*', group: 'external' },
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

      // ========================================================================
      // Unicorn Rules - Using recommended subset for React Native
      // ========================================================================
      ...unicorn.configs['recommended'].rules,
      // Disable/downgrade rules not suitable for React Native
      'unicorn/prevent-abbreviations': 'off', // Too strict
      'unicorn/filename-case': 'off', // We use PascalCase for components
      'unicorn/no-null': 'off', // React uses null for conditional rendering
      'unicorn/no-useless-undefined': 'off', // React patterns use undefined
      'unicorn/prefer-module': 'off', // React Native uses CommonJS in some places
      'unicorn/prefer-top-level-await': 'off', // Not supported in React Native
      'unicorn/catch-error-name': 'off', // Allow err, e, error etc
      'unicorn/consistent-function-scoping': 'warn', // Downgrade to warn
      'unicorn/no-array-for-each': 'warn', // Downgrade to warn
      'unicorn/no-useless-promise-resolve-reject': 'warn', // Downgrade to warn
      'unicorn/switch-case-braces': 'off', // Too strict
      'unicorn/no-negated-condition': 'off', // Sometimes clearer
      'unicorn/numeric-separators-style': 'off', // Not always needed
      'unicorn/prefer-spread': 'warn', // Downgrade to warn
      'unicorn/no-array-reduce': 'warn', // reduce is useful
      'unicorn/prefer-string-slice': 'warn', // Downgrade to warn
      'unicorn/prefer-ternary': 'off', // Can reduce readability
      'unicorn/no-nested-ternary': 'off', // Sometimes useful
      'unicorn/explicit-length-check': 'off', // .length is fine
      'unicorn/no-zero-fractions': 'warn', // Downgrade to warn
      'unicorn/prefer-export-from': 'off', // Not always clearer
      'unicorn/prefer-number-properties': 'warn', // Downgrade to warn
      'unicorn/prefer-string-replace-all': 'warn', // Downgrade to warn

      // ========================================================================
      // Promise Rules - Best practices for promises
      // ========================================================================
      ...promise.configs['flat/recommended'].rules,
      'promise/always-return': 'warn', // Downgrade to warn
      'promise/catch-or-return': 'warn', // Downgrade to warn
      'promise/no-return-wrap': 'warn', // Downgrade to warn
    },
  },

  // ============================================================================
  // PRETTIER CONFIG - MUST BE LAST to disable conflicting rules
  // ============================================================================
  prettier,
];
