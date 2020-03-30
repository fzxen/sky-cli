# sky-cli

build for everything

status: Pre-Alpha

已实现功能闭环，暂时只支持 vue 项目。

## 命令

- `sli create|c <projectName>` 创建项目
- `sli init|i` 初始化项目
- `sli dev|d` 本地启动项目
  - `sli dev -p <port>` 指定端口
- `sli build|b` 打包项目
  - `sli build -a` 启用 bundle 分析器

## cli.config.js

使用 sky-cli 创建的项目的根目录会有一个`cli.config.js`配置文件，通过这个文件来修改 webpack 配置

```javascript
{
  /**
   * * property: cdn
   * * type: false | object
   * * cdn 设置
   */
  cdn: {
    origin: 'https://cdn.bootcss.com', // cdn源
    sources: [],
  },
  /**
   * * property: configureWebpack
   * * type: object | function
   * * 这会直接merge到最终webpack配置
   */
  configureWebpack: {
    resolve: {
      extensions: ['.js', '.vue', '.scss'],
      alias: {
        '@': absolute('./src'),
        _api: absolute('./src/api'),
        _images: absolute('./src/assets/images'),
        _style: absolute('./src/assets/style'),
        _components: absolute('./src/components'),
        _config: absolute('./src/config'),
        _directives: absolute('./src/directives'),
        _enums: absolute('./src/enums'),
        _filters: absolute('./src/filters'),
        _library: absolute('./src/library'),
        _mixins: absolute('./src/mixins'),
        _mock: absolute('./src/mock'),
        _router: absolute('./src/router'),
        _store: absolute('./src/store'),
        _views: absolute('./src/views'),
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
   * * 若为tru， 打包时会启用BundleAnalyzerPlugin
   */
  analysis: false,
}
```

> 所有命令的优先级都大于配置文件

## TODO

### 1.x

- [ ] 粒度更细的文件配置
- [ ] 项目结构优化
- [ ] TS 重构
- [ ] 通过 WebpackPlugin 支持 CDN

### 2.x

- [ ] react 支持
- [ ] electron 支持
