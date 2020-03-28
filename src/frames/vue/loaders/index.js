// const { absolute } = require('../utils')
const eslintFriendlyFormatter = require('eslint-formatter-friendly')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const mode = process.env.NODE_ENV
/**
 ** loader
 */
const eslintLoader = {
  loader: require.resolve('eslint-loader'),
  options: {
    fix: true,
    // 这里的配置项参数将会被传递到 eslint 的 CLIEngine
    formatter: eslintFriendlyFormatter, // 指定错误报告的格式规范
  },
}

exports.JsLoader = () => {
  const options = {
    test: /\.(js)$/,
    use: [
      require.resolve('thread-loader'),
      {
        loader: require.resolve('babel-loader'),
        options: { cacheDirectory: true, sourceType: 'unambiguous' },
      },
    ], // 开启babel-loader的缓存
    include: [/src/],
  }

  const devOptions = [eslintLoader]

  // 开发环境启用eslint-loader
  if (mode === 'development') options.use.push(...devOptions)

  return options
}

exports.VueLoader = () => {
  const options = {
    test: /\.vue$/,
    use: [require.resolve('thread-loader'), require.resolve('vue-loader')],
    include: [/src/],
  }

  const devOptions = [eslintLoader]

  // 开发环境启用eslint-loader
  if (mode === 'development') options.use.push(...devOptions)

  return options
}

exports.CssLoader = () => ({
  test: /\.css$/,
  oneOf: [
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
    },
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
})

exports.LessLoader = () => ({
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
})

exports.SassLoader = () => ({
  test: /\.s(a|c)ss$/,
  use: [
    mode === 'production'
      ? MiniCssExtractPlugin.loader
      : require.resolve('vue-style-loader'),
    require.resolve('css-loader'),
    require.resolve('postcss-loader'),
    require.resolve('sass-loader'),
    // {
    //   loader: 'sass-resources-loader',
    //   options: {
    //     resources: [
    //       absolute(`../src/assets/style/color.scss`),
    //       absolute(`../src/assets/style/mixins.scss`),
    //     ],
    //   },
    // },
  ],
})

exports.StaticsLoader = () => {
  const name =
    mode === 'production' ? '[name][contenthash:8].[ext]' : '[name].[ext]'

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
  }

  // 字体资源解析器
  const fontResolver = {
    test: /\.(woff2|woff|eot|ttf|otf)$/i,
    loader: require.resolve('url-loader'),
    options: {
      name: `assets/fonts/${name}`,
    },
  }

  // 视频&音频资源解析器
  const mediaResolver = {
    test: /\.(mp4|avi|mp3)$/i,
    loader: require.resolve('url-loader'),
    options: {
      name: `assets/media/${name}`,
    },
  }

  return [imgResolver, fontResolver, mediaResolver]
}
