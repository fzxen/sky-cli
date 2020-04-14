import { existsSync, readFileSync, writeFileSync, copyFileSync } from 'fs';
import { resolve } from 'path';

export const updatePackage = (path: string, obj: object): Promise<void> => {
  return new Promise(resolve => {
    if (existsSync(path)) {
      const data = readFileSync(path).toString();
      const json = JSON.parse(data);

      Object.assign(json, obj);
      // TODO fan 更新 cli-vue cli-react cli-electron依赖的版本

      writeFileSync(path, JSON.stringify(json, null, '\t'));
      resolve();
    }
  });
};

export const createCliConfig = async (path: string): Promise<void> =>
  copyFileSync(resolve(__dirname, '../../sources/sli.config.js'), path);
