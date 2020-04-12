"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var webpack_chain_1 = __importDefault(require("webpack-chain"));
var webpack_merge_1 = __importDefault(require("webpack-merge"));
var defaultCliConfig = {
    /**
     * * property: configureWebpack
     * * type: object | function
     * * 这会直接merge到最终webpack配置
     */
    configureWebpack: {},
    /**
     * * property: chainWebpack
     * * type: function
     * * 是一个函数，会接收一个基于 webpack-chain 的 ChainableConfig 实例。允许对内部的 webpack 配置进行更细粒度的修改。
     */
    chainWebpack: function (config) { },
    /**
     * * property: devServer
     * * type: object
     * * 会传递给webpack-dev-server
     */
    devServer: {},
    /**
     * * property: css
     * * type: object
     * * 与css相关的配置
     */
    css: {
        loaderOption: {
            scss: {
                prependData: [],
            },
            less: {
                prependData: [],
            },
        },
    },
    /**
     * * property: analysis
     * * type: boolean
     * * 若为tru， 打包时会启用BundleAnalyzerPlugin
     */
    analysis: false,
};
exports.default = (function (path, options) {
    if (options === void 0) { options = {}; }
    function getConfig() {
        var genConfig = require(path); // eslint-disable-line
        var cliConfig = require(process.cwd() + "/cli.config.js"); // eslint-disable-line
        var _a = webpack_merge_1.default(defaultCliConfig, cliConfig), configureWebpack = _a.configureWebpack, chainWebpack = _a.chainWebpack, devServer = _a.devServer, args = __rest(_a, ["configureWebpack", "chainWebpack", "devServer"]);
        var chainConfig = new webpack_chain_1.default();
        chainWebpack(chainConfig);
        return webpack_merge_1.default(genConfig(Object.assign(args, options)), configureWebpack, chainConfig.toConfig(), {
            devServer: devServer,
        });
    }
    return getConfig();
});
