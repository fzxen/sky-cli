import symbol from 'log-symbols';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import downloadGit from 'download-git-repo';

import { isFoldExist, isNone, gitSources, updateJsonFile } from '../util';

interface QueryOptions {
  name: string; // 项目名称
  frame: 'vue' | 'react' | 'electron'; // 框架
  description: string; // 项目描述
  author: string;
}
const getCreateQuestions = (name: string): Array<object> => {
  return [
    {
      type: 'list',
      name: 'frame',
      message: 'please choose this project template',
      choices: ['vue', 'react'],
    },
    {
      type: 'input',
      name: 'name',
      message: 'Please enter the project name: ',
      default: name,
      validate(value: string): boolean | string {
        if (!value) return 'you must provide the name';

        return true;
      },
    },
    {
      type: 'input',
      name: 'description',
      message: 'Please enter the project description: ',
      validate(value: string): boolean | string {
        if (!value) return 'you must provide the description';

        return true;
      },
    },
    {
      type: 'input',
      name: 'author',
      message: 'Please enter the author name: ',
      default: 'fanzhongxu',
      validate(value: string): boolean | string {
        if (!value) return 'you must provide the author';

        return true;
      },
    },
  ];
};

function updatePackage(options: QueryOptions): Promise<void> {
  const { name } = options;
  return updateJsonFile(`${name}/package.json`, options);
}

function download(options: QueryOptions): Promise<void> {
  return new Promise((resolve, reject) => {
    const { name, frame } = options;
    const loading = ora();
    loading.start('downloading...');

    const source = gitSources[frame];
    if (!source.url) {
      loading.fail(`${name} is not provided for now`);
      reject(new Error(`${name} is not provided for now`));
    }
    console.log(source.url, name);

    downloadGit(source.url, name, { clone: true }, err => {
      if (err) {
        loading.fail('download failed, please check your network');
        reject(err);
      } else {
        loading.succeed('download successfully');
        updatePackage(options).then(() => {
          console.log(
            symbol.success,
            chalk.green('package has updated completely')
          );
          resolve();
        });
      }
    });
  });
}

export default (name: string): void => {
  // validate projectName
  if (isNone(name)) {
    console.log(symbol.error, chalk.red('please input your projectName'));
    return undefined;
  }

  isFoldExist(name)
    .then(() => {
      inquirer
        .prompt(getCreateQuestions(name))
        .then(answer => {
          download(answer as QueryOptions)
            .then(() => {
              console.log(
                symbol.success,
                [
                  chalk.green('app has been created successfully\n'),
                  `\tcd ${name}`,
                  '\t sli init',
                  '\t sli dev',
                ].join('\n')
              );
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch((err: Error) => {
          console.log(12123123, err);
        });
    })
    .catch(err => {
      console.log(symbol.error, chalk.red(err.message));
    });
};
