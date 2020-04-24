module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
  },
  extends: ['standard', 'plugin:vue/essential', 'plugin:prettier/recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    _: 'readonly',
  },
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['vue'],
  // 自定义规范
  rules: {
    'prettier/prettier': 'error',
    /*
     * 允许开启
     */
    'comma-dangle': 0, // 允许多余的行末逗号
    'space-before-function-paren': [0, { anonymous: 'always', named: 'never' }], //函数定义时括号前的空格
    'no-tabs': 0,
    'no-useless-return': 0,
  },
}
