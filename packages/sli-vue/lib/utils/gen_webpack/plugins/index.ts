import { HotModuleReplacementPlugin } from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import OptimizeCssAssetsWebpackPlugin from 'optimize-css-assets-webpack-plugin';
import { VueLoaderPlugin } from 'vue-loader';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import absolute from '../absolute';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import HtmlCdns from '../../../interface/html_cdns';

import cssnano from 'cssnano';

type modeType = 'development' | 'production';

/**
 ** plugins
 */

export const genVueLoaderPlugin = (): VueLoaderPlugin => {
  return new VueLoaderPlugin();
};

// only production
// const genModuleConcatenationPlugin = ():
//   | optimize.ModuleConcatenationPlugin
//   | undefined => {
//   let plugin;

//   if (mode === 'production') plugin = new optimize.ModuleConcatenationPlugin();

//   return plugin;
// };

// only development
export const genHotModuleReplacementPlugin = (
  mode: modeType
): HotModuleReplacementPlugin | undefined => {
  let plugin;

  if (mode === 'development') plugin = new HotModuleReplacementPlugin();

  return plugin;
};

// only production
export const genMiniCssExtractPlugin = (
  mode: modeType
): MiniCssExtractPlugin | undefined => {
  let plugin;

  if (mode === 'production') {
    plugin = new MiniCssExtractPlugin({
      filename: 'assets/style/[name][contenthash:8].css',
    });
  }

  return plugin;
};

// only production
export const genCleanWebpackPlugin = (
  mode: modeType
): CleanWebpackPlugin | undefined => {
  let plugin;

  if (mode === 'production') plugin = new CleanWebpackPlugin();

  return plugin;
};

// only production
export const genOptimizeCssAssetsWebpackPlugin = (
  mode: modeType
): OptimizeCssAssetsWebpackPlugin | undefined => {
  let plugin;

  if (mode === 'production') {
    plugin = new OptimizeCssAssetsWebpackPlugin({
      assetNameRegExp: /\.css$/,
      cssProcessor: cssnano, // 这里制定了引擎，不指定默认也是 cssnano
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
    });
  }

  return plugin;
};

// only production
export const genBundleAnalyzerPlugin = (): BundleAnalyzerPlugin => {
  return new BundleAnalyzerPlugin({
    analyzerPort: 'auto',
  });
};

export const genHtmlWebpackPlugin = (
  mode: 'development' | 'production',
  externalConfig: HtmlCdns,
  template = './public/index.html',
  favicon = './public/favicon.ico'
): HtmlWebpackPlugin => {
  let options = {
    template: absolute(template),
    favicon: absolute(favicon),
    cdnConfig: externalConfig, // cdn配置
    inject: !externalConfig || externalConfig.length <= 0,
  };

  const prodOptions = {
    minify: {
      caseSensitive: false, // 是否大小写敏感
      collapseWhitespace: true, // 是否去除空格
      removeAttributeQuotes: true, // 去掉属性引用
      removeComments: true, // 去注释
    },
  };
  if (mode === 'production') options = { ...options, ...prodOptions };
  return new HtmlWebpackPlugin(options);
};
