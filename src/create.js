import symbol from 'log-symbols'
import chalk from 'chalk'
import ora from 'ora'
import inquirer from 'inquirer'
import downloadGit from 'download-git-repo'

import {
  isFoldExist,
  isNone,
  getCreateQuestions,
  gitSources,
  updateJsonFile,
} from './util.js'

function download(options) {
  const { name, frame } = options
  const loading = ora()
  loading.start('downloading...')

  const source = gitSources[frame]

  downloadGit(source.url, name, { clone: true }, err => {
    if (err) loading.fail('download failed')
    else {
      loading.succeed('download successfully')
      updatePackage(options).then(() =>
        console.log(
          symbol.success,
          chalk.green('package has updated completely')
        )
      )
    }
  })
}

function updatePackage(options) {
  const { name } = options
  return updateJsonFile(`${name}/package.json`, options)
}

export default async name => {
  // validate projectName
  if (isNone(name)) {
    console.log(symbol.error, chalk.red('please input your projectName'))
    return undefined
  }

  isFoldExist(name)
    .then(() => {
      inquirer
        .prompt(getCreateQuestions({ name }))
        .then(answer => {
          download({ name, ...answer })
        })
        .catch(err => {
          console.log(err)
        })
    })
    .catch(err => {
      console.log(symbol.error, chalk.red(err.message))
    })
}
