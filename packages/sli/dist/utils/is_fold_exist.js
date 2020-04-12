"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var is_none_1 = __importDefault(require("./is_none"));
var isFoldExist = function (name) {
    return new Promise(function (resolve, reject) {
        if (is_none_1.default(name))
            reject(new Error('name must be provided'));
        if (fs_1.existsSync(name))
            reject(new Error(name + " has existed"));
        else
            resolve();
    });
};
exports.default = isFoldExist;
