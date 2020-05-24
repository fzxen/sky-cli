import { QuestionCollection, Answers } from 'inquirer';

export const genFrameQuestions = (): QuestionCollection<Answers> => {
  return [
    {
      type: 'list',
      name: 'frame',
      message: 'please choose this project template',
      choices: ['vue', 'react', 'electron'],
    },
  ];
};

export const genVueQuestions = (name: string): QuestionCollection<Answers> => {
  return [
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
    {
      type: 'confirm',
      message: 'Do you need eslint(standard&prettier)',
      name: 'eslint',
      default: true,
    },
    {
      type: 'confirm',
      message: 'Do you need git hook to lint your commit message',
      name: 'commitLint',
      default: true,
    },
    {
      type: 'confirm',
      message: 'Do you need git hook to lint your code(eslint muse be checked)',
      name: 'codeLint',
      default: true,
    },
  ];
};
export const genElectronQuestions = (
  name: string
): QuestionCollection<Answers> => {
  return [
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
