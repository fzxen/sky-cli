import { QuestionCollection, Answers } from 'inquirer';

const genQuestions = (name: string): QuestionCollection<Answers> => {
  return [
    {
      type: 'list',
      name: 'frame',
      message: 'please choose this project template',
      choices: ['vue', 'react', 'electron'],
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

export default genQuestions;
