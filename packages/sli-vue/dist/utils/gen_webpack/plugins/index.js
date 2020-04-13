"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var webpack_1 = require("webpack");
var clean_webpack_plugin_1 = require("clean-webpack-plugin");
var optimize_css_assets_webpack_plugin_1 = __importDefault(require("optimize-css-assets-webpack-plugin"));
var vue_loader_1 = require("vue-loader");
var mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
var webpack_bundle_analyzer_1 = require("webpack-bundle-analyzer");
var absolute_1 = __importDefault(require("../absolute"));
var html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
var cssnano_1 = __importDefault(require("cssnano"));
/**
 ** plugins
 */
exports.genVueLoaderPlugin = function () {
    return new vue_loader_1.VueLoaderPlugin();
};
// only production
// const genModuleConcatenationPlugin = ():
//   | optimize.ModuleConcatenationPlugin
//   | undefined => {
//   let plugin;
//   if (mode === 'production') plugin = new optimize.ModuleConcatenationPlugin();
//   return plugin;
// };
// only development
exports.genHotModuleReplacementPlugin = function (mode) {
    var plugin;
    if (mode === 'development')
        plugin = new webpack_1.HotModuleReplacementPlugin();
    return plugin;
};
// only production
exports.genMiniCssExtractPlugin = function (mode) {
    var plugin;
    if (mode === 'production') {
        plugin = new mini_css_extract_plugin_1.default({
            filename: 'assets/style/[name][contenthash:8].css',
        });
    }
    return plugin;
};
// only production
exports.genCleanWebpackPlugin = function (mode) {
    var plugin;
    if (mode === 'production')
        plugin = new clean_webpack_plugin_1.CleanWebpackPlugin();
    return plugin;
};
// only production
exports.genOptimizeCssAssetsWebpackPlugin = function (mode) {
    var plugin;
    if (mode === 'production') {
        plugin = new optimize_css_assets_webpack_plugin_1.default({
            assetNameRegExp: /\.css$/,
            cssProcessor: cssnano_1.default,
            cssProcessorPluginOptions: {
                preset: ['default', { discardComments: { removeAll: true } }],
            },
        });
    }
    return plugin;
};
// only production
exports.genBundleAnalyzerPlugin = function () {
    return new webpack_bundle_analyzer_1.BundleAnalyzerPlugin({
        analyzerPort: 'auto',
    });
};
exports.genHtmlWebpackPlugin = function (mode, externalConfig, template, favicon) {
    if (template === void 0) { template = './public/index.html'; }
    if (favicon === void 0) { favicon = './public/favicon.ico'; }
    var options = {
        template: absolute_1.default(template),
        favicon: absolute_1.default(favicon),
        cdnConfig: externalConfig,
        inject: !externalConfig,
    };
    var prodOptions = {
        minify: {
            caseSensitive: false,
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            removeComments: true,
        },
    };
    if (mode === 'production')
        options = __assign(__assign({}, options), prodOptions);
    return new html_webpack_plugin_1.default(options);
};
