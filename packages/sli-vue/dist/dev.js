"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ora_1 = __importDefault(require("ora"));
var webpack_1 = __importDefault(require("webpack"));
var webpack_dev_server_1 = __importDefault(require("webpack-dev-server"));
var get_cli_config_1 = __importDefault(require("./utils/get_cli_config"));
var path_1 = __importDefault(require("path"));
exports.default = (function (port) {
    var _a, _b;
    var loading = ora_1.default();
    loading.start('app is starting...');
    // set enviroment
    process.env.NODE_ENV = 'development';
    var config = get_cli_config_1.default(path_1.default.resolve(__dirname, '../sources/webpack.dev'));
    var compiler = webpack_1.default(config);
    compiler.hooks.done.tap('buildTip', function () {
        loading.succeed("compile successfully!\n      please open  http://localhost:" + port);
    });
    compiler.hooks.failed.tap('buildTip', function (err) {
        loading.fail('conmpile failed');
        console.log(err);
    });
    port = port || ((_a = config.devServer) === null || _a === void 0 ? void 0 : _a.port) || 8080;
    var host = ((_b = config.devServer) === null || _b === void 0 ? void 0 : _b.host) || 'localhost';
    new webpack_dev_server_1.default(compiler, config.devServer || {}).listen(port, host);
});
