# sli-vue

## description

vue项目启动工具

## how to use

#### 使用命令行

`sli-vue dev [-p 端口号]` 启动项目
`sli-vue build [-a]` 打包项目


#### 编程式API

```javascript
const {dev, build} = require('@redcoast/sli-vue')

dev({port: 8080}) // 启动项目
build({analysis: false}) // 打包项目
```
