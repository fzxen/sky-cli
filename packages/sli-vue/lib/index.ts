import { Command } from 'commander';
import dev from './dev';
import build from './build';

function install(): void {
  const program = new Command();

  program
    .command('dev')
    .description('run your app in development')
    .alias('d')
    .option('-p, --port <port>', 'Port used by the server (default: 8080)')
    .action(cmdObj => {
      dev({
        port: cmdObj.port,
      });
    });
  program
    .command('build')
    .description('build your app (production)')
    .alias('b')
    .option('-a, --analysis', 'show bundle information')
    .action(cmdObj => {
      build({
        analysis: cmdObj.analysis,
      });
    });

  program
    .version(require('./package.json').version, '-v --version')
    .parse(process.argv);

  // show help info when no params
  if (!process.argv.slice(2).length) program.outputHelp();
}

export default {
  install,
  build,
  dev,
};
