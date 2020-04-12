import ora from 'ora';
import Webpack from 'webpack';
import chalk from 'chalk';
import path from 'path';

import getCliConfig from './utils/get_cli_config';

export default (analysis: boolean): void => {
  const loading = ora();
  loading.start('app is building...');

  // set enviroment
  process.env.NODE_ENV = 'production';

  const config = getCliConfig(
    path.resolve(__dirname, '../sources/webpack.prod'),
    { analysis }
  );

  const compiler = Webpack(config);

  compiler.hooks.done.tap('buildTip', () => {
    loading.succeed('build successfully!');
  });
  compiler.hooks.failed.tap('buildTip', err => {
    loading.fail('build failed');
    console.log(err);
  });

  compiler.run((err, stats) => {
    const result = stats.toJson();
    console.log(
      [
        chalk.green(`Time：${result.time}ms`),
        chalk.green(`webpack version: ${result.version}`),
      ].join('\n')
    );
  });
};
