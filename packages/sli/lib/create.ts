import symbol from 'log-symbols';
import chalk from 'chalk';
import inquirer from 'inquirer';

import isFoldExist from './utils/is_fold_exist';
import { genFrameQuestions } from './utils/gen_create_questions';
import genVue from './gen_vue';
import genElectron from './gen_electron';

export default (name: string): void => {
  isFoldExist(name)
    .then(() => inquirer.prompt(genFrameQuestions()))
    .then(answer => {
      switch (answer.frame) {
        case 'vue':
          genVue(name);
          break;
        case 'electron':
          genElectron(name);
          break;
        case 'react':
          // TODO
          console.log(symbol.error, 'react is supported for now');
          break;
      }
    })
    .catch(err => {
      err.message && console.log(symbol.error, chalk.red(err.message));
    });
};
