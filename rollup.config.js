const rollup = require('rollup');
const ts = require('rollup-plugin-typescript2');
const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');
const { terser } = require('rollup-plugin-terser');
const path = require('path');

const absolute = relative => path.resolve(__dirname, relative);

const project = process.argv[2];
const pathMap = {
  sli: './packages/sli',
  'sli-vue': './packages/sli-vue',
  'sli-react': './packages/sli-react',
  'sli-electron': './packages/sli-electron',
};

const root = pathMap[project];

// see below for details on the options
const inputOptions = {
  input: absolute(`${root}/lib/index.ts`),
  external: ['ms'],
  plugins: [ts(), commonjs(), json()],
};
const outputOptions = {
  file: absolute(`${root}/index.js`),
  format: 'cjs',
};

async function build() {
  // create a bundle
  const bundle = await rollup.rollup(inputOptions);

  // generate code and a sourcemap
  const { code, map } = await bundle.generate(outputOptions);

  // or write the bundle to disk
  await bundle.write(outputOptions);
}

async function watch() {
  const watcher = rollup.watch({
    ...inputOptions,
    output: [{ ...outputOptions }],
  });

  // event.code 会是下面其中一个：
  //   START        — 监听器正在启动（重启）
  //   BUNDLE_START — 构建单个文件束
  //   BUNDLE_END   — 完成文件束构建
  //   END          — 完成所有文件束构建
  //   ERROR        — 构建时遇到错误
  //   FATAL        — 遇到无可修复的错误
  watcher.on('START', () => {
    console.log('starting build...');
  });
  watcher.on('END', () => {
    console.log('compile successfully...');
  });
  watcher.on('ERROR', () => {
    console.log('compile error...');
    watcher.close();
  });
}

const isWatch = process.argv[3] === 'watch';
isWatch ? watch() : build();
