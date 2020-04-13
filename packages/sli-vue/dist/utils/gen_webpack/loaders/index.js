"use strict";
// const { absolute } = require('../utils')
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
var isMultiCpu = require('os').cpus().length > 1;
/**
 ** loader
 */
var eslintLoader = {
    loader: require.resolve('eslint-loader'),
    options: {
        fix: true,
    },
};
exports.genJsLoader = function (mode) {
    var _a;
    var options = {
        test: /\.(js)$/,
        use: [
            isMultiCpu ? require.resolve('thread-loader') : '',
            {
                loader: require.resolve('babel-loader'),
                options: { cacheDirectory: true, sourceType: 'unambiguous' },
            },
        ].filter(function (item) { return item; }),
        include: [/src/],
    };
    var devOptions = [eslintLoader];
    // 开发环境启用eslint-loader
    if (mode === 'development')
        (_a = options.use).push.apply(_a, devOptions);
    return options;
};
exports.genVueLoader = function (mode) {
    var _a;
    var options = {
        test: /\.vue$/,
        use: [
            isMultiCpu ? require.resolve('thread-loader') : '',
            require.resolve('vue-loader'),
        ].filter(function (item) { return item; }),
        include: [/src/],
    };
    var devOptions = [eslintLoader];
    // 开发环境启用eslint-loader
    if (mode === 'development')
        (_a = options.use).push.apply(_a, devOptions);
    return options;
};
exports.genCssLoader = function (mode, module) {
    var result = {
        test: /\.css$/,
        oneOf: [
            // 这里匹配普通的 `<style>` 或 `<style scoped>`
            {
                use: [
                    mode === 'production'
                        ? mini_css_extract_plugin_1.default.loader
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
                    ? mini_css_extract_plugin_1.default.loader
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
exports.genLessLoader = function (mode, prependData) {
    var result = {
        test: /\.less$/,
        use: [
            mode === 'production'
                ? mini_css_extract_plugin_1.default.loader
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
exports.genSassLoader = function (mode, prependData) {
    var result = {
        test: /\.s(a|c)ss$/,
        use: [
            mode === 'production'
                ? mini_css_extract_plugin_1.default.loader
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
exports.genStaticsLoader = function (mode) {
    var name = mode === 'production' ? '[name][contenthash:8].[ext]' : '[name].[ext]';
    // 图片资源解析器
    var imgResolver = {
        test: /\.(jpg|png|gif|jpeg|svg)$/i,
        use: [
            {
                loader: require.resolve('url-loader'),
                options: {
                    limit: 3 * 1024,
                    name: "assets/images/" + name,
                },
            },
        ],
    };
    // 字体资源解析器
    var fontResolver = {
        test: /\.(woff2|woff|eot|ttf|otf)$/i,
        loader: require.resolve('url-loader'),
        options: {
            name: "assets/fonts/" + name,
        },
    };
    // 视频&音频资源解析器
    var mediaResolver = {
        test: /\.(mp4|avi|mp3)$/i,
        loader: require.resolve('url-loader'),
        options: {
            name: "assets/media/" + name,
        },
    };
    return [imgResolver, fontResolver, mediaResolver];
};
