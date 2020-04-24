import Webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import WebpackChain from 'webpack-chain';
import CdnConfiguration from './cdn_configuration';

interface CssConfiguration {
  module: boolean;
  loaderOption: {
    scss?: {
      prependData: Array<string>;
    };
    less?: {
      prependData: Array<string>;
    };
    stylus?: {
      prependData: Array<string>;
    };
  };
}

export default interface SliConfig {
  cdn:
    | {
        origin: string;
        sources: CdnConfiguration;
      }
    | false;

  configureWebpack: Webpack.Configuration;

  chainWebpack: (config: WebpackChain) => void;

  devServer: WebpackDevServer.Configuration;

  css: CssConfiguration;

  analysis?: boolean;

  eslintCompileCheck?: boolean;
}
