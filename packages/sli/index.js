'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var commander = require('commander');
var symbol = _interopDefault(require('log-symbols'));
var chalk = _interopDefault(require('chalk'));
var inquirer = _interopDefault(require('inquirer'));
var fs = require('fs');
var path = require('path');
var downloadGit = _interopDefault(require('download-git-repo'));
var ora = _interopDefault(require('ora'));
var child_process = require('child_process');

var isNone = (obj) => obj === undefined || obj === null;

const isFoldExist = (name) => {
    return new Promise((resolve, reject) => {
        if (isNone(name))
            reject(new Error('name must be provided'));
        if (fs.existsSync(name))
            reject(new Error(`${name} has existed`));
        else
            resolve();
    });
};

const genFrameQuestions = () => {
    return [
        {
            type: 'list',
            name: 'frame',
            message: 'please choose this project template',
            choices: ['vue', 'react', 'electron'],
        },
    ];
};
const genVueQuestions = (name) => {
    return [
        {
            type: 'input',
            name: 'name',
            message: 'Please enter the project name: ',
            default: name,
            validate(value) {
                if (!value)
                    return 'you must provide the name';
                return true;
            },
        },
        {
            type: 'input',
            name: 'description',
            message: 'Please enter the project description: ',
            validate(value) {
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
            validate(value) {
                if (!value)
                    return 'you must provide the author';
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
const genElectronQuestions = (name) => {
    return [
        {
            type: 'input',
            name: 'name',
            message: 'Please enter the project name: ',
            default: name,
            validate(value) {
                if (!value)
                    return 'you must provide the name';
                return true;
            },
        },
        {
            type: 'input',
            name: 'description',
            message: 'Please enter the project description: ',
            validate(value) {
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
            validate(value) {
                if (!value)
                    return 'you must provide the author';
                return true;
            },
        },
    ];
};

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

var depVersions;
(function (depVersions) {
    depVersions["babel-eslint"] = "^10.1.0";
    depVersions["eslint"] = "^6.8.0";
    depVersions["eslint-config-prettier"] = "^6.11.0";
    depVersions["eslint-plugin-prettier"] = "^3.1.3";
    depVersions["eslint-plugin-vue"] = "^6.2.2";
    depVersions["husky"] = "^4.2.5";
    depVersions["lint-staged"] = "^9.5.0";
    depVersions["postcss-import"] = "^12.0.1";
    depVersions["postcss-loader"] = "^3.0.0";
    depVersions["postcss-preset-env"] = "^6.7.0";
    depVersions["prettier"] = "^1.19.1";
    depVersions["raw-loader"] = "^4.0.1";
    depVersions["standard"] = "^14.3.3";
    depVersions["@commitlint/cli"] = "^8.3.5";
    depVersions["@commitlint/config-conventional"] = "^8.3.4";
    depVersions["@redcoast/sli-vue"] = "0.1.1";
})(depVersions || (depVersions = {}));
var depVersions$1 = depVersions;

const createCliConfig = (path$1) => __awaiter(void 0, void 0, void 0, function* () { return fs.copyFileSync(path.resolve(__dirname, './sources/sli.config.js'), path$1); });
const createCommitlintrc = (path$1) => fs.copyFile(path.resolve(__dirname, './sources/.commitlintrc.js'), path$1, err => {
    if (err)
        throw new Error('.commitlintrc.js failed to create');
});
// 更新 vue 相关
const updateVue = (options, json) => {
    // eslint-vue
    const { name, eslint } = options;
    if (eslint) {
        json.scripts.lint = 'eslint --ext .js,.vue src';
        json.scripts.fix = 'eslint --fix --ext .js,.vue src';
        json.devDependencies['eslint'] = depVersions$1['eslint'];
        json.devDependencies['eslint-config-prettier'] =
            depVersions$1['eslint-config-prettier'];
        json.devDependencies['eslint-plugin-prettier'] =
            depVersions$1['eslint-plugin-prettier'];
        json.devDependencies['eslint-plugin-vue'] =
            depVersions$1['eslint-plugin-vue'];
        json.devDependencies['prettier'] = depVersions$1['prettier'];
        json.devDependencies['standard'] = depVersions$1['standard'];
        json.devDependencies['babel-eslint'] = depVersions$1['babel-eslint'];
        fs.copyFile(path.resolve(__dirname, './sources/vue/.eslintrc.js'), `${name}/.eslintrc.js`, err => {
            if (err)
                throw new Error('.eslintrc.js failed to create');
        });
        fs.copyFile(path.resolve(__dirname, './sources/vue/.eslintignore'), `${name}/.eslintignore`, err => {
            if (err)
                throw new Error('.elsintignore failed to create');
        });
    }
    // 修改 sli-vue版本
    json.devDependencies['@redcoast/sli-vue'] = depVersions$1['@redcoast/sli-vue'];
    return json;
};
// 设置git hook
const setHook = (options, json) => {
    var _a;
    const { name, codeLint, commitLint, eslint } = options;
    // git hook
    if (commitLint || (eslint && codeLint))
        json.devDependencies.husky = depVersions$1['husky'];
    if (commitLint) {
        json.husky = {
            hooks: {
                'commit-msg': "echo 'commit checking.... && commitlint -E HUSKY_GIT_PARAMS",
            },
        };
        json.devDependencies['@commitlint/cli'] = depVersions$1['@commitlint/cli'];
        json.devDependencies['@commitlint/config-conventional'] =
            depVersions$1['@commitlint/config-conventional'];
        createCommitlintrc(`${name}/.commitlintrc.js`);
    }
    if (eslint && codeLint) {
        if ((_a = json === null || json === void 0 ? void 0 : json.husky) === null || _a === void 0 ? void 0 : _a.hooks)
            json.husky.hooks['pre-commit'] =
                "echo 'code checking....' && lint-staged";
        else
            json.husky = {
                hooks: { 'pre-commit': "echo 'code checking....' && lint-staged" },
            };
        json['lint-staged'] = {
            '*.{js,vue}': ['eslint --fix', 'git add'],
        };
        json.devDependencies['lint-staged'] = depVersions$1['lint-staged'];
    }
    return json;
};
const updatePackage = (path, options) => {
    return new Promise(resolve => {
        if (fs.existsSync(path)) {
            const data = fs.readFileSync(path).toString();
            let json = JSON.parse(data);
            // 更新基础字段
            const { name, description, author, frame } = options;
            Object.assign(json, { name, description, author });
            json = setHook(options, json);
            if (frame === 'vue')
                json = updateVue(options, json);
            // TODO fan 更新 cli-vue cli-react cli-electron依赖的版本
            fs.writeFileSync(path, JSON.stringify(json, null, '\t'));
            resolve();
        }
    });
};

const gitSources = {
    vue: {
        url: 'direct:https://gitee.com/zxffan/templates.git#vue-spa',
    },
    react: {
        url: '',
    },
    electron: {
        url: 'direct:https://gitee.com/zxffan/templates.git#electron',
    },
};

const download = (options) => {
    return new Promise((resolve, reject) => {
        const { name, frame } = options;
        const loading = ora();
        loading.start('downloading...');
        const source = gitSources[frame];
        if (!source.url) {
            loading.fail(`${frame} is not provided for now`);
            reject(new Error());
        }
        downloadGit(source.url, name, { clone: true }, err => {
            if (err) {
                loading.fail('download failed, please check your network');
                reject(err);
            }
            else {
                loading.succeed('download successfully');
                resolve(options);
            }
        });
    });
};

const updateProject = (options) => {
    return updatePackage(`${options.name}/package.json`, options)
        .then(() => createCliConfig(`${options.name}/sli.config.js`))
        .then(() => {
        // TODO
        console.log(symbol.success, chalk.green('project has been updated'));
    });
};
const successTip = (name) => [
    chalk.green('app has been created successfully\n'),
    `\t cd ${name}`,
    '\t npm install or yarn',
    '\t npm start',
].join('\n');
const genVue = (name) => {
    const frame = 'vue';
    inquirer
        .prompt(genVueQuestions(name))
        .then(answer => download(Object.assign(answer, { frame })))
        .then(answer => updateProject(answer))
        .then(() => {
        console.log(symbol.success, successTip(name));
    })
        .catch(err => {
        err.message && console.log(symbol.error, chalk.red(err.message));
    });
};

const genElectron = (name) => {
    const frame = 'electron';
    inquirer
        .prompt(genElectronQuestions(name))
        .then(answer => download(Object.assign(answer, { frame })))
        .then(options => updatePackage(`${name}/package.json`, options))
        .catch(err => {
        err.message && console.log(symbol.error, chalk.red(err.message));
    });
};

var create = (name) => {
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

var getInitQuestions = () => {
    return [
        {
            type: 'confirm',
            message: 'Do you need initialize a git repository',
            name: 'git',
            default: false,
        },
    ];
};

function initRepository() {
    const loading = ora();
    loading.start('git repository initializing...');
    child_process.exec('git init', err => {
        if (isNone(err)) {
            loading.succeed('git repository initialize successfully');
        }
        else {
            loading.fail('git repository initialization failed');
        }
    });
}
function intall() {
    const loading = ora();
    loading.start('npm installing...');
    child_process.exec('npm install', (err, stdout, stderr) => {
        console.log(symbol.success, chalk.green(stdout));
        console.log(symbol.error, chalk.red(stderr));
        if (isNone(err)) {
            loading.succeed('npm install successfully');
        }
        else {
            loading.fail('npm install failed');
        }
    });
}
var init = () => {
    inquirer.prompt(getInitQuestions()).then(answers => {
        if (answers instanceof Object && 'git' in answers) {
            const { git } = answers;
            git && initRepository();
            intall();
        }
    });
    // TODO ??� npm or yarn
    // exec('npm install', (err, stdout, stderr) => {})
};

const program = new commander.Command();
program
    .command('create <name>')
    .description('create a new project')
    .alias('c')
    .action((name) => {
    create(name);
});
program
    .command('init')
    .description('initialize project')
    .alias('i')
    .action(() => {
    init();
});
// program
//   .command('dev')
//   .description('run your app in development')
//   .alias('d')
//   .option('-p, --port <port>', 'Port used by the server (default: 8080)')
//   .action(cmdObj => {
//     dev(cmdObj.port || 8080);
//   });
// program
//   .command('build')
//   .description('build your app (production)')
//   .alias('b')
//   .option('-a, --analysis', 'show buldle information')
//   .action(cmdObj => {
//     build(cmdObj.analysis);
//   });
program
    .version(require('./package.json').version, '-v --version')
    .parse(process.argv);
// show help info when no params
if (!process.argv.slice(2).length)
    program.outputHelp();
