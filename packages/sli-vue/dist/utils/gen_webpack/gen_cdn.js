"use strict";
/**
 ** CDN
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var absolute_1 = __importDefault(require("./absolute"));
var fs_1 = __importDefault(require("fs"));
// 获取所有依赖及其版本号
var getModulesVersion = function () {
    var _a;
    var mvs = {};
    var data = fs_1.default.readFileSync(absolute_1.default('./package.json')).toString();
    var json = JSON.parse(data);
    var dependencies = json.dependencies;
    for (var m in dependencies) {
        if (Object.prototype.hasOwnProperty.call(dependencies, m)) {
            mvs[m] = (_a = /\d+\.\d+\.\d+$/g.exec(dependencies[m])) === null || _a === void 0 ? void 0 : _a[0];
        }
    }
    return mvs;
};
// 处理externalConfig，并返回externals
exports.default = (function (config, orign, mode) {
    var externals = {}; // 结果
    var dependencieModules = getModulesVersion(); // 获取全部的模块和版本号
    var htmlCdns = config.map(function (item) {
        if (item.name in dependencieModules) {
            var version = dependencieModules[item.name];
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
    return { externals: externals, htmlCdns: htmlCdns };
});
