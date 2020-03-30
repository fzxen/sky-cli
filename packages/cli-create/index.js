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
} from '../util.js'

function download(options) {
  return new Promise((resolve, reject) => {
    const { name, frame } = options
    const loading = ora()
    loading.start('downloading...')

    const source = gitSources[frame]
    if (!source.url) {
      loading.fail(`${name} is not provided for now`)
      reject(new Error(`${name} is not provided for now`))
    }
    downloadGit(source.url, name, { clone: true }, err => {
      if (err) {
        loading.fail('download failed, please check your network')
        reject(new Error('download failed'))
      } else {
        loading.succeed('download successfully')
        updatePackage(options).then(() => {
          console.log(
            symbol.success,
            chalk.green('package has updated completely')
          )
          resolve()
        })
      }
    })
  })
}

function updatePackage(options) {
  const { name } = options
  return updateJsonFile(`${name}/package.json`, options)
}

module.exports = name => {
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
            .then(() => {
              console.log(
                symbol.success,
                [
                  chalk.green('app has been created successfully'),
                  `\tcd ${name}`,
                  '\t sli init',
                  '\t sli dev',
                ].join('\n')
              )
            })
            .catch(() => {})
        })
        .catch(err => {
          console.log(err)
        })
    })
    .catch(err => {
      console.log(symbol.error, chalk.red(err.message))
    })
}
