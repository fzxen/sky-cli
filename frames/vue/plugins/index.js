const { absolute } = require('../utils')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const ModuleConcatenationPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin')
const HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

const mode = process.env.NODE_ENV
/**
 ** plugins
 */

exports.VueLoaderPlugin = () => {
  return new VueLoaderPlugin()
}

exports.HtmlWebpackPlugin = (
  externalConfig,
  template = './public/index.html',
  favicon = './public/favicon.ico'
) => {
  let options = {
    template: absolute(template),
    favicon: absolute(favicon),
    cdnConfig: externalConfig, // cdn配置
    inject: !externalConfig,
  }

  const prodOptions = {
    minify: {
      caseSensitive: false, // 是否大小写敏感
      collapseWhitespace: true, // 是否去除空格
      removeAttributeQuotes: true, // 去掉属性引用
      removeComments: true, // 去注释
    },
  }
  if (mode === 'production') options = { ...options, ...prodOptions }
  return new HtmlWebpackPlugin(options)
}

// only production
exports.ModuleConcatenationPlugin = () => {
  let plugin

  if (mode === 'production') plugin = new ModuleConcatenationPlugin()

  return plugin
}

// only development
exports.HotModuleReplacementPlugin = () => {
  let plugin

  if (mode === 'development') plugin = new HotModuleReplacementPlugin()

  return plugin
}

// only production
exports.MiniCssExtractPlugin = () => {
  let plugin

  if (mode === 'production') {
    plugin = new MiniCssExtractPlugin({
      filename: 'assets/style/[name][contenthash:8].css',
    })
  }

  return plugin
}

// only production
exports.CleanWebpackPlugin = () => {
  let plugin

  if (mode === 'production') plugin = new CleanWebpackPlugin()

  return plugin
}

// only production
exports.OptimizeCssAssetsWebpackPlugin = () => {
  let plugin

  if (mode === 'production') {
    plugin = new OptimizeCssAssetsWebpackPlugin({
      assetNameRegExp: /\.css$/,
      cssProcessor: require('cssnano'), // 这里制定了引擎，不指定默认也是 cssnano
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
    })
  }

  return plugin
}

// only production
exports.BundleAnalyzerPlugin = () => {
  let plugin

  if (mode === 'production') {
    plugin = new BundleAnalyzerPlugin({
      analyzerPort: 'auto',
    })
  }

  return plugin
}
