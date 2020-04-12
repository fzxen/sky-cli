module.exports = {
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  printWidth: 80,

  // 行尾逗号,默认none,可选 none|es5|all
  // es5 包括es5中的数组、对象
  // all 包括函数对象等所有可选
  trailingComma: 'es5',

  eslintIntegration: true,
  tslintIntegration: true,
  stylelintIntegration: true,
  useTabs: false,

  // 箭头函数参数括号 默认avoid 可选 avoid| always
  // avoid 能省略括号的时候就省略 例如x => x
  // always 总是有括号
  arrowParens: 'avoid',

  // 对象中的空格 默认true
  // true: { foo: bar }
  // false: {foo: bar}
  bracketSpacing: true,
}
