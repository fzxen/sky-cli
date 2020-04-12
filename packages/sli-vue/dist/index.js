"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var dev_1 = __importDefault(require("./dev"));
var build_1 = __importDefault(require("./build"));
var program = new commander_1.Command();
program
    .command('dev')
    .description('run your app in development')
    .alias('d')
    .option('-p, --port <port>', 'Port used by the server (default: 8080)')
    .action(function (cmdObj) {
    dev_1.default(cmdObj.port || 8080);
});
program
    .command('build')
    .description('build your app (production)')
    .alias('b')
    .option('-a, --analysis', 'show buldle information')
    .action(function (cmdObj) {
    build_1.default(cmdObj.analysis);
});
program
    .version(require('../package.json').version, '-v --version')
    .parse(process.argv);
// show help info when no params
if (!process.argv.slice(2).length)
    program.outputHelp();
