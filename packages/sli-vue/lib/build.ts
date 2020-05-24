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

  // set environment
  process.env.NODE_ENV = 'production';

  const config = getCliConfig('production', { analysis, cliConfig });

  const compiler = Webpack(config);

  compiler.run((err, stats) => {
    if (err) {
      loading.fail(`build failed:${err}`);
    } else if (stats.hasErrors()) {
      loading.fail(stats.compilation.errors.join('\n'));
    } else {
      loading.succeed('build successfully!');
      const result = stats.toJson();
      console.log(
        [
          chalk.green(`Time: ${result.time}ms`),
          chalk.green(`output: ${result.outputPath}`),
          chalk.green(`webpack version: ${result.version}`),
        ].join('\n')
      );
    }
  });
};
