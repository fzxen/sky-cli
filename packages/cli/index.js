import { Command } from 'commander'

const program = new Command()

program
  .command('create <name>')
  .description('create a new project')
  .alias('c')
  .action(name => {
    require('../cli-create')(name)
  })
program
  .command('init')
  .description('initialize project')
  .alias('i')
  .action(() => {
    require('../cli-init')()
  })
program
  .command('dev')
  .description('run your app in development')
  .alias('d')
  .option('-p, --port <port>', 'Port used by the server (default: 8080)')
  .action(cmdObj => {
    require('../cli-dev')(cmdObj.port || '8080')
  })
program
  .command('build')
  .description('build your app (production)')
  .alias('b')
  .option('-a, --analysis', 'show buldle information')
  .action(cmdObj => {
    require('../cli-build')({ analysis: cmdObj.analysis })
  })

program
  .version(require('../../package.json').version, '-v --version')
  .parse(process.argv)

// show help info when no params
if (!process.argv.slice(2).length) program.outputHelp()
