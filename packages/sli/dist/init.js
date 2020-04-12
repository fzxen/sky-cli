"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var inquirer_1 = __importDefault(require("inquirer"));
var chalk_1 = __importDefault(require("chalk"));
var log_symbols_1 = __importDefault(require("log-symbols"));
var ora_1 = __importDefault(require("ora"));
var is_none_1 = __importDefault(require("./utils/is_none"));
var gen_init_questions_1 = __importDefault(require("./utils/gen_init_questions"));
function initRepository() {
    var loading = ora_1.default();
    loading.start('git repository initializing...');
    child_process_1.exec('git init', function (err) {
        if (is_none_1.default(err)) {
            loading.succeed('git repository initialize successfully');
        }
        else {
            loading.fail('git repository initialization failed');
        }
    });
}
function intall() {
    var loading = ora_1.default();
    loading.start('npm installing...');
    child_process_1.exec('npm install', function (err, stdout, stderr) {
        console.log(log_symbols_1.default.success, chalk_1.default.green(stdout));
        console.log(log_symbols_1.default.error, chalk_1.default.red(stderr));
        if (is_none_1.default(err)) {
            loading.succeed('npm install successfully');
        }
        else {
            loading.fail('npm install failed');
        }
    });
}
exports.default = (function () {
    inquirer_1.default.prompt(gen_init_questions_1.default()).then(function (answers) {
        if (answers instanceof Object && 'git' in answers) {
            var git = answers.git;
            git && initRepository();
            intall();
        }
    });
    // TODO 判断 npm or yarn
    // exec('npm install', (err, stdout, stderr) => {})
});
