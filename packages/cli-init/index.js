import { exec } from 'child_process'
import inquirer from 'inquirer'
import chalk from 'chalk'
import symbol from 'log-symbols'
import ora from 'ora'

import { getInitQuestions, isNone } from '../util'

function initRepository() {
  const loading = ora()
  loading.start('git repository initializing...')
  exec('git init', err => {
    if (isNone(err)) {
      loading.succeed('git repository initialize successfully')
    } else {
      loading.fail('git repository initialization failed')
    }
  })
}

function intall() {
  const loading = ora()
  loading.start('npm installing...')
  exec('npm install', (err, stdout, stderr) => {
    console.log(symbol.success, chalk.green(stdout))
    console.log(symbol.error, chalk.red(stderr))
    if (isNone(err)) {
      loading.succeed('npm install successfully')
    } else {
      loading.error('npm install failed')
    }
  })
}

module.exports = () => {
  inquirer.prompt(getInitQuestions()).then(answers => {
    const { git } = answers
    git && initRepository()

    intall()
  })
  // TODO 判断 npm or yarn
  // exec('npm install', (err, stdout, stderr) => {})
}
