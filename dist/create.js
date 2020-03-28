"use strict";require("core-js/modules/es.symbol"),require("core-js/modules/es.array.filter"),require("core-js/modules/es.array.for-each"),require("core-js/modules/es.function.name"),require("core-js/modules/es.object.define-properties"),require("core-js/modules/es.object.define-property"),require("core-js/modules/es.object.get-own-property-descriptor"),require("core-js/modules/es.object.get-own-property-descriptors"),require("core-js/modules/es.object.keys"),require("core-js/modules/es.object.to-string"),require("core-js/modules/es.promise"),require("core-js/modules/web.dom-collections.for-each"),Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0,require("regenerator-runtime/runtime");var _logSymbols=_interopRequireDefault(require("log-symbols")),_chalk=_interopRequireDefault(require("chalk")),_ora=_interopRequireDefault(require("ora")),_inquirer=_interopRequireDefault(require("inquirer")),_downloadGitRepo=_interopRequireDefault(require("download-git-repo")),_util=require("./util.js");function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function ownKeys(r,e){var o=Object.keys(r);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(r);e&&(t=t.filter(function(e){return Object.getOwnPropertyDescriptor(r,e).enumerable})),o.push.apply(o,t)}return o}function _objectSpread(r){for(var e=1;e<arguments.length;e++){var o=null!=arguments[e]?arguments[e]:{};e%2?ownKeys(Object(o),!0).forEach(function(e){_defineProperty(r,e,o[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(r,Object.getOwnPropertyDescriptors(o)):ownKeys(Object(o)).forEach(function(e){Object.defineProperty(r,e,Object.getOwnPropertyDescriptor(o,e))})}return r}function _defineProperty(e,r,o){return r in e?Object.defineProperty(e,r,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[r]=o,e}function asyncGeneratorStep(e,r,o,t,n,u,i){try{var a=e[u](i),c=a.value}catch(e){return void o(e)}a.done?r(c):Promise.resolve(c).then(t,n)}function _asyncToGenerator(a){return function(){var e=this,i=arguments;return new Promise(function(r,o){var t=a.apply(e,i);function n(e){asyncGeneratorStep(t,r,o,n,u,"next",e)}function u(e){asyncGeneratorStep(t,r,o,n,u,"throw",e)}n(void 0)})}}function download(r){var e=r.name,o=r.frame,t=(0,_ora.default)();t.start("downloading...");var n=_util.gitSources[o];(0,_downloadGitRepo.default)(n.url,e,{clone:!0},function(e){e?t.fail("download failed"):(t.succeed("download successfully"),updatePackage(r).then(function(){return console.log(_logSymbols.default.success,_chalk.default.green("package has updated completely"))}))})}function updatePackage(e){var r=e.name;return(0,_util.updateJsonFile)("".concat(r,"/package.json"),e)}var _default=function(){var r=_asyncToGenerator(regeneratorRuntime.mark(function e(r){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if((0,_util.isNone)(r))return console.log(_logSymbols.default.error,_chalk.default.red("please input your projectName")),e.abrupt("return",void 0);e.next=3;break;case 3:(0,_util.isFoldExist)(r).then(function(){_inquirer.default.prompt((0,_util.getCreateQuestions)({name:r})).then(function(e){download(_objectSpread({name:r},e))}).catch(function(e){console.log(e)})}).catch(function(e){console.log(_logSymbols.default.error,_chalk.default.red(e.message))});case 4:case"end":return e.stop()}},e)}));return function(e){return r.apply(this,arguments)}}();exports.default=_default;