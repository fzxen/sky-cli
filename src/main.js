import { Command } from 'commander'

import create from './create.js'
import init from './init.js'
import dev from './dev.js'
import build from './build.js'

const program = new Command()

program
  .command('create <name>')
  .description('create a new project')
  .alias('c')
  .action(name => {
    create(name)
  })
program
  .command('init')
  .description('initialize project')
  .alias('i')
  .action(() => {
    init()
  })
program
  .command('dev')
  .description('run your app in development')
  .alias('d')
  .option('-p, --port <port>', 'Port used by the server (default: 8080)')
  .action(cmdObj => {
    dev(cmdObj.port || '8080')
  })
program
  .command('build')
  .description('build your app (production)')
  .alias('b')
  .option('-a, --analysis', 'show buldle information')
  .action(cmdObj => {
    build({ analysis: cmdObj.analysis })
  })

program
  .version(require('../package.json').version, '-v --version')
  .parse(process.argv)

// show help info when no params
if (!process.argv.slice(2).length) program.outputHelp()
