'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var commander = require('commander');
var ora = _interopDefault(require('ora'));
var Webpack = require('webpack');
var Webpack__default = _interopDefault(Webpack);
var WebpackDevServer = _interopDefault(require('webpack-dev-server'));
var WebpackChain = _interopDefault(require('webpack-chain'));
var path = _interopDefault(require('path'));
var fs = _interopDefault(require('fs'));
var MiniCssExtractPlugin = _interopDefault(require('mini-css-extract-plugin'));
var cleanWebpackPlugin = require('clean-webpack-plugin');
var OptimizeCssAssetsWebpackPlugin = _interopDefault(require('optimize-css-assets-webpack-plugin'));
var vueLoader = require('vue-loader');
var webpackBundleAnalyzer = require('webpack-bundle-analyzer');
var HtmlWebpackPlugin = _interopDefault(require('html-webpack-plugin'));
var cssnano = _interopDefault(require('cssnano'));
var TerserPlugin = _interopDefault(require('terser-webpack-plugin'));
var chalk = _interopDefault(require('chalk'));

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

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

/**
 * * 获取变量类型
 */
/**
 * @description 获取变量类型
 * @author fanzhongxu
 * @param {any} variable 变量
 * @returns 类型
 */
function getTypeof (variable) {
    var _a;
    const result = (_a = Object.prototype.toString
        .call(variable)
        .match(/\s(\w*)]$/)) === null || _a === void 0 ? void 0 : _a[1].toLowerCase();
    return result; // eslint-disable-line
}

/**
 * * 深合并
 * * 对象、map对应key合并
 * * 数组、set，=> concat
 */
const isArray = (p) => {
    return getTypeof(p) === 'array';
};
const isObject = (p) => {
    return getTypeof(p) === 'object';
};
const isMap = (p) => {
    return getTypeof(p) === 'map';
};
const isSet = (p) => {
    return getTypeof(p) === 'set';
};
const merger = {
    mergeArray(a, b) {
        a.splice(a.length, b.length, ...b);
    },
    mergeSet(a, b) {
        b.forEach(e => a.add(e));
    },
    mergeMap(a, b) {
        b.forEach((value, key) => {
            if (isArray(value)) {
                !a.has(key) && a.set(key, []);
                this.mergeArray(a.get(key), value);
            }
            else if (isObject(value)) {
                !a.has(key) && a.set(key, {});
                this.mergeObject(a.get(key), value);
            }
            else if (isMap(value)) {
                !a.has(key) && a.set(key, new Map());
                this.mergeMap(a.get(key), value);
            }
            else if (isSet(value)) {
                !a.has(key) && a.set(key, new Set());
                this.mergeSet(a.get(key), value);
            }
            else {
                a.set(key, value);
            }
        });
    },
    mergeObject(a, b) {
        var _a, _b, _c, _d;
        this['mergeArray'];
        for (const key in b) {
            if (Object.prototype.hasOwnProperty.call(b, key)) {
                const value = b[key];
                if (isArray(value)) {
                    (_a = a[key]) !== null && _a !== void 0 ? _a : (a[key] = []);
                    this.mergeArray(a[key], value);
                }
                else if (isObject(value)) {
                    (_b = a[key]) !== null && _b !== void 0 ? _b : (a[key] = {});
                    this.mergeObject(a[key], value);
                }
                else if (isMap(value)) {
                    (_c = a[key]) !== null && _c !== void 0 ? _c : (a[key] = new Map());
                    this.mergeMap(a[key], value);
                }
                else if (isSet(value)) {
                    (_d = a[key]) !== null && _d !== void 0 ? _d : (a[key] = new Set());
                    this.mergeSet(a[key], value);
                }
                else {
                    a[key] = value;
                }
            }
        }
    },
};
const mergeElement = (target, element) => {
    if (getTypeof(target) !== getTypeof(element)) {
        throw new Error('[error]: 相同字段类型必须一致');
    }
    else if (isArray(element)) {
        isArray(target) && merger.mergeArray(target, element);
    }
    else if (isObject(element)) {
        isObject(target) && merger.mergeObject(target, element);
    }
    else if (isMap(element)) {
        isMap(target) && merger.mergeMap(target, element);
    }
    else if (isSet(element)) {
        isSet(target) && merger.mergeSet(target, element);
    }
    else {
        target = element;
    }
};
/**
 * @description 深合并算法
 * @param {T} target 目标对象
 * @param {...T[]} args 待合并对象
 * @returns {T} 合并结果
 */
const deepMerge = function (target, ...args) {
    for (const element of args)
        mergeElement(target, element);
    return target;
};

var absolute = (relative) => path.resolve(process.cwd(), `${relative}`);

/**
 ** CDN
 */
// 获取所有依赖及其版本号
const getModulesVersion = () => {
    var _a;
    const mvs = {};
    const data = fs.readFileSync(absolute('./package.json')).toString();
    const json = JSON.parse(data);
    const dependencies = json.dependencies;
    for (const m in dependencies) {
        if (Object.prototype.hasOwnProperty.call(dependencies, m)) {
            mvs[m] = (_a = /\d+\.\d+\.\d+$/g.exec(dependencies[m])) === null || _a === void 0 ? void 0 : _a[0];
        }
    }
    return mvs;
};
// 处理externalConfig，并返回externals
var genCdn = (config, orign, mode) => {
    const externals = {}; // 结果
    const dependencieModules = getModulesVersion(); // 获取全部的模块和版本号
    const htmlCdns = config.map(item => {
        if (item.name in dependencieModules) {
            const version = dependencieModules[item.name];
            // 拼接css 和 js 完整链接
            externals[item.name] = item.scope;
            return {
                css: item.css &&
                    [orign, item.alias || item.name, version, item.css[mode]].join('/'),
                js: item.js &&
                    [orign, item.alias || item.name, version, item.js[mode]].join('/'),
            };
        }
        else {
            throw new Error('相关依赖未安装，请先执行npm install ' + item.name);
        }
    });
    return { externals, htmlCdns };
};

// const { absolute } = require('../utils')
const isMultiCpu = require('os').cpus().length > 1;
/**
 ** loader
 */
const eslintLoader = {
    loader: require.resolve('eslint-loader'),
    options: {
        fix: true,
    },
};
const genJsLoader = (mode, eslintCompileCheck) => {
    const options = {
        test: /\.(js)$/,
        use: [
            isMultiCpu ? require.resolve('thread-loader') : '',
            {
                loader: require.resolve('babel-loader'),
                options: { cacheDirectory: true, sourceType: 'unambiguous' },
            },
        ].filter(item => item),
        include: [/src/],
    };
    const devOptions = [eslintLoader];
    // 启用eslint-loader
    const isCheck = eslintCompileCheck !== false;
    if (mode === 'development' && isCheck)
        options.use.push(...devOptions);
    return options;
};
const genVueLoader = (mode, eslintCompileCheck) => {
    const options = {
        test: /\.vue$/,
        use: [
            isMultiCpu ? require.resolve('thread-loader') : '',
            require.resolve('vue-loader'),
        ].filter(item => item),
        include: [/src/],
    };
    const devOptions = [eslintLoader];
    // 开发环境启用eslint-loader
    const isCheck = eslintCompileCheck !== false;
    if (mode === 'development' && isCheck)
        options.use.push(...devOptions);
    return options;
};
const genCssLoader = (mode, module) => {
    const result = {
        test: /\.css$/,
        oneOf: [
            // 这里匹配普通的 `<style>` 或 `<style scoped>`
            {
                use: [
                    mode === 'production'
                        ? MiniCssExtractPlugin.loader
                        : require.resolve('vue-style-loader'),
                    require.resolve('css-loader'),
                    require.resolve('postcss-loader'),
                ],
            },
        ],
    };
    //  开启css-module
    if (module) {
        result.oneOf.unshift(
        // 这里匹配 `<style module>`
        {
            resourceQuery: /module/,
            use: [
                mode === 'production'
                    ? MiniCssExtractPlugin.loader
                    : require.resolve('vue-style-loader'),
                {
                    loader: require.resolve('css-loader'),
                    options: {
                        modules: true,
                    },
                },
                require.resolve('postcss-loader'),
            ],
        });
    }
    return result;
};
const genLessLoader = (mode, prependData) => {
    const result = {
        test: /\.less$/,
        use: [
            mode === 'production'
                ? MiniCssExtractPlugin.loader
                : require.resolve('vue-style-loader'),
            require.resolve('css-loader'),
            require.resolve('postcss-loader'),
            {
                loader: require.resolve('less-loader'),
                options: {
                    javascriptEnabled: true,
                },
            },
        ],
    };
    if (prependData && prependData.length > 0) {
        result.use.push({
            loader: require.resolve('sass-resources-loader'),
            options: {
                resources: prependData,
            },
        });
    }
    return result;
};
const genSassLoader = (mode, prependData) => {
    const result = {
        test: /\.s(a|c)ss$/,
        use: [
            mode === 'production'
                ? MiniCssExtractPlugin.loader
                : require.resolve('vue-style-loader'),
            require.resolve('css-loader'),
            require.resolve('postcss-loader'),
            require.resolve('sass-loader'),
        ],
    };
    if (prependData && prependData.length > 0) {
        result.use.push({
            loader: require.resolve('sass-resources-loader'),
            options: {
                resources: prependData,
            },
        });
    }
    return result;
};
const genStaticsLoader = (mode) => {
    const name = mode === 'production' ? '[name][contenthash:8].[ext]' : '[name].[ext]';
    // 图片资源解析器
    const imgResolver = {
        test: /\.(jpg|png|gif|jpeg|svg)$/i,
        use: [
            {
                loader: require.resolve('url-loader'),
                options: {
                    limit: 3 * 1024,
                    name: `assets/images/${name}`,
                    esModule: false,
                },
            },
        ],
    };
    // 字体资源解析器
    const fontResolver = {
        test: /\.(woff2|woff|eot|ttf|otf)$/i,
        loader: require.resolve('url-loader'),
        options: {
            name: `assets/fonts/${name}`,
            esModule: false,
        },
    };
    // 视频&音频资源解析器
    const mediaResolver = {
        test: /\.(mp4|avi|mp3|rmvb|wmv|flv)$/i,
        loader: require.resolve('url-loader'),
        options: {
            name: `assets/media/${name}`,
            esModule: false,
        },
    };
    const fileResolver = {
        test: /\.(pdf|doc|docx|ppt|xls|xlsx)$/i,
        loader: require.resolve('url-loader'),
        options: {
            name: `assets/files/${name}`,
            esModule: false,
        },
    };
    return [imgResolver, fontResolver, mediaResolver, fileResolver];
};

/**
 ** plugins
 */
const genVueLoaderPlugin = () => {
    return new vueLoader.VueLoaderPlugin();
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
const genHotModuleReplacementPlugin = (mode) => {
    let plugin;
    if (mode === 'development')
        plugin = new Webpack.HotModuleReplacementPlugin();
    return plugin;
};
// only production
const genMiniCssExtractPlugin = (mode) => {
    let plugin;
    if (mode === 'production') {
        plugin = new MiniCssExtractPlugin({
            filename: 'assets/style/[name][contenthash:8].css',
        });
    }
    return plugin;
};
// only production
const genCleanWebpackPlugin = (mode) => {
    let plugin;
    if (mode === 'production')
        plugin = new cleanWebpackPlugin.CleanWebpackPlugin();
    return plugin;
};
// only production
const genOptimizeCssAssetsWebpackPlugin = (mode) => {
    let plugin;
    if (mode === 'production') {
        plugin = new OptimizeCssAssetsWebpackPlugin({
            assetNameRegExp: /\.css$/,
            cssProcessor: cssnano,
            cssProcessorPluginOptions: {
                preset: ['default', { discardComments: { removeAll: true } }],
            },
        });
    }
    return plugin;
};
// only production
const genBundleAnalyzerPlugin = () => {
    return new webpackBundleAnalyzer.BundleAnalyzerPlugin({
        analyzerPort: 'auto',
    });
};
const genHtmlWebpackPlugin = (mode, externalConfig, template = './public/index.html', favicon = './public/favicon.ico') => {
    let options = {
        template: absolute(template),
        favicon: absolute(favicon),
        cdnConfig: externalConfig,
        inject: !externalConfig || externalConfig.length <= 0,
    };
    const prodOptions = {
        minify: {
            caseSensitive: false,
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            removeComments: true,
        },
    };
    if (mode === 'production')
        options = Object.assign(Object.assign({}, options), prodOptions);
    return new HtmlWebpackPlugin(options);
};

/* eslint-disable @typescript-eslint/camelcase */
const genTerserPlugin = () => new TerserPlugin({
    cache: true,
    parallel: true,
    extractComments: true,
    terserOptions: {
        compress: {
            unused: true,
            drop_debugger: true,
            drop_console: true,
            dead_code: true,
        },
    },
});

function genCommon(mode, options) {
    // option - analysis cdn css
    var _a, _b;
    const { analysis, css, cdn, eslintCompileCheck } = options;
    const loaderOption = css.loaderOption;
    // * 处理cdn
    let externals = {};
    let htmlCdns = [];
    if (cdn) {
        const cdnOption = genCdn(cdn.sources, cdn.origin, mode);
        externals = cdnOption.externals;
        htmlCdns = cdnOption.htmlCdns;
    }
    return {
        entry: {
            main: './src/main.js',
        },
        module: {
            rules: [
                genCssLoader(mode, css.module),
                ...genStaticsLoader(mode),
                genSassLoader(mode, (_a = loaderOption['scss']) === null || _a === void 0 ? void 0 : _a.prependData),
                genVueLoader(mode, eslintCompileCheck),
                genJsLoader(mode, eslintCompileCheck),
                genLessLoader(mode, (_b = loaderOption['less']) === null || _b === void 0 ? void 0 : _b.prependData),
            ],
        },
        plugins: [
            analysis ? genBundleAnalyzerPlugin() : null,
            genHtmlWebpackPlugin(mode, htmlCdns),
            genCleanWebpackPlugin(mode),
            genHotModuleReplacementPlugin(mode),
            genMiniCssExtractPlugin(mode),
            genOptimizeCssAssetsWebpackPlugin(mode),
            genVueLoaderPlugin(),
        ].filter(item => item),
        externals,
    };
}
function genDev(mode, options) {
    const common = genCommon(mode, options);
    return deepMerge(common, {
        output: {
            publicPath: '/',
            filename: 'assets/[name].js',
            path: absolute('./dist'),
        },
        mode,
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
    const common = genCommon(mode, options);
    return deepMerge(common, {
        output: {
            publicPath: '/',
            filename: 'assets/[name][chunkhash:8].js',
            path: absolute('./dist'),
        },
        mode,
        optimization: {
            minimize: true,
            minimizer: [genTerserPlugin()],
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
var genWebpackConfig = (mode, option) => {
    return mode === 'development' ? genDev(mode, option) : genProd(mode, option);
};

const defaultCliConfig = {
    cdn: false,
    configureWebpack: {},
    chainWebpack: (config) => { },
    devServer: {},
    css: {
        module: false,
        loaderOption: {
            scss: {
                prependData: [],
            },
            less: {
                prependData: [],
            },
        },
    },
    analysis: false,
    eslintCompileCheck: false,
};
var getCliConfig = (mode, options) => {
    function getConfig() {
        var _a;
        let { cliConfig } = options;
        try {
            cliConfig = cliConfig || require(`${process.cwd()}/sli.config.js`); // eslint-disable-line
        }
        catch (e) {
            cliConfig = defaultCliConfig;
        }
        const _b = deepMerge(defaultCliConfig, cliConfig), { configureWebpack, chainWebpack, devServer } = _b, args = __rest(_b, ["configureWebpack", "chainWebpack", "devServer"]);
        const chainConfig = new WebpackChain();
        chainWebpack(chainConfig);
        if (options.port)
            devServer.port = options.port;
        if (options.analysis)
            args.analysis = options.analysis;
        const config = deepMerge(genWebpackConfig(mode, args), configureWebpack, chainConfig.toConfig(), {
            devServer,
        });
        // 去除重复loader
        if ((_a = config === null || config === void 0 ? void 0 : config.module) === null || _a === void 0 ? void 0 : _a.rules) {
            config.module.rules = config.module.rules
                .reverse()
                .reduce((rules, rule) => {
                const isExist = rules.some(item => { var _a, _b; return ((_a = item === null || item === void 0 ? void 0 : item.test) === null || _a === void 0 ? void 0 : _a.toString()) === ((_b = rule === null || rule === void 0 ? void 0 : rule.test) === null || _b === void 0 ? void 0 : _b.toString()); });
                if (!isExist) {
                    rules.push(rule);
                }
                return rules;
            }, [])
                .reverse();
        }
        return config;
    }
    return getConfig();
};

var dev = (option) => {
    var _a, _b;
    let port = option.port;
    const { cliConfig } = option;
    const loading = ora();
    loading.start('app is starting...');
    // set environment
    process.env.NODE_ENV = 'development';
    const config = getCliConfig('development', { port, cliConfig });
    const compiler = Webpack__default(config);
    port = ((_a = config.devServer) === null || _a === void 0 ? void 0 : _a.port) || 8080;
    const host = ((_b = config.devServer) === null || _b === void 0 ? void 0 : _b.host) || 'localhost';
    compiler.hooks.done.tap('buildTip', () => {
        loading.succeed(`compile successfully!
      please open  http://${host}:${port}`);
    });
    compiler.hooks.failed.tap('buildTip', err => {
        loading.fail('compile failed');
        console.log(err);
    });
    new WebpackDevServer(compiler, config.devServer || {}).listen(port, host);
};

var build = (option) => {
    const { analysis, cliConfig } = option;
    const loading = ora();
    loading.start('app is building...');
    // set environment
    process.env.NODE_ENV = 'production';
    const config = getCliConfig('production', { analysis, cliConfig });
    const compiler = Webpack__default(config);
    compiler.run((err, stats) => {
        if (err) {
            loading.fail(`build failed:${err}`);
        }
        else if (stats.hasErrors()) {
            loading.fail(stats.compilation.errors.join('\n'));
        }
        else {
            loading.succeed('build successfully!');
            const result = stats.toJson();
            console.log([
                chalk.green(`Time: ${result.time}ms`),
                chalk.green(`output: ${result.outputPath}`),
                chalk.green(`webpack version: ${result.version}`),
            ].join('\n'));
        }
    });
};

function install() {
    const program = new commander.Command();
    program
        .command('dev')
        .description('run your app in development')
        .alias('d')
        .option('-p, --port <port>', 'Port used by the server (default: 8080)')
        .action(cmdObj => {
        dev({
            port: cmdObj.port,
        });
    });
    program
        .command('build')
        .description('build your app (production)')
        .alias('b')
        .option('-a, --analysis', 'show bundle information')
        .action(cmdObj => {
        build({
            analysis: cmdObj.analysis,
        });
    });
    program
        .version(require('./package.json').version, '-v --version')
        .parse(process.argv);
    // show help info when no params
    if (!process.argv.slice(2).length)
        program.outputHelp();
}
var index = {
    install,
    build,
    dev,
};

module.exports = index;
