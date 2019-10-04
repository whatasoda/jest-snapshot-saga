module.exports = {
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    project: './tsconfig.json',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'no-console': 'error',
    'react/jsx-uses-vars': 1,
    'react/jsx-uses-react': 1,
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'off',
    '@typescript-eslint/no-unused-vars': [2, { args: 'none' }],
  },
  globals: {
    process: true,
    module: true,
  },
  env: {
    jest: true,
    es6: true,
    browser: true,
    node: true,
  },
};
