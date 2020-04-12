"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var log_symbols_1 = __importDefault(require("log-symbols"));
var chalk_1 = __importDefault(require("chalk"));
var ora_1 = __importDefault(require("ora"));
var inquirer_1 = __importDefault(require("inquirer"));
var download_git_repo_1 = __importDefault(require("download-git-repo"));
var is_fold_exist_1 = __importDefault(require("./utils/is_fold_exist"));
var git_sources_1 = __importDefault(require("./utils/git_sources"));
var update_1 = require("./utils/update");
var gen_create_questions_1 = __importDefault(require("./utils/gen_create_questions"));
var download = function (options) {
    return new Promise(function (resolve, reject) {
        var name = options.name, frame = options.frame;
        var loading = ora_1.default();
        loading.start('downloading...');
        var source = git_sources_1.default[frame];
        if (!source.url) {
            loading.fail(frame + " is not provided for now");
            reject(new Error());
        }
        download_git_repo_1.default(source.url, name, { clone: true }, function (err) {
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
var updateProject = function (options) {
    return update_1.updatePackage(options.name + "/package.json", options)
        .then(function () { return update_1.createCliConfig(options.name + "/cli.config.js"); })
        .then(function () {
        // TODO
        console.log(log_symbols_1.default.success, chalk_1.default.green('project has been updated'));
        Promise.resolve();
    });
};
var successTip = function (name) {
    return [
        chalk_1.default.green('app has been created successfully\n'),
        "\t cd " + name,
        '\t sli init',
        '\t sli dev',
    ].join('\n');
};
exports.default = (function (name) {
    is_fold_exist_1.default(name)
        .then(function () { return inquirer_1.default.prompt(gen_create_questions_1.default(name)); })
        .then(function (answer) { return download(answer); })
        .then(function (answer) { return updateProject(answer); })
        .then(function () {
        console.log(log_symbols_1.default.success, successTip(name));
    })
        .catch(function (err) {
        err.message && console.log(log_symbols_1.default.error, chalk_1.default.red(err.message));
    });
});
