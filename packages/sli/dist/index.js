"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var create_1 = __importDefault(require("./create"));
var init_1 = __importDefault(require("./init"));
var program = new commander_1.Command();
program
    .command('create <name>')
    .description('create a new project')
    .alias('c')
    .action(function (name) {
    create_1.default(name);
});
program
    .command('init')
    .description('initialize project')
    .alias('i')
    .action(function () {
    init_1.default();
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
    .version(require('../package.json').version, '-v --version')
    .parse(process.argv);
// show help info when no params
if (!process.argv.slice(2).length)
    program.outputHelp();
