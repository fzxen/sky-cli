"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ora_1 = __importDefault(require("ora"));
var webpack_1 = __importDefault(require("webpack"));
var chalk_1 = __importDefault(require("chalk"));
var path_1 = __importDefault(require("path"));
var get_cli_config_1 = __importDefault(require("./utils/get_cli_config"));
exports.default = (function (analysis) {
    var loading = ora_1.default();
    loading.start('app is building...');
    // set enviroment
    process.env.NODE_ENV = 'production';
    var config = get_cli_config_1.default(path_1.default.resolve(__dirname, '../sources/webpack.prod'), { analysis: analysis });
    var compiler = webpack_1.default(config);
    compiler.hooks.done.tap('buildTip', function () {
        loading.succeed('build successfully!');
    });
    compiler.hooks.failed.tap('buildTip', function (err) {
        loading.fail('build failed');
        console.log(err);
    });
    compiler.run(function (err, stats) {
        var result = stats.toJson();
        console.log([
            chalk_1.default.green("Time\uFF1A" + result.time + "ms"),
            chalk_1.default.green("webpack version: " + result.version),
        ].join('\n'));
    });
});
