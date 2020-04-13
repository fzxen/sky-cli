"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var webpack_merge_1 = __importDefault(require("webpack-merge")); // TODO fan 自定义merge算法
var gen_cdn_1 = __importDefault(require("./gen_cdn"));
var absolute_1 = __importDefault(require("./absolute"));
// * rules
var loaders_1 = require("./loaders");
// * plugins
var plugins_1 = require("./plugins");
var gen_terser_plugin_1 = __importDefault(require("./plugins/gen_terser_plugin"));
function genCommon(mode, options) {
    var _a, _b;
    // option - analysis cdn css
    var analysis = options.analysis;
    var css = options.css;
    var loaderOption = css.loaderOption;
    var cdn = options.cdn;
    // * 处理cdn
    var externals = {};
    var htmlCdns = [];
    if (cdn) {
        var cdnOption = gen_cdn_1.default(cdn.sources, cdn.origin, mode);
        externals = cdnOption.externals;
        htmlCdns = cdnOption.htmlCdns;
    }
    return {
        entry: {
            main: './src/main.js',
        },
        module: {
            rules: __spreadArrays([
                loaders_1.genCssLoader(mode, css.module)
            ], loaders_1.genStaticsLoader(mode), [
                loaders_1.genSassLoader(mode, (_a = loaderOption['scss']) === null || _a === void 0 ? void 0 : _a.prependData),
                loaders_1.genVueLoader(mode),
                loaders_1.genJsLoader(mode),
                loaders_1.genLessLoader(mode, (_b = loaderOption['less']) === null || _b === void 0 ? void 0 : _b.prependData),
            ]),
        },
        plugins: [
            analysis ? plugins_1.genBundleAnalyzerPlugin() : null,
            plugins_1.genHtmlWebpackPlugin(mode, htmlCdns),
            plugins_1.genCleanWebpackPlugin(mode),
            plugins_1.genHotModuleReplacementPlugin(mode),
            plugins_1.genMiniCssExtractPlugin(mode),
            plugins_1.genOptimizeCssAssetsWebpackPlugin(mode),
            plugins_1.genVueLoaderPlugin(),
        ].filter(function (item) { return item; }),
        externals: externals,
    };
}
function genDev(mode, options) {
    var common = genCommon(mode, options);
    return webpack_merge_1.default(common, {
        output: {
            publicPath: '/',
            filename: 'assets/[name].js',
            path: absolute_1.default('./dist'),
        },
        mode: mode,
        devtool: 'cheap-module-eval-source-map',
        devServer: {
            hot: true,
            inline: true,
            open: true,
            stats: 'errors-warnings',
            compress: true,
            // contentBase: path.resolve(__dirname, './dist'),
            historyApiFallback: true,
            overlay: {
                // 浏览器全屏显示错误
                errors: true,
                warnings: false,
            },
        },
    });
}
function genProd(mode, options) {
    var common = genCommon(mode, options);
    return webpack_merge_1.default(common, {
        output: {
            publicPath: '/',
            filename: 'assets/[name][chunkhash:8].js',
            path: absolute_1.default('./dist'),
        },
        mode: mode,
        optimization: {
            minimize: true,
            minimizer: [gen_terser_plugin_1.default()],
            splitChunks: {
                chunks: 'all',
                minSize: 30000,
                maxSize: 0,
                minChunks: 1,
                maxAsyncRequests: 5,
                maxInitialRequests: 3,
                automaticNameDelimiter: '~',
                name: true,
                cacheGroups: {
                    vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10,
                    },
                    default: {
                        minChunks: 2,
                        priority: -20,
                        reuseExistingChunk: true,
                    },
                },
            },
        },
    });
}
exports.default = (function (mode, option) {
    return mode === 'development' ? genDev(mode, option) : genProd(mode, option);
});
