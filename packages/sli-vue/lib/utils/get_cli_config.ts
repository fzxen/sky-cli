import { Configuration } from 'webpack';
import WebpackChain from 'webpack-chain';
import WebpackMerge from 'webpack-merge';
import genWebpackConfig from '../utils/gen_webpack';
import sliConfiguration from '../interface/sli_configuration';

const defaultCliConfig: sliConfiguration = {
  cdn: false,
  /**
   * * property: configureWebpack
   * * type: object | function
   * * 这会直接merge到最终webpack配置
   */
  configureWebpack: {}, // 这会直接merge到最终webpack配置

  /**
   * * property: chainWebpack
   * * type: function
   * * 是一个函数，会接收一个基于 webpack-chain 的 ChainableConfig 实例。允许对内部的 webpack 配置进行更细粒度的修改。
   */
  chainWebpack: (config: WebpackChain): void => {}, // eslint-disable-line

  /**
   * * property: devServer
   * * type: object
   * * 会传递给webpack-dev-server
   */
  devServer: {},

  /**
   * * property: css
   * * type: object
   * * 与css相关的配置
   */
  css: {
    module: false,
    loaderOption: {
      scss: {
        prependData: [],
      },
      less: {
        prependData: [],
      },
    },
  },
  /**
   * * property: analysis
   * * type: boolean
   * * 若为tru， 打包时会启用BundleAnalyzerPlugin
   */
  analysis: false,
};

interface Options {
  port?: number;
  analysis?: boolean;
}

export default (
  mode: 'development' | 'production',
  options: Options
): Configuration => {
  function getConfig(): Configuration {
    const cliConfig = require(`${process.cwd()}/sli.config.js`); // eslint-disable-line

    const { configureWebpack, chainWebpack, devServer, ...args } = WebpackMerge(
      defaultCliConfig as Configuration,
      cliConfig
    ) as sliConfiguration;

    const chainConfig = new WebpackChain();
    chainWebpack(chainConfig);

    if (options.port) devServer.port = options.port;
    if (options.analysis) args.analysis = options.analysis;
    return WebpackMerge(
      genWebpackConfig(mode, args),
      configureWebpack,
      chainConfig.toConfig(),
      {
        devServer,
      } as Configuration
    );
  }

  return getConfig();
};
