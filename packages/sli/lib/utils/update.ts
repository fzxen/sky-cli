import {
  existsSync,
  readFileSync,
  writeFileSync,
  copyFileSync,
  copyFile,
} from 'fs';
import { resolve } from 'path';

import QueryOptions from '../interface/create_query_options';
import depVersions from '../enums/dependencies';

// 更新 vue 相关
const updateVue = (options: QueryOptions, json: any) => {
  // eslint-vue
  const { name, eslint } = options;

  if (eslint) {
    json.scripts.lint = 'eslint --ext .js,.vue src';
    json.scripts.fix = 'eslint --fix --ext .js,.vue src';

    json.devDependencies['eslint'] = depVersions['eslint'];
    json.devDependencies['eslint-config-prettier'] =
      depVersions['eslint-config-prettier'];
    json.devDependencies['eslint-plugin-prettier'] =
      depVersions['eslint-plugin-prettier'];
    json.devDependencies['eslint-plugin-vue'] =
      depVersions['eslint-plugin-vue'];
    json.devDependencies['prettier'] = depVersions['prettier'];
    json.devDependencies['standard'] = depVersions['standard'];
    json.devDependencies['babel-eslint'] = depVersions['babel-eslint'];
    copyFile(
      resolve(__dirname, '../sources/vue/.eslintrc.js'),
      `${name}/.eslintrc.js`,
      () => {}
    );
    copyFile(
      resolve(__dirname, '../sources/vue/.eslintignore'),
      `${name}/.eslintignore`,
      () => {}
    );
  }

  // 修改 sli-vue版本
  json.devDependencies['@poloris/sli-vue'] = depVersions['@poloris/sli-vue'];

  return json;
};

// 设置git hook
const setHook = (options: QueryOptions, json: any) => {
  const { name, codeLint, commitLint, eslint } = options;
  // git hook
  if (commitLint || (eslint && codeLint))
    json.devDependencies.husky = depVersions['husky'];
  if (commitLint) {
    json.husky = {
      hooks: {
        'commit-msg':
          "echo 'commit checking.... && commitlint -E HUSKY_GIT_PARAMS",
      },
    };
    json.devDependencies['@commitlint/cli'] = depVersions['@commitlint/cli'];
    json.devDependencies['@commitlint/config-conventional'] =
      depVersions['@commitlint/config-conventional'];
    createCommitlintrc(`${name}/.commitlintrc.js`);
  }
  if (eslint && codeLint) {
    if (json?.husky?.hooks)
      json.husky.hooks['pre-commit'] =
        "echo 'code checking....' && lint-staged";
    else
      json.husky = {
        hooks: { 'pre-commit': "echo 'code checking....' && lint-staged" },
      };

    json['lint-staged'] = {
      '*.{js,vue}': ['eslint --fix', 'git add'],
    };
    json.devDependencies['lint-staged'] = depVersions['lint-staged'];
  }

  return json;
};

export const updatePackage = (
  path: string,
  options: QueryOptions
): Promise<void> => {
  return new Promise(resolve => {
    if (existsSync(path)) {
      const data = readFileSync(path).toString();
      let json = JSON.parse(data);

      // 更新基础字段
      const { name, description, author, frame } = options;
      Object.assign(json, { name, description, author });

      json = setHook(options, json);
      if (frame === 'vue') json = updateVue(options, json);
      // TODO fan 更新 cli-vue cli-react cli-electron依赖的版本

      writeFileSync(path, JSON.stringify(json, null, '\t'));
      resolve();
    }
  });
};

export const createCliConfig = async (path: string): Promise<void> =>
  copyFileSync(resolve(__dirname, '../sources/sli.config.js'), path);

export const createCommitlintrc = (path: string): void =>
  copyFile(resolve(__dirname, '../sources/.commitlintrc.js'), path, () => {});
