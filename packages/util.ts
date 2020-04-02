import fs from 'fs';
import WebpackMerge from 'webpack-merge';
import WebpackChain from 'webpack-chain';
import Webpack from 'webpack';

export const isFoldExist = (name: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(name)) reject(new Error(`${name} has existed`));
    else resolve();
  });
};

export const isNone = (obj: unknown): boolean =>
  obj === undefined || obj === null;

type createFunParams = {
  name: string;
};

export const gitSources = {
  vue: {
    url: 'direct:https://gitee.com/zxffan/templates.git#vue-spa',
  },
  react: {
    url: '',
  },
  electron: {
    url: '',
  },
};

export const updateJsonFile = (path: string, obj: object): Promise<void> => {
  return new Promise(resolve => {
    if (fs.existsSync(path)) {
      const data = fs.readFileSync(path).toString();
      const json = JSON.parse(data);

      const cliData = require('../package.json'); // eslint-disable-line

      Object.assign(json, obj);
      json.devDependencies[cliData.name] = cliData.version;

      fs.writeFileSync(path, JSON.stringify(json, null, '\t'));
      resolve();
    }
  });
};

export const getType = (target: unknown): string => {
  const regResult = Object.prototype.toString.call(target).match(/\s(\w*)]$/);
  if (regResult) return regResult?.[1];
  else return 'none';
};

// export const merge = <T>(...args: Array<T>): T => {
//   function mergeObj(obj1: T, obj2: T): T {}

//   args.reverse().reduce((total, cur) => mergeObj(cur, total));
// };

export const isBaseType = (target: unknown): boolean =>
  ['number', 'string', 'boolean', 'undefined', 'null'].indexOf(
    getType(target)
  ) >= 0;

// * init
export const getInitQuestions = (): Array<object> => {
  return [
    {
      type: 'confirm',
      message: 'Do you need initialize a git repository',
      name: 'git',
      default: false,
    },
  ];
};

// * dev & build
export const getCliConfig = (
  path: string,
  options: object = {}
): Webpack.Configuration => {
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
