"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var genQuestions = function (name) {
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
            validate: function (value) {
                if (!value)
                    return 'you must provide the name';
                return true;
            },
        },
        {
            type: 'input',
            name: 'description',
            message: 'Please enter the project description: ',
            validate: function (value) {
                if (!value)
                    return 'you must provide the description';
                return true;
            },
        },
        {
            type: 'input',
            name: 'author',
            message: 'Please enter the author name: ',
            default: 'fanzhongxu',
            validate: function (value) {
                if (!value)
                    return 'you must provide the author';
                return true;
            },
        },
    ];
};
exports.default = genQuestions;
