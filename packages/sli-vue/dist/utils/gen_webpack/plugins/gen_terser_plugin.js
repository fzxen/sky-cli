"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/camelcase */
var terser_webpack_plugin_1 = __importDefault(require("terser-webpack-plugin"));
var genTerserPlugin = function () {
    return new terser_webpack_plugin_1.default({
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
};
exports.default = genTerserPlugin;
