import { Command } from 'commander';
import create from '../cli-create';
import init from '../cli-init';
import dev from '../cli-dev';
import build from '../cli-build';
// import Module from 'module';

// const getModule = Module.createRequire(import.meta.url);

const program = new Command();

program
  .command('create <name>')
  .description('create a new project')
  .alias('c')
  .action((name: string): void => {
    create(name);
  });
program
  .command('init')
  .description('initialize project')
  .alias('i')
  .action(() => {
    init();
  });
program
  .command('dev')
  .description('run your app in development')
  .alias('d')
  .option('-p, --port <port>', 'Port used by the server (default: 8080)')
  .action(cmdObj => {
    dev(cmdObj.port || 8080);
  });
program
  .command('build')
  .description('build your app (production)')
  .alias('b')
  .option('-a, --analysis', 'show buldle information')
  .action(cmdObj => {
    build(cmdObj.analysis);
  });

program
  .version(require('../../package.json').version, '-v --version')
  .parse(process.argv);

// show help info when no params
if (!process.argv.slice(2).length) program.outputHelp();
