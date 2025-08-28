import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  // Base JavaScript configuration
  js.configs.recommended,

  // JavaScript files configuration (including JSX)
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        React: 'readonly',
        // DOM globals
        HTMLElement: 'readonly',
        HTMLButtonElement: 'readonly',
        HTMLInputElement: 'readonly',
        HTMLDivElement: 'readonly',
        HTMLFormElement: 'readonly',
        Element: 'readonly',
        Event: 'readonly',
        // React hooks and functions
        useRef: 'readonly',
        useCallback: 'readonly',
        useState: 'readonly',
        useEffect: 'readonly',
        useMemo: 'readonly',
        useImperativeHandle: 'readonly',
        useTamylaComponent: 'readonly',
        TamylaUIProvider: 'readonly',
        useTamylaUI: 'readonly',
        // Jest globals
        describe: 'readonly',
        test: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        jest: 'readonly'
      }
    },
    plugins: {
      'react': react,
      'react-hooks': reactHooks
    },
    rules: {
      'no-console': 'warn',
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      'indent': ['error', 2],
      'no-trailing-spaces': 'error',
      'eol-last': 'error',
      'comma-dangle': ['error', 'never'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'space-before-blocks': 'error',
      'keyword-spacing': 'error',
      'space-infix-ops': 'error',
      'brace-style': ['error', '1tbs'],
      'no-var': 'error',
      'prefer-const': 'warn',
      'no-case-declarations': 'error',
      // React specific rules
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn'
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  },

  // TypeScript files configuration
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        React: 'readonly',
        // DOM globals
        HTMLElement: 'readonly',
        HTMLButtonElement: 'readonly',
        HTMLInputElement: 'readonly',
        HTMLDivElement: 'readonly',
        HTMLFormElement: 'readonly',
        Element: 'readonly',
        Event: 'readonly',
        // React hooks and functions
        useRef: 'readonly',
        useCallback: 'readonly',
        useState: 'readonly',
        useEffect: 'readonly',
        useMemo: 'readonly',
        useImperativeHandle: 'readonly',
        useTamylaComponent: 'readonly',
        TamylaUIProvider: 'readonly',
        useTamylaUI: 'readonly',
        // Jest globals
        describe: 'readonly',
        test: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        jest: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': typescript,
      'react': react,
      'react-hooks': reactHooks
    },
    rules: {
      // TypeScript specific rules for v8.x
      '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_', 'varsIgnorePattern': '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unsafe-function-type': 'warn',
      '@typescript-eslint/no-wrapper-object-types': 'warn',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      // Relax for type declaration files
      'no-unused-vars': 'off', // Disabled in favor of @typescript-eslint version
      'no-console': 'warn',
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      'indent': ['error', 2],
      'no-trailing-spaces': 'error',
      'eol-last': 'error',
      'comma-dangle': ['error', 'never'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'space-before-blocks': 'error',
      'keyword-spacing': 'error',
      'space-infix-ops': 'error',
      'brace-style': ['error', '1tbs'],
      'no-var': 'error',
      'prefer-const': 'warn',
      'no-case-declarations': 'error',
      // React specific rules
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn'
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  },

  // TypeScript declaration files - more relaxed rules
  {
    files: ['**/*.d.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-unused-vars': 'off'
    }
  },

  // Ignore patterns
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      '*.min.js',
      'coverage/**',
      '.git/**',
      'examples/**',
      '__mocks__/**',
      // Ignore problematic generated declaration files with encoding issues
      'src/campaign-content-selector.d.ts',
      'src/enhanced-content-manager.d.ts',
      'src/enhanced-search.d.ts'
    ]
  }
];
