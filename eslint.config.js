import expo from 'eslint-config-expo/flat.js';
import prettier from 'eslint-config-prettier';
import reactNativeA11y from 'eslint-plugin-react-native-a11y';
import globals from 'globals';

export default [
  {
    ignores: [
      'node_modules/',
      '.expo/',
      'dist/',
      'web-build/',
      'coverage/',
      'functions/',
      'docs/wireframes/',
      'jest.setup.js',
      'lib/firebase-native.ts',
    ],
  },
  ...expo,
  prettier,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: {
      'react-native-a11y': reactNativeA11y,
    },
    rules: {
      ...reactNativeA11y.configs.all.rules,
      'react-native-a11y/has-accessibility-hint': 'off',
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
  {
    files: ['functions/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
];
