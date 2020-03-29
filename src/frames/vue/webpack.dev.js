const merge = require('webpack-merge')
const genBase = require('./webpack.common.js')
const { absolute } = require('./utils')

module.exports = options => {
  return merge(genBase('development', options), {
    output: {
      publicPath: '/',
      filename: 'assets/[name].js',
      path: absolute('./dist'),
    },

    devtool: 'cheap-module-eval-source-map',

    devServer: {
      hot: true, // 开启HMR
      inline: true,
      open: true, // 自动打开浏览器
      stats: 'errors-warnings',
      compress: true, // 开启压缩
      // contentBase: path.resolve(__dirname, './dist'),
      historyApiFallback: true,
      overlay: {
        // 浏览器全屏显示错误
        errors: true,
        warnings: false,
      },
    },
  })
}
