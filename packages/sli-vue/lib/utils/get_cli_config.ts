import { Configuration, RuleSetRule } from 'webpack';
import WebpackChain from 'webpack-chain';
// import WebpackMerge from 'webpack-merge';
import genWebpackConfig from '../utils/gen_webpack';
import sliConfiguration from '../interface/sli_configuration';
import deepMerge from './deep_merge';

const defaultCliConfig: sliConfiguration = {
  cdn: false,
  configureWebpack: {}, // 这会直接merge到最终webpack配置
  chainWebpack: (config: WebpackChain): void => {}, // eslint-disable-line
  devServer: {},
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
  analysis: false,
  eslintCompileCheck: false,
};

interface Options {
  port?: number;
  analysis?: boolean;
  cliConfig?: sliConfiguration;
}

export default (
  mode: 'development' | 'production',
  options: Options
): Configuration => {
  function getConfig(): Configuration {
    let { cliConfig } = options;
    try {
      cliConfig = cliConfig || require(`${process.cwd()}/sli.config.js`); // eslint-disable-line
    } catch (e) {
      cliConfig = defaultCliConfig;
    }

    const { configureWebpack, chainWebpack, devServer, ...args } = deepMerge(
      defaultCliConfig,
      cliConfig
    ) as sliConfiguration;

    const chainConfig = new WebpackChain();
    chainWebpack(chainConfig);

    if (options.port) devServer.port = options.port;
    if (options.analysis) args.analysis = options.analysis;
    const config = deepMerge(
      genWebpackConfig(mode, args),
      configureWebpack,
      chainConfig.toConfig(),
      {
        devServer,
      } as Configuration
    );

    // 去除重复loader
    if (config?.module?.rules) {
      config.module.rules = config.module.rules
        .reverse()
        .reduce<RuleSetRule[]>((rules, rule) => {
          const isExist = rules.some(
            item => item?.test?.toString() === rule?.test?.toString()
          );

          if (!isExist) {
            rules.push(rule);
          }
          return rules;
        }, [])
        .reverse();
    }

    return config;
  }

  return getConfig();
};
