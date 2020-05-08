import ora from 'ora';
import Webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import getCliConfig from './utils/get_cli_config';
import sliConfiguration from './interface/sli_configuration';

export default (option: {
  port: number | undefined;
  cliConfig?: sliConfiguration;
}): void => {
  let port = option.port;
  const { cliConfig } = option;
  const loading = ora();
  loading.start('app is starting...');

  // set enviroment
  process.env.NODE_ENV = 'development';

  const config = getCliConfig('development', { port, cliConfig });

  const compiler = Webpack(config);

  port = config.devServer?.port || 8080;
  const host = config.devServer?.host || 'localhost';
  compiler.hooks.done.tap('buildTip', () => {
    loading.succeed(
      `compile successfully!
      please open  http://${host}:${port}`
    );
  });
  compiler.hooks.failed.tap('buildTip', err => {
    loading.fail('compile failed');
    console.log(err);
  });

  new WebpackDevServer(compiler, config.devServer || {}).listen(port, host);
};
