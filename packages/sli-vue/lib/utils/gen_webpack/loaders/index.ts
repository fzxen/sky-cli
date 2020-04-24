// const { absolute } = require('../utils')

// import eslintFriendlyFormatter from 'eslint-formatter-friendly';
import { RuleSetRule, RuleSetUseItem } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const isMultiCpu = require('os').cpus().length > 1;

type modeType = 'development' | 'production';
/**
 ** loader
 */
const eslintLoader: RuleSetUseItem = {
  loader: require.resolve('eslint-loader'),
  options: {
    fix: true,
    // 这里的配置项参数将会被传递到 eslint 的 CLIEngine
    // formatter: eslintFriendlyFormatter, // 指定错误报告的格式规范
  },
};

export const genJsLoader = (
  mode: modeType,
  eslintCompileCheck: boolean | undefined
): RuleSetRule => {
  const options: RuleSetRule & { use: Array<RuleSetUseItem> } = {
    test: /\.(js)$/,
    use: [
      isMultiCpu ? require.resolve('thread-loader') : '',
      {
        loader: require.resolve('babel-loader'),
        options: { cacheDirectory: true, sourceType: 'unambiguous' },
      },
    ].filter(item => item), // 开启babel-loader的缓存
    include: [/src/],
  };

  const devOptions = [eslintLoader];

  // 启用eslint-loader
  const isCheck = eslintCompileCheck !== false;
  if (mode === 'development' && isCheck) options.use.push(...devOptions);

  return options;
};

export const genVueLoader = (
  mode: modeType,
  eslintCompileCheck: boolean | undefined
): RuleSetRule => {
  const options: RuleSetRule & { use: Array<RuleSetUseItem> } = {
    test: /\.vue$/,
    use: [
      isMultiCpu ? require.resolve('thread-loader') : '',
      require.resolve('vue-loader'),
    ].filter(item => item),
    include: [/src/],
  };

  const devOptions = [eslintLoader];

  // 开发环境启用eslint-loader
  const isCheck = eslintCompileCheck !== false;
  if (mode === 'development' && isCheck) options.use.push(...devOptions);

  return options;
};

export const genCssLoader = (mode: modeType, module: boolean): RuleSetRule => {
  const result: RuleSetRule & { oneOf: RuleSetRule[] } = {
    test: /\.css$/,
    oneOf: [
      // 这里匹配普通的 `<style>` 或 `<style scoped>`
      {
        use: [
          mode === 'production'
            ? MiniCssExtractPlugin.loader
            : require.resolve('vue-style-loader'),
          require.resolve('css-loader'),
          require.resolve('postcss-loader'),
        ],
      },
    ],
  };

  //  开启css-module
  if (module) {
    result.oneOf.unshift(
      // 这里匹配 `<style module>`
      {
        resourceQuery: /module/,
        use: [
          mode === 'production'
            ? MiniCssExtractPlugin.loader
            : require.resolve('vue-style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              modules: true,
              // localIdentName: '[name]_[local]_[hash:base64:5]'
            },
          },
          require.resolve('postcss-loader'),
        ],
      }
    );
  }
  return result;
};

export const genLessLoader = (
  mode: modeType,
  prependData: Array<string> | undefined
): RuleSetRule => {
  const result: RuleSetRule & { use: RuleSetUseItem[] } = {
    test: /\.less$/,
    use: [
      mode === 'production'
        ? MiniCssExtractPlugin.loader
        : require.resolve('vue-style-loader'),
      require.resolve('css-loader'),
      require.resolve('postcss-loader'),
      {
        loader: require.resolve('less-loader'),
        options: {
          javascriptEnabled: true,
        },
      },
    ],
  };

  if (prependData && prependData.length > 0) {
    result.use.push({
      loader: require.resolve('sass-resources-loader'),
      options: {
        resources: prependData,
      },
    });
  }

  return result;
};

export const genSassLoader = (
  mode: modeType,
  prependData: Array<string> | undefined
): RuleSetRule => {
  const result: RuleSetRule & { use: RuleSetUseItem[] } = {
    test: /\.s(a|c)ss$/,
    use: [
      mode === 'production'
        ? MiniCssExtractPlugin.loader
        : require.resolve('vue-style-loader'),
      require.resolve('css-loader'),
      require.resolve('postcss-loader'),
      require.resolve('sass-loader'),
    ],
  };

  if (prependData && prependData.length > 0) {
    result.use.push({
      loader: require.resolve('sass-resources-loader'),
      options: {
        resources: prependData,
      },
    });
  }

  return result;
};

export const genStaticsLoader = (mode: modeType): RuleSetRule[] => {
  const name =
    mode === 'production' ? '[name][contenthash:8].[ext]' : '[name].[ext]';

  // 图片资源解析器
  const imgResolver = {
    test: /\.(jpg|png|gif|jpeg|svg)$/i,
    use: [
      {
        loader: require.resolve('url-loader'),
        options: {
          limit: 3 * 1024, // 3K
          name: `assets/images/${name}`,
        },
      },
      // 'image-webpack-loader',
    ],
  };

  // 字体资源解析器
  const fontResolver = {
    test: /\.(woff2|woff|eot|ttf|otf)$/i,
    loader: require.resolve('url-loader'),
    options: {
      name: `assets/fonts/${name}`,
    },
  };

  // 视频&音频资源解析器
  const mediaResolver = {
    test: /\.(mp4|avi|mp3|rmvb|wmv|flv)$/i,
    loader: require.resolve('url-loader'),
    options: {
      name: `assets/media/${name}`,
    },
  };

  const fileResolver = {
    test: /\.(pdf|doc|docx|ppt|xls|xlsx)$/i,
    loader: require.resolve('url-loader'),
    options: {
      name: `assets/files/${name}`,
    },
  };

  return [imgResolver, fontResolver, mediaResolver, fileResolver];
};
