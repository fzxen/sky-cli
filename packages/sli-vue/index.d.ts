import Webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import WebpackChain from 'webpack-chain';

declare namespace SliVue {
  interface CdnSources {
    name: string;
    scope: string;
    alias?: string;
    css: { development: string; production: string };
    js: { development: string; production: string };
  }

  type CdnConfiguration = Array<CdnSources>;

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

  interface SliConfig {
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

  function dev(options: { port: number; cliConfig?: SliConfig }): void;
  function build(options: { analysis: boolean; cliConfig?: SliConfig }): void;
}

export = SliVue;
