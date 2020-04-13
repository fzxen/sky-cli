/* eslint-disable @typescript-eslint/camelcase */
import TerserPlugin from 'terser-webpack-plugin';

const genTerserPlugin = (): TerserPlugin =>
  new TerserPlugin({
    cache: true, // 使用 cache，加快二次构建速度
    parallel: true, // 开启多线程
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

export default genTerserPlugin;
