// const { absolute } = require('./utils')
const loaders = require('./loaders')
const plugins = require('./plugins')
const { getExternalModules } = require('./cdn')

// 处理externals，使用cdn
// const externalConfig = getExternalConfig()
// const externals = getExternalModules(externalConfig, mode)

module.exports = (mode, options) => {
  const analysis = options.analysis
  const css = options.css
  const loaderOption = options.css.loaderOption
  const cdn = options.cdn

  const sources = cdn.sources || []
  const externals = cdn ? getExternalModules(sources, cdn.origin) : {}

  return {
    entry: {
      main: './src/main.js',
    },

    mode,

    module: {
      rules: [
        loaders.VueLoader(),
        loaders.JsLoader(),
        ...loaders.StaticsLoader(),
        loaders.CssLoader(css.module),
        loaders.LessLoader(loaderOption.less),
        loaders.SassLoader(loaderOption.scss),
      ],
    },

    plugins: [
      plugins.VueLoaderPlugin(),
      plugins.ModuleConcatenationPlugin(),
      plugins.HtmlWebpackPlugin(sources),
      plugins.MiniCssExtractPlugin(),
      plugins.CleanWebpackPlugin(),
      plugins.OptimizeCssAssetsWebpackPlugin(),
      plugins.HotModuleReplacementPlugin(),
      analysis ? plugins.BundleAnalyzerPlugin() : null,
    ].filter(item => item),

    externals,
  }
}
