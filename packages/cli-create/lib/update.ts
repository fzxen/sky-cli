import { existsSync, readFileSync, writeFileSync, copyFileSync } from 'fs';
import { resolve } from 'path';

export const updatePackage = (path: string, obj: object): Promise<void> => {
  return new Promise(resolve => {
    if (existsSync(path)) {
      const data = readFileSync(path).toString();
      const json = JSON.parse(data);

      const cliData = require('../../../package.json'); // eslint-disable-line

      Object.assign(json, obj);
      json.devDependencies[cliData.name] = cliData.version;

      writeFileSync(path, JSON.stringify(json, null, '\t'));
      resolve();
    }
  });
};

export const createCliConfig = async (path: string): Promise<void> =>
  copyFileSync(resolve(__dirname, '../../../frames/vue/cli.config.js'), path);
