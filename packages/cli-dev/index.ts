import ora from 'ora';
import Webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { getCliConfig } from '../util';

export default (port: number): void => {
  const loading = ora();
  loading.start('app is starting...');

  // set enviroment
  process.env.NODE_ENV = 'development';

  const config = getCliConfig('../frames/vue/webpack.dev');

  const compiler = Webpack(config);
  compiler.hooks.done.tap('buildTip', () => {
    loading.succeed(
      `compile successfully!
      please open  http://localhost:${port}`
    );
  });
  compiler.hooks.failed.tap('buildTip', err => {
    loading.fail('conmpile failed');
    console.log(err);
  });

  port = port || config.devServer?.port || 8080;
  const host = config.devServer?.host || 'localhost';
  new WebpackDevServer(compiler, config.devServer || {}).listen(port, host);
};
