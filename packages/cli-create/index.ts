import symbol from 'log-symbols';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import downloadGit from 'download-git-repo';

import isFoldExist from './lib/is_fold_exist';
import gitSources from './lib/git_sources';
import { updatePackage } from './lib/update';
import genQuestions from './lib/gen_questions';

interface QueryOptions {
  name: string; // 项目名称
  frame: 'vue' | 'react' | 'electron'; // 框架
  description: string; // 项目描述
  author: string;
}

const download = (options: QueryOptions): Promise<QueryOptions> => {
  return new Promise((resolve, reject) => {
    const { name, frame } = options;

    const loading = ora();
    loading.start('downloading...');

    const source = gitSources[frame];
    if (!source.url) {
      loading.fail(`${frame} is not provided for now`);
      reject(new Error(`${frame} is not provided for now`));
    }

    downloadGit(source.url, name, { clone: true }, err => {
      if (err) {
        loading.fail('download failed, please check your network');
        reject(err);
      } else {
        loading.succeed('download successfully');
        resolve(options);
      }
    });
  });
};

const updateProject = (options: QueryOptions): Promise<void> => {
  return updatePackage(`${options.name}/package.json`, options)
    .then(() => {
      console.log(
        symbol.success,
        chalk.green('package has been updated completely')
      );
      Promise.resolve();
    })
    .then(() => {
      // TODO
      Promise.resolve();
    });
};

const successTip = (name: string): string =>
  [
    chalk.green('app has been created successfully\n'),
    `\t cd ${name}`,
    '\t sli init',
    '\t sli dev',
  ].join('\n');

export default (name: string): void => {
  isFoldExist(name)
    .then(() => inquirer.prompt(genQuestions(name)))
    .then(answer => download(answer as QueryOptions))
    .then(answer => updateProject(answer))
    .then(() => {
      console.log(symbol.success, successTip(name));
    })
    .catch(err => {
      console.log(symbol.error, chalk.red(err.message));
    });
};
