/**
 ** CDN
 */

import { ExternalsElement } from 'webpack';
import absolute from './absolute';
import fs from 'fs';

import CdnConfiguration from '../../interface/cdn_configuration';

import HtmlCdns from '../../interface/html_cdns';
interface ModuleVersion {
  [prop: string]: string | undefined;
}
type Externals = ExternalsElement | ExternalsElement[];

// 获取所有依赖及其版本号
const getModulesVersion = (): ModuleVersion => {
  const mvs: ModuleVersion = {};
  const data = fs.readFileSync(absolute('./package.json')).toString();
  const json = JSON.parse(data);
  const dependencies = json.dependencies;

  for (const m in dependencies) {
    if (Object.prototype.hasOwnProperty.call(dependencies, m)) {
      mvs[m] = /\d+\.\d+\.\d+$/g.exec(dependencies[m])?.[0];
    }
  }

  return mvs;
};

// 处理externalConfig，并返回externals
export default (
  config: CdnConfiguration,
  orign: string,
  mode: 'development' | 'production'
): {
  externals: Externals;
  htmlCdns: HtmlCdns;
} => {
  const externals: Externals = {}; // 结果
  const dependencieModules = getModulesVersion(); // 获取全部的模块和版本号
  const htmlCdns = config.map(item => {
    if (item.name in dependencieModules) {
      const version = dependencieModules[item.name];
      // 拼接css 和 js 完整链接
      externals[item.name] = item.scope;
      return {
        css:
          item.css &&
          [orign, item.alias || item.name, version, item.css[mode]].join('/'),
        js:
          item.js &&
          [orign, item.alias || item.name, version, item.js[mode]].join('/'),
      };
    } else {
      throw new Error('相关依赖未安装，请先执行npm install ' + item.name);
    }
  });
  return { externals, htmlCdns };
};
