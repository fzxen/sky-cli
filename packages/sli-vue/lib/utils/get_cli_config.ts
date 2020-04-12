import Webpack from 'webpack';
import WebpackChain from 'webpack-chain';
import WebpackMerge from 'webpack-merge';

const defaultCliConfig = {
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

export default (path: string, options: object = {}): Webpack.Configuration => {
  function getConfig(): Webpack.Configuration {
    const genConfig = require(path); // eslint-disable-line
    const cliConfig = require(`${process.cwd()}/cli.config.js`); // eslint-disable-line
    const { configureWebpack, chainWebpack, devServer, ...args } = WebpackMerge(
      defaultCliConfig as Webpack.Configuration,
      cliConfig
    ) as typeof defaultCliConfig;

    const chainConfig = new WebpackChain();
    chainWebpack(chainConfig);

    return WebpackMerge(
      genConfig(Object.assign(args, options)),
      configureWebpack,
      chainConfig.toConfig(),
      {
        devServer,
      } as Webpack.Configuration
    );
  }

  return getConfig();
};
