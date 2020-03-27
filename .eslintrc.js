module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: 'standard',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'comma-dangle': 0, // 允许多余的行末逗号
    'space-before-function-paren': [0, { anonymous: 'always', named: 'never' }], //函数定义时括号前的空格
  },
}
