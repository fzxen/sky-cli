import { Configuration, Plugin } from 'webpack';
import merge from 'webpack-merge'; // TODO fan 自定义merge算法
import HtmlCdns from '../../interface/html_cdns';

import genCdn from './gen_cdn';
import absolute from './absolute';

// * rules
import {
  genCssLoader,
  genStaticsLoader,
  genSassLoader,
  genVueLoader,
  genJsLoader,
  genLessLoader,
} from './loaders';

// * plugins
import {
  genBundleAnalyzerPlugin,
  genHtmlWebpackPlugin,
  genCleanWebpackPlugin,
  genHotModuleReplacementPlugin,
  genMiniCssExtractPlugin,
  genOptimizeCssAssetsWebpackPlugin,
  genVueLoaderPlugin,
} from './plugins';
import genTerserPlugin from './plugins/gen_terser_plugin';

import SliConfiguration from '../../interface/sli_configuration';

function genCommon(
  mode: 'development' | 'production',
  options: SliConfiguration
): Configuration {
  // option - analysis cdn css
  const analysis = options.analysis;
  const css = options.css;
  const loaderOption = css.loaderOption;
  const cdn = options.cdn;

  // * 处理cdn
  let externals = {};
  let htmlCdns: HtmlCdns = [];
  if (cdn) {
    const cdnOption = genCdn(cdn.sources, cdn.origin, mode);
    externals = cdnOption.externals;
    htmlCdns = cdnOption.htmlCdns;
  }

  return {
    entry: {
      main: './src/main.js',
    },

    module: {
      rules: [
        genCssLoader(mode, css.module),
        ...genStaticsLoader(mode),
        genSassLoader(mode, loaderOption['scss']?.prependData),
        genVueLoader(mode),
        genJsLoader(mode),
        genLessLoader(mode, loaderOption['less']?.prependData),
      ],
    },

    plugins: [
      analysis ? genBundleAnalyzerPlugin() : null,
      genHtmlWebpackPlugin(mode, htmlCdns),
      genCleanWebpackPlugin(mode),
      genHotModuleReplacementPlugin(mode),
      genMiniCssExtractPlugin(mode),
      genOptimizeCssAssetsWebpackPlugin(mode),
      genVueLoaderPlugin(),
    ].filter(item => item) as Plugin[],

    externals,
  };
}

function genDev(
  mode: 'development' | 'production',
  options: SliConfiguration
): Configuration {
  const common = genCommon(mode, options);
  return merge(common, {
    output: {
      publicPath: '/',
      filename: 'assets/[name].js',
      path: absolute('./dist'),
    },

    mode,

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
  });
}

function genProd(
  mode: 'development' | 'production',
  options: SliConfiguration
): Configuration {
  const common = genCommon(mode, options);
  return merge(common, {
    output: {
      publicPath: '/',
      filename: 'assets/[name][chunkhash:8].js',
      path: absolute('./dist'),
    },

    mode,

    optimization: {
      minimize: true,
      minimizer: [genTerserPlugin()],
      splitChunks: {
        chunks: 'all', // 三选一： "initial" | "all" | "async" (默认)
        minSize: 30000, // 最小尺寸，30K，development 下是10k，越大那么单个文件越大，chunk 数就会变少（针对于提取公共 chunk 的时候，不管再大也不会把动态加载的模块合并到初始化模块中）当这个值很大的时候就不会做公共部分的抽取了
        maxSize: 0, // 文件的最大尺寸，0为不限制，优先级：maxInitialRequest/maxAsyncRequests < maxSize < minSize
        minChunks: 1, // 默认1，被提取的一个模块至少需要在几个 chunk 中被引用，这个值越大，抽取出来的文件就越小
        maxAsyncRequests: 5, // 在做一次按需加载的时候最多有多少个异步请求，为 1 的时候就不会抽取公共 chunk 了
        maxInitialRequests: 3, // 针对一个 entry 做初始化模块分隔的时候的最大文件数，优先级高于 cacheGroup，所以为 1 的时候就不会抽取 initial common 了
        automaticNameDelimiter: '~', // 打包文件名分隔符
        name: true, // 拆分出来文件的名字，默认为 true，表示自动生成文件名，如果设置为固定的字符串那么所有的 chunk 都会被合并成一个
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/, // 正则规则，如果符合就提取 chunk
            priority: -10, // 缓存组优先级，当一个模块可能属于多个 chunkGroup，这里是优先级
          },
          default: {
            minChunks: 2,
            priority: -20, // 优先级
            reuseExistingChunk: true, // 如果该chunk包含的modules都已经另一个被分割的chunk中存在，那么直接引用已存在的chunk，不会再重新产生一个
          },
        },
      },
    },
  });
}

export default (
  mode: 'development' | 'production',
  option: SliConfiguration
): Configuration => {
  return mode === 'development' ? genDev(mode, option) : genProd(mode, option);
};
