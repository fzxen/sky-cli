const { absolute } = require('./utils')
const loaders = require('./loaders')
const plugins = require('./plugins')
// const { getExternalConfig, getExternalModules } = require('./cdn')

const mode = process.env.NODE_ENV

// 处理externals，使用cdn
// const externalConfig = getExternalConfig()
// const externals = getExternalModules(externalConfig, mode)

module.exports = {
  entry: {
    main: './src/main.js',
  },

  mode,

  module: {
    rules: [
      loaders.VueLoader(),
      loaders.JsLoader(),
      ...loaders.StaticsLoader(),
      loaders.CssLoader(),
      loaders.LessLoader(),
      loaders.SassLoader(),
    ],
  },

  plugins: [
    plugins.VueLoaderPlugin(),
    plugins.ModuleConcatenationPlugin(),
    plugins.HtmlWebpackPlugin(),
    plugins.MiniCssExtractPlugin(),
    plugins.CleanWebpackPlugin(),
    plugins.OptimizeCssAssetsWebpackPlugin(),
    plugins.HotModuleReplacementPlugin(),
    // analysis === 'yes' ? plugins.BundleAnalyzerPlugin() : null,
  ].filter(item => item),

  // externals,
}
