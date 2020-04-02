module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: ['plugin:@typescript-eslint/recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',

    'comma-dangle': 0, // 允许多余的行末逗号
    'space-before-function-paren': [0, { anonymous: 'always', named: 'never' }], //函数定义时括号前的空格
  },
};
