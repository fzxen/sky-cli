const path = require('path');
const absolute = relative => path.resolve(process.cwd(), `${relative}`);

// 自动生成
module.exports = {
  /**
   * * property: cdn
   * * type: false | object
   * * cdn 设置
   */
  // cdn: {
  //   origin: 'https://cdn.bootcss.com', // cdn源
  //   sources: [
  //     {
  //       name: 'vue',
  //       scope: 'Vue',
  //       js: { development: 'vue.js', production: 'vue.min.js' },
  //     },
  //     {
  //       name: 'vue-router',
  //       scope: 'VueRouter',
  //       js: { development: 'vue-router.js', production: 'vue-router.min.js' },
  //     },
  //     {
  //       name: 'vuex',
  //       scope: 'Vuex',
  //       js: { development: 'vuex.js', production: 'vuex.min.js' },
  //     },
  //     {
  //       name: 'axios',
  //       scope: 'axios',
  //       js: { development: 'axios.js', production: 'axios.min.js' },
  //     },
  //     // {
  //     //   name: 'iview',
  //     //   scope: 'iview',
  //     //   js: { development: 'iview.js', production: 'iview.min.js' },
  //     //   css: {
  //     //     development: 'styles/iview.css',
  //     //     production: 'styles/iview.css',
  //     //   },
  //     // },
  //     {
  //       name: 'lodash',
  //       alias: 'lodash.js',
  //       scope: '_',
  //       js: { development: 'lodash.js', production: 'lodash.min.js' },
  //     },
  //     // {
  //     //   name: 'xlsx',
  //     //   scope: 'XLSX',
  //     //   js: { development: 'xlsx.full.min.js', production: 'xlsx.full.min.js' },
  //     // },
  //     {
  //       name: 'blueimp-md5',
  //       scope: 'md5',
  //       js: { development: 'js/md5.js', production: 'js/md5.min.js' },
  //     },
  //     {
  //       name: 'echarts',
  //       scope: 'echarts',
  //       js: { development: 'echarts.js', production: 'echarts.min.js' },
  //     },
  //   ],
  // },
  cdn: false,
  /**
   * * property: configureWebpack
   * * type: object | function
   * * 这会直接merge到最终webpack配置
   */
  configureWebpack: {
    resolve: {
      extensions: ['.js', '.vue', '.scss'],
      alias: {
        '@': absolute(`./src`),
        _api: absolute(`./src/api`),
        _images: absolute(`./src/assets/images`),
        _style: absolute(`./src/assets/style`),
        _components: absolute(`./src/components`),
        _config: absolute(`./src/config`),
        _directives: absolute(`./src/directives`),
        _enums: absolute(`./src/enums`),
        _filters: absolute(`./src/filters`),
        _library: absolute(`./src/library`),
        _mixins: absolute(`./src/mixins`),
        _mock: absolute(`./src/mock`),
        _plugins: absolute(`./src/plugins`),
        _router: absolute(`./src/router`),
        _store: absolute(`./src/store`),
        _utils: absolute(`./src/utils`),
        _views: absolute(`./src/views`),
      },
    },
  }, // 这会直接merge到最终webpack配置
  /**
   * * property: chainWebpack
   * * type: function
   * * 是一个函数，会接收一个基于 webpack-chain 的 ChainableConfig 实例。允许对内部的 webpack 配置进行更细粒度的修改。
   * * 优先级高于configureWebpack
   * * 参考资料1： https://cli.vuejs.org/zh/guide/webpack.html#%E9%93%BE%E5%BC%8F%E6%93%8D%E4%BD%9C-%E9%AB%98%E7%BA%A7
   * * 参考资料2： https://github.com/Yatoo2018/webpack-chain/tree/zh-cmn-Hans
   */
  chainWebpack: config => {},
  /**
   * * property: devServer
   * * type: object
   * * 会传递给webpack-dev-server
   * * 优先级高于configureWebpack和chainWebpack
   */
  devServer: {
    host: '',
    port: 8080,
  },

  /**
   * * property: css
   * * type: object
   * * 与css相关的配置
   */
  css: {
    module: false, // 是否开启css-module
    loaderOption: {
      scss: {
        prependData: [
          absolute('./src/assets/style/color.scss'),
          absolute('./src/assets/style/mixins.scss'),
        ],
      },
      less: {
        prependData: [],
      },
    },
  },

  /**
   * * property: analysis
   * * type: boolean
   * * 若为true， 打包时会启用BundleAnalyzerPlugin
   */
  analysis: false,

  /**
   * * property: eslintCompileCheck
   * * type: boolean
   * * 是否开启eslint编译时检查（项目需要安装eslint）
   */
  eslintCompileCheck: true,
};
