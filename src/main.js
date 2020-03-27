import { Command } from 'commander'

import create from './create.js'
import init from './init.js'
import dev from './dev.js'
import build from './build.js'

const program = new Command()

const options = [
  {
    flags: '-p, --port <port>',
    description: 'port',
    defaultValue: 3000,
  },
]
const commands = {
  create: {
    description: 'create a new project',
    usages: ['sky-cli create <ProjectName>'],
    alias: 'c',
  },
  init: {
    description: 'initial project',
    usages: ['sky-cli init'],
    alias: 'i',
  },
  dev: {
    description: 'run your project in development',
    usages: ['sky-cli dev'],
    alias: 'd',
  },
  build: {
    description: 'build your project (production)',
    usages: ['sky-cli build'],
    alias: 'b',
  },
}

// set options
for (const { flags, description, defaultValue } of options) {
  program.option(flags, description, defaultValue)
}

// registry command
for (const [name, command] of Object.entries(commands)) {
  program
    .command(name)
    .description(command.description)
    .alias(command.alias)
    .action(() => {
      switch (name) {
        case 'create':
          create()
          break
        case 'init':
          init()
          break
        case 'dev':
          dev()
          break
        case 'build':
          build()
          break
        default:
          break
      }
    })
}

program
  .version(require('../package.json').version, '-v --version')
  .parse(process.argv)

// show help info when no params
if (!process.argv.slice(2).length) program.outputHelp()
