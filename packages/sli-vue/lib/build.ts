import ora from 'ora';
import Webpack from 'webpack';
import chalk from 'chalk';

import getCliConfig from './utils/get_cli_config';
import sliConfiguration from './interface/sli_configuration';

export default (option: {
  analysis: boolean;
  cliConfig?: sliConfiguration;
}): void => {
  const { analysis, cliConfig } = option;
  const loading = ora();
  loading.start('app is building...');

  // set enviroment
  process.env.NODE_ENV = 'production';

  const config = getCliConfig('production', { analysis, cliConfig });

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
        chalk.green(`Time: ${result.time}ms`),
        chalk.green(`webpack version: ${result.version}`),
      ].join('\n')
    );
  });
};
