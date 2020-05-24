import download from './utils/download';
import QueryOptions from './interface/create_query_options';
import { genElectronQuestions } from './utils/gen_create_questions';
import { updatePackage } from './utils/update';
import inquirer from 'inquirer';
import symbol from 'log-symbols';
import chalk from 'chalk';

const genElectron = (name: string): void => {
  const frame = 'electron';
  inquirer
    .prompt(genElectronQuestions(name))
    .then(answer => download(Object.assign(answer, { frame }) as QueryOptions))
    .then(options => updatePackage(`${name}/package.json`, options))
    .catch(err => {
      err.message && console.log(symbol.error, chalk.red(err.message));
    });
};

export default genElectron;
