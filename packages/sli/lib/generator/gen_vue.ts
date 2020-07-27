import symbol from 'log-symbols';
import chalk from 'chalk';
import inquirer from 'inquirer';

import { updatePackage, createCliConfig } from '../utils/update';
import { genVueQuestions } from '../utils/gen_create_questions';

import QueryOptions from '../interface/create_query_options';
import download from '../utils/download';

const updateProject = (options: QueryOptions): Promise<void> => {
  return updatePackage(`${options.name}/package.json`, options)
    .then(() => createCliConfig(`${options.name}/sli.config.js`))
    .then(() => {
      // TODO
      console.log(symbol.success, chalk.green('project has been updated'));
      Promise.resolve();
    });
};

const successTip = (name: string): string =>
  [
    chalk.green('app has been created successfully\n'),
    `\t cd ${name}`,
    '\t npm install or yarn',
    '\t npm start',
  ].join('\n');

const genVue = (name: string): void => {
  const frame = 'vue';
  inquirer
    .prompt(genVueQuestions(name))
    .then(answer => download(Object.assign(answer, { frame }) as QueryOptions))
    .then(answer => updateProject(answer))
    .then(() => {
      console.log(symbol.success, successTip(name));
    })
    .catch(err => {
      err.message && console.log(symbol.error, chalk.red(err.message));
    });
};

export default genVue;
