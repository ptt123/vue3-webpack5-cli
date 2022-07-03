# Webpack5 从 0 到 1 搭建 Vue 3.x 开发环境

[webpack 中文文档](https://webpack.docschina.org/)

## 1 配置 Webpack 环境

### 1.1 初始化项目

```bash
mkdir private-vue3-cli && cd private-vue3-cli
npm init
yarn add webpack webpack-cli -D/npm i -D webpack webpack-cli
```

添加/src/main.js 文件  
编辑/package.json

```json
...
"scripts": {
    "build": "webpack src/main.js"
}
...
```

执行

```bash
npm run build
```

此时如果生成了一个 dist 文件夹，并且内部含有 main.js 说明已经打包成功了

### 1.2 开始我们自己的配置

添加/build/webpack.config.js 文件

```js
// webpack.config.js
const path = require('path')

module.exports = {
  mode: 'development', // 环境模式
  entry: path.resolve(__dirname, '../src/main.js'), // 打包入口
  output: {
    path: path.resolve(__dirname, '../dist'), // 打包出口
    filename: 'js/[name].[hash:8].js', // 打包完的静态资源文件名
  },
}
```

编辑/package.json

```json
...
"scripts": {
    "build": "webpack --config build/webpack.config.js"
}
...
```

执行

```bash
npm run build
```

### 1.3 配置 html 模板

添加/public/index.html
安装 html-webpack-plugin 插件，自动将打包后的文件引入到 index.html 中

```bash
npm i -D html-webpack-plugin
```

编辑/build/webpack.config.js

```js
// webpack.config.js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development', // 环境模式
  entry: path.resolve(__dirname, '../src/main.js'), // 打包入口
  output: {
    path: path.resolve(__dirname, '../dist'), // 打包出口
    filename: 'js/[name].[hash:8].js', // 打包完的静态资源文件名
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'), // 我们要使用的 html 模板地址
      filename: 'index.html', // 打包后输出的文件名
      title: '从0到1手搭Vue开发环境', // index.html 模板内，通过 <%= htmlWebpackPlugin.options.title %> 拿到的变量
    }),
  ],
}
```

编辑/public/index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
    <title><%= htmlWebpackPlugin.options.title %></title>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

执行

```bash
npm run build
```

### 1.3.1 多入口文件如何开发

生成多个 html-webpack-plugin 实例来解决这个问题，这里就不贴代码了

### 1.3.2 clean-webpack-plugin

执行打包命令时，先清空 dist 文件夹  
安装插件

```bash
npm i -D clean-webpack-plugin
```

编辑/build/webpack.config.js

```js
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
module.exports = {
  ...
  plugins:[new CleanWebpackPlugin()]
}
```

## 2 搭建 vue3.x 开发环境

### 2.1 解析.vue 文件

安装 vue 默认为 vue3.x

```bash
npm i -S vue
```

添加/src/App.vue 文件

```html
<template>
  <div>拥抱vue3.x</div>
</template>
<script>
  export default {}
</script>
<style></style>
```

编辑/src/main.js 文件

```js
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App) // 初始化app
app.mount('#app') // 将app挂载到app节点上
```

执行

```bash
npm run build
```

打包报错了  
ERROR in ./src/App.vue 1:0
Module parse failed: Unexpected token (1:0)
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
<template>

  <div>拥抱vue3.x</div>
</template>
@ ./src/main.js 2:0-27 4:22-25

意思大概是说需要 loader 来处理.vue 文件。浏览器环境不能识别.vue 文件，我们需要把.vue 文件转变成浏览器能解析的 js，接下来我们需要添加下面的插件：

- vue-loader：它是基于 webpack  的一个的 loader  插件，解析和转换 .vue  文件，提取出其中的逻辑代码 script、样式代码 style、以及 HTML  模版 template，再分别把它们交给对应的 loader  去处理如 style-loader 、 less-loader  等等，核心的作用，就是提取。
- @vue/compiler-sfc：Vue 2.x 时代，需要 vue-template-compiler 插件处理 .vue 内容为 ast；Vue 3.x 则变成 @vue/compiler-sfc。

> 安装的时候注意 vue-loader 需要通过 npm i -D vue-loader@next 安装最新版本

安装插件

```bash
npm i -D vue-loader@next
```

编辑/build/webpack.config.js

```js
const { VueLoaderPlugin } = require('vue-loader/dist/index')
module.exports = {
  ...
  plugins:[
    ...
    new VueLoaderPlugin()
  ],
  module:{
    rules:[
      {
        test: /\.vue$/,
        use: [
          'vue-loader'
        ]
      }
    ]
  }
  ...
}
```

VueLoaderPlugin 插件就是将 module.rules 复制并应用到.vue 文件里相应语言的块。例如，如果你有一条匹配 /\.js$/ 的规则，那么它会应用到 .vue 文件里的 script 块

执行

```bash
npm run build
```

这次我们打包成功了

接下来我们在 App.vue 中加入 style 内容，编辑/src/App.vue

```html
<template>
  <div class="app-wrapper">拥抱vue3.x</div>
</template>
<script>
  export default {}
</script>
<style scoped>
  .app-wrapper {
    color: red;
  }
</style>
```

再次打包

```bash
npm run build
```

打包又报错了
ERROR in ./src/App.vue?vue&type=style&index=0&id=7ba5bd90&scoped=true&lang=css (./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[2].use[0]!./src/App.vue?vue&type=style&index=0&id=7ba5bd90&scoped=true&lang=css) 2:0
Module parse failed: Unexpected token (2:0)
File was processed with these loaders:
./node_modules/vue-loader/dist/index.js
You may need an additional loader to handle the result of these loaders.
.app-wrapper {
color: red;
}
@ ./src/App.vue?vue&type=style&index=0&id=7ba5bd90&scoped=true&lang=css 1:0-163 1:0-163 1:164-316 1:164-316
@ ./src/App.vue 5:0-74
@ ./src/main.js 2:0-27 4:22-25

大概意思就是需要 loader 来处理 css,接下来我们需要添加下面的插件：

- style-loader：将 css 样式插入到页面的 style 标签中。
- css-loader

```bash
npm i -D style-loader css-loader
```

编辑/build/webpack.config.js

```js
// webpack.config.js
...
module.exports = {
 ...
 module:{
   rules:[
     {
       test: /\.vue$/,
       use: [
         'vue-loader'
       ]
     },
     {
       test: /\.css$/,
       use: ['style-loader', 'css-loader']
     }
   ]
 }
}
```

再次执行

```bash
npm run build
```

这次我们终于打包成功了

但是我们想要用 less 来构建样式,我们编辑/src/App.vue

```html
...
<style scoped lang="less">
  .app-wrapper {
    color: red;
  }
</style>
```

再次打包 npm run build

ERROR in ./src/App.vue?vue&type=style&index=0&id=7ba5bd90&scoped=true&lang=less (./node_modules/vue-loader/dist/index.js??ruleSet[1].rules[3].use[0]!./src/App.vue?vue&type=style&index=0&id=7ba5bd90&scoped=true&lang=less) 2:0
Module parse failed: Unexpected token (2:0)
File was processed with these loaders:
./node_modules/vue-loader/dist/index.js
You may need an additional loader to handle the result of these loaders.
|
.app-wrapper {
color: red;
}
@ ./src/App.vue?vue&type=style&index=0&id=7ba5bd90&scoped=true&lang=less

打包又报错了，说是还需要添加 loader,我们还需增加下面几个插件：

```bash
npm i -D less less-loader
```

编辑/build/webpack.config.js

```js
module.exports = {
 ...
 module:{
   rules:[
     ...
     {
       test: /\.css$/,
       use: ['style-loader', 'css-loader']
     },
     {
       test:/\.less$/,
       use:['style-loader','css-loader','less-loader']
     }
   ]
 }
}
```

到这里，我们再次执行打包命令 npm run build，打包成功了

### 2.2 .vue 移动端适配

如果我们是做移动端项目的话，那我们还需要做移动端适配。这里我们用 postcss-px-to-viewport 插件来做适配，即将 px 自动转换为 vm;用 autoprefixer 插件，自动给 css 追加前缀;我们发现 autoprefixer 在各个脚手架的使用较少，大多数都是用 postcss-preset-env，它可以帮我们转换现代的 css 让各个浏览器都能解析，并且其中已经帮我们做了 autoprefixer 插件做的事，甚至做得更多

（1） 安装插件

```bash
npm install -D autoprefixer
npm install -D postcss-preset-env
npm install -D postcss-px-to-viewport postcss-loader
```

（2）编辑/build/webpack.config.js

```js
module.exports = {
  ...
  module: {
    rules: [
      {
        test:/\.less$/,
        use:['style-loader','css-loader', {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: [
                // require('autoprefixer')({
                //   "overrideBrowserslist": [
                //     "> 1%",
                //     "last 7 versions",
                //     "not ie <= 8",
                //     "ios >= 8",
                //     "android >= 4.0"
                //   ]
                // }),
                require('postcss-preset-env'), // postcss-preset-env已经内置了autoprefixer了
                require('postcss-px-to-viewport')({
                  unitToConvert: "px", // 需要转换的单位，默认为"px"
                  viewportWidth: 750, // 设计稿的视窗宽度
                  unitPrecision: 3, // 单位转换后保留的精度
                  propList: [ // 能转化为 vw 的属性列表
                    "*",
                  ],
                  viewportUnit: "vw", // 希望使用的视窗单位
                  fontViewportUnit: "vw", // 字体使用的视窗单位
                  selectorBlackList: [], // 需要忽略的 CSS 选择器，不会转为视窗单位，使用原有的 px 等单位
                  minPixelValue: 1, // 设置最小的转换数值，如果为 1 的话，只有大于 1 的值会被转换
                  mediaQuery: false, // 媒体查询里的单位是否需要转换单位
                  replace: true, // 是否直接更换属性值，而不添加备用属性
                  exclude: /(\/|\\)(node_modules)(\/|\\)/, // 忽略某些文件夹下的文件或特定文件，例如 'node_modules' 下的文件
                  include: /\/src\//, // 如果设置了include，那将只有匹配到的文件才会被转换
                  landscapeUnit: 'vw', // 横屏时使用的单位
                  landscapeWidth: 1125, // 横屏时使用的视窗宽度
                })
              ]
            }
          }
        }, 'less-loader']
      }
    ]
  }
}
```

（3）我们再来编辑/src/App.vue

```html
<style scoped lang="less">
  .app-wrapper {
    display: flex;
    color: red;
    width: 750px;
  }
</style>
```

（4）如果我们使用 postcss-preset-env 插件，我们需要编辑/package.json，加入 browserslist，postcss-preset-env 才能生效

```json
{
  "browserslist": [
    "defaults",
    "not ie < 11",
    "last 3 versions",
    "> 0.2%",
    "iOS 7",
    "last 3 iOS versions"
  ]
}
```

ok，我们在来打包 npm run build，这里我们也是打包成功的

我们在浏览器运行/dist/index.html

审查元素，我们可以看到浏览器厂商前缀追加成功了，px 也成功转换成了 vm

```css
.app-wrapper[data-v-7ba5bd90] {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  color: red;
  width: 100vw;
}
```

为了让我们的代码更加优雅，我们把 postcss 工具相关的 autoprefixer，postcss-px-to-viewport 配置从 webpack 配置文件中抽离出去。
添加/postcss.config.js
相当于对 postcss-loader 的 options 选项写到一个新的文件然后导出，书写依赖的 plugins,所有用到 postcss-loader 的地方都会自动到这个文件里面来查找依赖。

```js
module.exports = {
  plugins: [
    // require('autoprefixer')({
    // "overrideBrowserslist": [
    //     "> 1%",
    //     "last 7 versions",
    //     "not ie <= 8",
    //     "ios >= 8",
    //     "android >= 4.0"
    // ]
    // }),
    require('postcss-preset-env')(), // postcss-preset-env已经内置了autoprefixer了
    require('postcss-px-to-viewport')({
      unitToConvert: 'px', // 需要转换的单位，默认为"px"
      viewportWidth: 750, // 设计稿的视窗宽度
      unitPrecision: 3, // 单位转换后保留的精度
      propList: [
        // 能转化为 vw 的属性列表
        '*',
      ],
      viewportUnit: 'vw', // 希望使用的视窗单位
      fontViewportUnit: 'vw', // 字体使用的视窗单位
      selectorBlackList: [], // 需要忽略的 CSS 选择器，不会转为视窗单位，使用原有的 px 等单位
      minPixelValue: 1, // 设置最小的转换数值，如果为 1 的话，只有大于 1 的值会被转换
      mediaQuery: false, // 媒体查询里的单位是否需要转换单位
      replace: true, // 是否直接更换属性值，而不添加备用属性
      exclude: /(\/|\\)(node_modules)(\/|\\)/, // 忽略某些文件夹下的文件或特定文件，例如 'node_modules' 下的文件
      include: /\/src\//, // 如果设置了include，那将只有匹配到的文件才会被转换
      landscapeUnit: 'vw', // 横屏时使用的单位
      landscapeWidth: 1125, // 横屏时使用的视窗宽度
    }),
  ],
}
```

编辑/build/webpack.config.js

```js
module.exports = {
  ...
  module: {
    rules: [
      {
        test:/\.less$/,
        use:['style-loader','css-loader', 'postcss-loader', 'less-loader']
      }
      ...
    ]
  }
}
```

再次打包，打包成功了，且 postcss-loader 处理成功了。

在我们实际开发中，我们可能会引入一些公共的样式文件
（1）添加/src/assets/base.less
（2）编辑/src/App.vue,引入公共的 base.less 文件

```js
<template>
    <div class="app-wrapper">拥抱vue3.x</div>
</template>
<script>
  export default {}
</script>
<style scoped lang="less">
  @import './assets/base.less';
  .app-wrapper {
      display: flex;
      color: red;
      width: 750px;
  }
</style>
```

（3）npm run build，打包是成功的

（4）浏览器中运行打包后的 index.html,我们发现 base.less 中的样式通过 style 标签的方式添加到了 html 中，我们想要把 css 拆分出来用外链的形式引入 css 文件。

（5）拆分 css 到一个单独的 css 文件

安装 mini-css-extract-plugin 插件

```bash
npm i -D mini-css-extract-plugin
```

编辑/build/webpack.config.js

```js
...
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
module.exports = {
  //...省略其他配置
  module:{
    rules:[
      {
        test:/\.less$/,
        use:[MiniCssExtractPlugin.loader,'css-loader', 'postcss-loader', 'less-loader']
      }
    ]
  },
  plugins: {
    new MiniCssExtractPlugin({
      filename: "css/[name].[hash:8].css",
      chunkFilename: "[id].css"
    }),
    //...
  }
}

```

npm run build 打包成功了，css 被抽离到一个单独的 css 文件中去了。

### 2.3 .vue 模板中使用本地图片、字体、媒体、txt 等文件

（1）编辑/src/App.vue

```html
<template>
  <div class="app-wrapper">
    <div class="app-wrapper">
      <!-- 大于4kb的图片 -->
      <img src="./assets/images/logo.png" />
      <!-- 小于4kb的图片 -->
      <img src="./assets/images/address.png" />
    </div>
  </div>
</template>
```

（2）npm run build 打包  
ERROR in ./src/assets/images/logo.png 1:0
Module parse failed: Unexpected character '�' (1:0)
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders  
大概意思就是需要添加额外的 loader 来处理图片。

我们知道在 webpack4 中需要配置额外 loader,才能处理这些文件

- raw-loader: 处理.txt 文件
- url-loader: 处理图片/字体/媒体等文件，当文件大小（单位 byte）低于指定的限制时，将导出一个资源的 dataURI (base64 编码)
- file-loader: 处理图片/字体/媒体等文件，当文件大小超过指定的限制时，file-loader 将文件移动到输出的目录中，发送一个单独的文件

但是在 webpack5 中则无需配置这些 loader，直接使用 webpack5 的新特性 资源模块类型(asset module type)

- asset/source：相当于 raw-loader
- asset/resource：相当于 file-loader
- asset/inline：相当于 url-loader
- asset: 在导出一个 dataURI 和发送一个单独的文件之间自动选择。之前通过使用 url-loader，并且配置资源体积限制实现

（3）编辑/build/webpack.config.js

```js
module.exports = {
  ...
  module:{
    rules:[
      {
        test: /\.(png|jpe?g|gif)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024 // 小于等于4kb的图片会导出一个dataUrl(base64编码)
          }
        },
        generator: {
          filename: 'img/[name][hash:8][ext]'
        }
      }
    ]
  }
}
```

（4）我们再次打包 npm run build,打包成功了，我们浏览器中运行打包后的 index.html，图片能够正常显示。

到这里，其实我们已经能够正常敲 vue 代码，但是我们还要考虑一下 js 代码的浏览器兼容情况。（当然现代浏览器基本都支持 es6+,利用这已特性，后面我们可以尝试一下用 vite(基于 ES module)构建项目）

### 2.4 用 babel 转义 js 文件

（1）babel 相关配置，需要安装的插件

```bash
npm i -D babel-loader @babel/preset-env @babel/core
```

- @babel/core： babel 的核心库
- @babel/preset-env：它取代了 es2015 es2016 es2017，通过配置浏览器版本的形式，将编译的主动权交给了插件。
- babel-loader：webpack 的 loader 插件，用于编译代码，转换成浏览器可识别的代码。  
  （2）编辑/build/webpack.config.js

```js
module.exports = {
  ...
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/, // 不编译node_modules下的文件
        use: ['babel-loader']
      }
    ]
  }
  ...
}
```

（3）添加 babel 配置文件 /babel.config.js

```js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ['last 2 versions'], // 最近2个版本的浏览器
        },
      },
    ],
  ],
}
```

> 这里 browsers 的配置，就是让 env 去识别要打包代码到什么程度，版本选的越新，打包出来的代码越小。因为通常版本越低的浏览器，代码转译的量会更大。
> （3）让我们来测试一下，编辑/src/App.vue

```js
...
export default defineComponent({
    setup () {
      const testFunc = () => {
          console.log('测试箭头函数是否babel转义成普通函数')
      }
    }
})
...
```

（4）npm run build 打包成功，我们发现=>函数成功转换成了普通函数。
（5）我们修改/babel.config.js

```js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ['last 1 chrome version'], // 最新1个谷歌版本
        },
      },
    ],
  ],
}
```

再次打包，我们发现代码还是箭头函数没有被转换  
（6）补充@babel/polyfill  
babel-loader 只会将部分 es6+代码转换成 es5，有些 api（如 promise/Proxy/Set/Map/Generator 等），此时我们需要借助@babel/polyfill 来帮助我们转换  
（7）编辑/build/webpack.config.js

```js
module.exports = {
  entry: ['@babel/polyfill', path.resolve(__dirname, '../src/main.js')], // 打包入口
}
```

（8）让我们再次打包，打包成功了，但是 Proxy 还在呢，哈哈哈，摆烂了，不知道了，不管了。

### 2.5 配置 webpack-dev-server 进行热更新

我们不想要改一小点点就要去打包才能看到效果，我们需要热更新  
（1）安装插件

```bash
npm i -D webpack-dev-server
```

（2）编辑/build/webpack.config.js

```js
module.exports = {
  ...
  devServer:{
    port: 8889,
    static:'../dist'
  },
}
```

（3）编辑/package.json，配置脚本

```json
{
  "scripts": {
    "dev": "webpack-dev-server --config build/webpack.config.js --open",
    "build": "webpack --config build/webpack.config.js"
  }
}
```

（4）执行 npm run dev, nice 我们成功了。

### 2.6 区分开发环境和生产环境

在实际项目中，我们需要区分开发环境和生产环境。

> 开发环境不需要压缩代码，需要热更新，需要完整的 source-map 等

> 生产环境需要压缩代码，不需要热更新，提取 css 压缩 css，合理的 source-map，代码分割

（1）添加文件

- /build/webpack.config.js 公用配置
- /build/webpack.dev.js 开发环境使用
- /build/webpack.prod.js 生产环境使用

（2）安装插件

- webpack-merge 合并配置
- copy-webpack-plugin 拷贝静态资源
- optimize-css-assets-webpack-plugin 压缩 css
- css-minimizer-webpack-plugin 压缩 css，webpack 中文官方文档中使用 与 optimize-css-assets-webpack-plugin 类似
- terser-webpack-plugin 压缩 js（该插件使用 terser 来压缩 JavaScript。）

（3）编辑/build/webpack.dev.js

```js
// 开发环境
const WebpackConfig = require('./webpack.config.js')
const { merge } = require('webpack-merge')
process.env.NODE_ENV = 'development'

module.exports = merge(WebpackConfig, {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    port: 8889,
    static: '../dist',
  },
})
```

（4）编辑/build/webpack.prod.js

```js
// 生产环境
const path = require('path')
const WebpackConfig = require('./webpack.config.js')
const { merge } = require('webpack-merge')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = merge(WebpackConfig, {
  mode: 'production',
  optimization: {
    minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
  },
  plugins: [
    // 处理静态文件夹static，复制到打包的static文件夹
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../static'),
          to: path.resolve(__dirname, '../dist/static'),
        },
      ],
    }),
  ],
})
```

（5）我们修改/package.json 配置

```json
{
  "scripts": {
    "dev": "webpack-dev-server --config build/webpack.dev.js --open",
    "build": "webpack --config build/webpack.prod.js"
  }
}
```

（6）npm run build 我们打包出来的 css 成功被压缩了,js 也被压缩了

### 2.7 集成 Typescript

vue3 源码采用 TS 进行重写，所以我们在 vue3 项目中也采用 TS

（1）安装 typescript

```bash
npm i -D typescript @babel/preset-typescript
```

（2）初始化 tsconfig

```bash
npx tsc --init
```

（3）编辑/babel.config.js

```js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ['last 2 versions'],
        },
      },
    ],
    [
      '@babel/preset-typescript',
      {
        allExtensions: true, // 支持所有文件扩展名，否则在vue文件中使用ts会报错
      },
    ],
  ],
}
```

（4）添加/src/shims-vue.d.ts 文件，解决 vue 类型报错

```ts
// shims-vue.d.ts
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
```

（5）编辑/public/webpack.config.js

```js
module.exports = {
  //...
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        exclude: /node_modules/, // 不编译node_modules下的文件
        use: ['babel-loader'],
      },
    ],
  },
}
```

（6）修改/src/App.vue

```html
<!-- 省略template -->
<script setup lang="ts">
  import Tabbar from '@/components/tabbar/index.vue'
  import { goodsList } from '@/api/modules/goods'

  const getGoods = async () => {
    const res = await goodsList({})
    console.log('res', res)
  }
  getGoods()
</script>
```

（7）npm run dev  
Module not found: Error: Can't resolve '@/api/modules/goods' in 'F:\github\vue3-cli-mock\src' 意思是找不到@/api/modules/goods 模块，我们为所有导入的 ts 模块加上.ts 后缀，再次运行成功了。但是 typescript 检查却没有通过,typescript 导入模块不予许加上.ts 后缀。我们通过 webpack 配置解决这个问题
（8）修改/build/webpack.config.js

```js
module.exports = {
  //..省略其他配置
  resolve: {
    // ...省略其他配置
    // 尝试按顺序解析这些后缀名。如果有多个文件有相同的名字，但后缀名不同，webpack 会解析列在数组首位的后缀的文件 并跳过其余的后缀。
    extensions: ['', '.js', '.jsx', '.ts', '.tsx'],
  },
}
```

（9）去掉所有导入模块的.ts 后缀，再次运行，终于成功了！！！注意：每次修改 webpack 配置文件，都需要重启本地服务才会生效！！！

### 2.8 集成 vue 全家桶（vue-router、axios、pinia（状态管理，vuex5））

```bash
npm i -S axios pinia vue-router
```

#### 2.8.1 集成 axios

（1）新增/src/api/index.ts

```js
import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import configs from '@/config/index'
import { ResultEnum } from '@/enums/httpEnum'

const config = {
  baseURL: process.env.NODE_ENV === 'production' ? configs.baseURL.pro : configs.baseURL.dev,
  timeout: configs.timeout,
  withCredentials: true,
}

class RequestHttp {
  service: AxiosInstance
  constructor(config: AxiosRequestConfig) {
    // 实例化
    this.service = axios.create(config)
    // 请求拦截器
    this.service.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        const token = '' // 本地缓存
        return { ...config, headers: { authorization: token } }
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      },
    )
    // 响应拦截器
    this.service.interceptors.response.use(
      (response: AxiosResponse) => {
        const { data } = response
        // * 登陆失效（code ==406）
        if (data.code == ResultEnum.OVERDUE) {
          // 清空token
          // 跳转登陆页
          return Promise.reject(data)
        }
        if (data.code && data.code !== ResultEnum.SUCCESS) {
          return Promise.reject(data)
        }
        return data
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      },
    )
  }
  request({ url, method, data }: any) {
    return this.service.request({
      url,
      method,
      [['delete', 'get'].includes(method) ? 'params' : 'data']: data,
    })
  }
}

export default new RequestHttp(config)
```

（2）新增/src/api/modules/goods.ts

```js
import HttpInstance from '@/api'
export const goodsList = (params: any) => {
  return HttpInstance.request({
    url: 'xxx',
    method: 'get',
    data: params,
  })
}
```

（3）调用 http request api，修改/src/App.vue

```html
<script setup lang="ts">
  import { goodsList } from '@/api/modules/goods'
  const getGoods = async () => {
    const res = await goodsList({})
    console.log('res', res)
  }
  getGoods()
</script>
```

#### 2.8.2 集成 vue-router

（1）新建

- /src/router/router.ts
- /src/router/index.ts
- /src/router/modules/home.ts
- /src/router/modules/mall.ts
- /src/router/modules/user.ts
  具体代码就不贴了，见源码

（2）修改/src/main.ts vue-router 挂到 app 应用上

```js
import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router/index'
const app = createApp(App) // 初始化app
app.use(router).mount('#app') // 将app挂载到app节点上
```

（3）修改/src/App.vue
这里有一个注意的点[router-view、keep-alive 和 transition 一起使用](https://router.vuejs.org/zh/guide/migration/index.html#router-view-%E3%80%81-keep-alive-%E5%92%8C-transition)

（4）在 script-setup 中使用 router

```html
<script setup>
  import { useRouter, useRoute } from 'vue-router'
  const rotuer = useRouter()
  const route = useRoute()
  rotuer.push()
</script>
```

#### 2.8.3 集成 pinia

（1）新建

- /store/index.ts
- /store/modules/order.ts
  这里具体实现代码也不贴了，见源码
  > 这里有个注意的点：pinia-plugin-persist 插件的数据持久化的问题。我们发现有些时候持久化数据更新失败了。
  > 我们看 pinia-plugin-persist 的源码

```js
// 在$subscribe中实现数据持久化
store.$subscribe(() => {
  strategies.forEach((strategy) => {
    // 存缓存
    updateStorage(strategy, store)
  })
})
```

我们再看 pinia 官网 [关于$subscribe api](https://pinia.vuejs.org/core-concepts/state.html#subscribing-to-the-state) 组件卸载后 state subscriptions 也没有了，就不会更新持久化数据了。

解决方法：

- 首次使用 state subscriptions（首次使用 store）在不会卸载的组件中，比如 App.vue 中
- 重写 pinia-plugin-persist 的源码$subscribe 加上第二个参数{detached: true}

（2）修改/src/main.ts

```js
import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router/index'
import pinia from '@/store/index'
const app = createApp(App) // 初始化app
app.use(router).use(pinia).mount('#app') // 将app挂载到app节点上
```

（3）在 script-setup 中使用 pinia

```html
<script lang="ts" setup>
  import { useGlobalStore } from '@/store'
  const GlobalStore = useGlobalStore()
  GlobalStore.setToken('token') // 通过actions更改state
  GlobalStore.setUserId('userid') // 通过actions更改state
  // 我们也可以批量更改state $fetch api
  GlobalStore.$patch((state) => {
    state.token = 'token'
    state.userid = 'userid'
  })
  GlobalStore.setUserInfo()
</script>
```

（4）在 script-setup 外使用 pinia

```js
import { useStore } from '~/stores/myStore'

export default {
  asyncData({ $pinia }) {
    const store = useStore($pinia)
  },
}
```

### 2.9 规范开发目录结构

```bash
├─build
│  ├─webpack.config.js
|  ├─webpack.dev.js
│  └─webpack.prod.js
├─dist
│  ├─css
│  ├─js
|  └─index.html
├─node_modules
├─public
|  └─index.html
└─src
|  ├─api
|  ├─assets
|  |  ├─images
|  |  ├─js
|  |  └─css
|  ├─components
|  ├─hooks
|  ├─router
|  ├─store
|  ├─types
|  |  ├─iglobal.d.ts
|  ├─utils
|  └─views
|  |-App.vue
|  |-main.ts
|  |-shims-vue.d.ts
|-.eslintignore
|-.eslintrc.js
|-.gitigore
|-babel.config.js
|-package.json
|-postcss.config.js
|-README.md
|-tsconfig.json

```

### 2.8 webpack 配置优化

到这里其实我们已经实现工程化了，但是为了我们更好的开发、构建体验和我们用户的体验，我们可以做一些优化。下面我们从两个方面来优化我们的 webpack 配置。

#### 2.8.1 优化开发体验

（1）webpack 的 resolve.alias 别名，帮助我们更简单的导入模块

有些时候我们的组件深度较深，若我们使用相对路径去导入其他文件会变得非常困难，我们可以运用 webpack 的 resolve.alias 来帮助我们引入模块变得简单。例如，一些位于 src/文件夹。

修改/build/webpack.config.js

```js
module.exports = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'),
    },
  },
}
```

（2）webpack 的 resolve.alias 别名，减少 webpack 的搜索范围，直接告诉 webpack 去哪个路径去查找。（当我们代码中出现 import 'vue'时， webpack 会采用向上递归搜索的方式去 node_modules 目录下找）

```js
module.exports = {
  resolve: {
    alias: {
      vue: 'vue/dist/vue.runtime.esm-browser.js',
    },
  },
}
```

#### 2.8.2 优化生产环境打包配置

（1）生产环境使用 terser-webpack-plugin 压缩 JavaScript

```bash
npm i -D terser-webpack-plugin
```

（2）修改/build/webpack.prod.js

```js
const TerserPlugin = require('terser-webpack-plugin')
module.exports = {
  // 关键代码
  mode: 'production',
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false, // terserOptions.format.comments 选项指定是否保留注释
          },
          compress: {
            // 生产环境去除console
            drop_console: true,
            // 生产环境去除debugger
            drop_debugger: true,
          },
        },
        extractComments: false, // 是否将注释剥离到单独的文件中
        parallel: true, // 使用多进程并发运行以提高构建速度
      }),
    ],
  },
}
```

> tips: 刚开始我配置的是 include: /\/src/ 即只压缩/src 下面的文件，但是这样配置导致所有的文件都压缩不了（相当于 TerserPlugin 失效），最终的解决方法是用 exclude 来排除不想压缩的文件。

（3）生产坏境打包优化 bundle 名称

> 我们先来了解几个关键词：hash、chunkhash、contenthash、module、chunk、bundle、filename、chunckFilename、webpackChunkName、optimization.chunkIds 参考[webpack 中那些最易混淆的 5 个知识点](https://juejin.cn/post/6844904007362674701)
>
> - hash 与整个项目的构建相关，更改项目中任何一个文件 hash 都会重新生成
> - chunkhash 与同一 chunk 内容相关，为 chunk 的 hash,chunk 发生改变才会重新生成 hash
> - contenthash 与文件内容相关，用于构建 css,即只是更改 css 只会重新生成 css 文件的 hash 而 js 文件的 hash 不会发生改变。仅更改 js，css 文件的 hash 也是不会更新的。但是在这个项目中，不管只更改 css 还是只更改 js，hash 都会改变，也是无解。
> - module 我们写的源代码,一个个源文件就是 module
> - chunk webpack 根据 module 文件引用关系生成的 chunk 文件，然后处理生成的 chunk 文件，最终生成直接在浏览器中运行的 bundle 文件
> - bundle webpack 打包最终输出的文件，根据 chunk 文件生成 bundle 文件，包含已经经过加载和编译过程的源文件的最终版本，它可以直接在浏览器中运行
> - filename 指列在 entry 中，打包后输出的文件名称
> - chunkFilename 指未列在 entry 中，打包后输出的文件名称（如一些懒加载代码，像路由懒加载 import 等）
> - webpackChunkName 为懒加载的文件取别名
> - optimization.chunkIds v5 新增重大变更，可以在生产环境指定 optimization.chunkIds: "named",功能与 webpackChunkName 类似，使得打包出来的 bundle 文件具有可读意义的名称，但官方还是推荐生产坏境默认的'deterministic' [optimization.chunkIds](https://webpack.docschina.org/configuration/optimization/#optimizationchunkids)

修改/build/webpack.config.js

```js
module.exports = {
  output: {
    path: path.resolve(__dirname, '../dist'), // 打包出口
    filename: 'js/[name].[chunkhash:8].js', // 根据列在entry中打包完的静态资源文件名 hash => chunkhash 这里可以了解一下hash和chunkhash的区别
    chunkFilename: 'js/[name].[chunkhash:8].js', // 未列在entry中（如路由懒加载import）打包出来的文件名
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css', // 生成的bundle名 chunkhash => contenthash
      chunkFilename: 'css/[name].[contenthash:8].css', // chunk名
    }),
  ],
}
```

更改/src/router/modules/mall.ts

```js
const MallRouter: RouteRecordRaw[] = [
  {
    path: '/mall',
    component: () => import(/* webpackChunkName: "mall" */ '@/views/mall.vue'),
    meta: {
      title: '商城',
      needAuth: true,
    },
  },
]
```

执行 npm run build 可以看到我们 mall.ts 模块打包出来的 bundle 名称变成了具有可读意义的，我们自己定义的 mall。

（4）devtool  
我们在开发环境或生产环境中，module 经过 webpack 处理后，代码已经不是我们的源代码了，这样就会出现一个问题，一旦代码出现问题，我们便很难定位问题出现在源代码中的位置，这个时候我们可以借助 source map 帮助我们从 webpack 转换后的代码映射到源代码。感兴趣的可以查看资料[webpack Devtool](https://webpack.docschina.org/configuration/devtool/#devtool)官方有推荐生产坏境和开发环境使用 source map 风格。但是注意选择一种 source map 风格来增强调试过程。不同的值会明显影响到构建(build)和重新构建(rebuild)的速度。

> 其实到这个时候，打包出来的 index.html 是无法运行的，报错**VUE_PROD_DEVTOOLS** is not defined

```text
main.a90864ff.js:1 Uncaught ReferenceError: __VUE_PROD_DEVTOOLS__ is not defined
```

我们先解决这个问题，参考[webpack5 + vue3 从零配置项目](https://juejin.cn/post/7056398225095262245#heading-12)
修改/build/webpack.config.js

```js
const { DefinePlugin } = require('webpack')
module.exports = {
  plugins: [
    new DefinePlugin({
      __VUE_PROD_DEVTOOLS__: false, // 生产环境是否继续支持devtools插件
      __VUE_OPTIONS_API__: false, // 是否支持 options api 的写法
    }),
  ],
}
```

修改构建配置文件后，重新打包 npm run build，index.html 就可以正常运行了

（5）bundle 分析： webpack-bundle-analyzer  
我们生产环境直接运行的是 bundle，bundle 的大小对网页加载速度很重要，webpack-bundle-analyzer 就是一个可视化分析 bundle 大小的插件，分析结果有利于我们优化 bundle 大小

```bash
npm i -D webpack-bundle-analyzer
```

修改/build/webpack.config.js

```js
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
module.exports = {
  plugins: [new BundleAnalyzerPlugin()],
}
```

修改/package.json

```json
{
  "scripts": {
    "build:report": "npm run build:pro --report"
  }
}
```

运行 npm run build:report
（6）代码分离  
根据 bundle 分析结果，我们可以看到此时打包的入口文件比较庞大。里面包含了 node_modules 中的内容和我们自己写的源码 src.
我们可以做代码分离，将大的文件拆分成多个 bundle，然后进行并行加载或者按需加载。代码分离可以获得更小的 bundle，以及控制资源加载优先级，如果使用合理，会极大减少加载时间。

常用的代码分离方法有三种：

- 入口起点：使用 entry 配置手动地分离代码。
- 防止重复：使用 Entry dependencies 或者 SplitChunksPlugin 去重和分离 chunk.
- 动态导入：import()语法来实现动态导入或者 require.ensure,可以用来实现路由懒加载。

这里我们重点讲一下防止重复，

- 入口依赖
  如果我们是哟哦那个 entry 配置手动分离代码，那么我们就需要配置 dependOn option 选项，在多个 chunk 之间共享模块。
- SplitChunksPlugin
  SplitChunksPlugin 插件可以将公共的依赖模块(如 node_modules 中的)提取到已有的入口 chunk 中，或者提取到一个新生成的 chunk 中。

### 2.9 统一代码规范

统一代码规范包括代码校验、代码格式、编辑器配置、git 提交前校验等。

#### 2.9.1 Eslint 代码检查工具

（1）安装如下插件：

```bash
npm i -D eslint
eslint-plugin-vue
@vue/cli-plugin-eslint
@typescript-eslint/eslint-plugin
@typescript-eslint/parser
```

|               依赖               |                               作用描述                               |
| :------------------------------: | :------------------------------------------------------------------: |
|              eslint              |                            ESLint 核心库                             |
|        eslint-plugin-vue         |                      为 Vue 使用 ESlint 的插件                       |
| @typescript-eslint/eslint-plugin |      ESLint 插件，包含了各类定义好的检测 TypeScript 代码的规范       |
|    @typescript-eslint/parser     | ESLint 的解析器，用于解析 TypeScript，从而检查和规范 TypeScript 代码 |

（2）安装 vscode 插件 ESLint

（3）配置 eslint 校验规则，/.eslintrc.js、/.eslintignore
（4）.vscode/settings.json

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.alwaysShowStatus": true,
  "eslint.validate": ["javascript", "typescript", "vue", "html"],
  "eslint.format.enable": true
}
```

也可以在 vscode 中全局配置

#### 2.9.2 prettier 代码格式化

Eslint 我们主要用来做代码质量控制，Eslint 虽然也能做代码风格控制，但是 Eslint 只能校验 js，所以我们用 Prettier 来控制代码风格。

（1）npm 安装 prettier 插件

```bash
npm i -D prettier
```

（2）安装 vscode 插件 Prettier  
（3）配置 prettier /.prettierrc.js /.prettierignore  
（4）.vscode/settings.json

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.alwaysShowStatus": true,
  "eslint.validate": ["javascript", "typescript", "vue", "html"],
  "eslint.format.enable": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true
}
```

也可以在 vscode 中全局配置，这里表示当前工作区配置，优先级高于全局配置

> 配置了 Eslint 和 Prettier 只有在我们打开某一个文件，并手动保存时，格式才会更新。我们想要一键更新所有我们想要更新的文件,我们编辑/package.json，配置脚本

```json
"scripts": {
    "dev": "webpack-dev-server --config build/webpack.dev.js --open",
    "build": "npm run build:pro",
    "build:pro": "webpack --config build/webpack.prod.js --mode production",
    "format:check": "prettier --check .", // .表示根目录
    "format:write": "prettier --write .",
    "lint:check": "eslint .",
    "lint:fix": "eslint --fix ."
  },
```

#### 2.9.3 stylelint 规范 css 格式

（1）安装 stylelint 相关插件

```bash
npm i -D stylelint stylelint-config-standard stylelint-order stylelint-config-prettier
```

|           依赖            |                   作用描述                   |
| :-----------------------: | :------------------------------------------: |
|         stylelint         |               stylelint 核心库               |
| stylelint-config-standard |                标准可共享配置                |
|      stylelint-order      |             css 属性排序规则插件             |
| stylelint-config-prettier | 关闭所有不必要的或可能与 Prettier 冲突的规则 |

（2）安装 vscode stylelint 插件
（3）配置 stylelint /.stylelintrc.js /.stylelintignore

```js
module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-prettier'],
  plugins: ['stylelint-order'],
  /* null  => 关闭该规则 */
  rules: {
    'order/properties-order': ['position', 'top', 'width', 'height', 'z-index', 'display'],
  },
}
```

（4）.vscode/settings.json

```json
{
  // ...省略配置
  "editor.codeActionsOnSave": {
    "source.fixAll": true, // 开启保存自动修复
    "source.fixAll.stylelint": true // 开启保存stylelint自动修复
  },
  "stylelint.validate": ["css", "less", "postcss", "scss", "vue", "sass"]
}
```

（5）配置完成，我们想试一下 stylelint 效果，我们发现出现了 Unknown word (CssSyntaxError)Stylelint(CssSyntaxError)错误  
据网友说这个问题主要是因为 stylelint 升级到 14 大版本造成的。  
解决方案  
安装 stylelint 一些新的相关的依赖

```bash
npm i -D
stylelint-config-recommended-vue
stylelint-config-standard-scss
postcss-html
```

修改/.stylelintrc.js

```js
module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-standard-scss',
    'stylelint-config-recommended-vue',
    'stylelint-config-recommended-vue/scss',
    'stylelint-config-prettier',
  ],
  // ...
}
```

|               依赖               |                            作用描述                             |
| :------------------------------: | :-------------------------------------------------------------: |
|  stylelint-config-standard-scss  |  扩展 stylelint-config-standard 共享配置，并为 SCSS 配置其规则  |
| stylelint-config-recommended-vue | 扩展 stylelint-config-recommended 共享配置，并为 Vue 配置其规则 |
|           postcss-html           |                                                                 |

修改完成之后，就没有报这个错误了，stylelint 可以按照我们的配置生效了。

> 注意修改后可能还是没有生效，需要重启一下 vscode

#### 2.9.3 EditorConfig

EditorConfig 是用于统一不同 IDE 编码风格配置的一种配置文件.
容易阅读,并且方便版本控制系统管理
（1）新增/.editorconfig

```conf
# top-most EditorConfig file
root = true

[*] # 表示所有文件适用
charset = utf-8 # 设置文件字符集为 utf-8
end_of_line = lf # 控制换行类型(lf | cr | crlf)
insert_final_newline = true # 始终在文件末尾插入一个新行
indent_style = space # 缩进风格（tab | space）
indent_size = 2 # 缩进大小
max_line_length = 100 # 最大行长度
trim_trailing_whitespace = true # 关闭末尾空格修剪,设置为 true 删除所有换行符前的空白字符false 不删除

[*.md] # 表示仅 md 文件适用以下规则
max_line_length = off # 关闭最大行长度限制
trim_trailing_whitespace = false # 关闭末尾空格修剪
```

到目前位置，我们团队规约统一代码规范的所有配置都已经做完了，但是其实我们并不能保证每个开发人员在提交代码时，都运行了脚本修复了代码格式问题。如果大家不按照规范来做，会导致我们在合并代码时出现各种各样大篇幅的格式问题，真的很令人头疼。我们可以利用 git commit 来约束团队成员，在代码提交前自动运行脚本，修复我们的代码格式问题，如果修复不成功，则不予许 commit

#### 2.9.3 git 提交前校验

（1）安装 git 版本控制相关插件 husky、lint-staged、commitlint、commitizen

```bash
npm i -D husky lint-staged @commitlint/cli @commitlint/config-conventional commitizen
```

|              依赖               |                                                        作用描述                                                         |
| :-----------------------------: | :---------------------------------------------------------------------------------------------------------------------: |
|              husky              | Git hooks 工具，操作 git 钩子的工具（在 git xx 之前执行某些命令），可以防止使用 Git hooks 的一些不好的 commit 或者 push |
|           lint-staged           |                                       在提交之前进行 eslint 校验本地暂存区的文件                                        |
|           commitlint            |                                   校验 git commit 信息是否符合规范，保证团队的一致性                                    |
|         @commitlint/cli         |                                            用来在命令行中提示用户提交信息的                                             |
| @commitlint/config-conventional |                                                    Anglar 的提交规范                                                    |
|           commitizen            |                           基于 Node.js 的 git commit 命令行工具，生成标准化的 commit message                            |

（2）husky（git Hooks 工具）  
编辑/package.json，添加脚本

```json
"scripts": {
    "prepare": "husky install"
}
```

npm run prepare 生成./husky 文件夹  
（3）lint-staged（本地暂存区文件代码检查）  
添加 Eslint Hook，添加/.husky/pre-commit 文件（通过钩子函数，判断提交的代码是否符合规范，并使用 prettier、eslint、stylelint 格式化代码）

```bash
npx husky add .husky/pre-commit
```

编辑/.husky/pre-commit 文件

```$
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run lint:lint-staged
```

编辑/package.json，添加脚本

```json
"scripts": {
    "prepare": "husky install",
    "lint:lint-staged": "lint-staged"
}
```

添加/.lintstagedrc.json

```json
{
  "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
  "{!(package)*.json,*.code-snippets,.!(browserslist)*rc}": ["prettier --write--parser json"],
  "package.json": ["prettier --write"],
  "*.vue": ["eslint --fix", "prettier --write", "stylelint --fix"],
  "*.{scss,less,styl,html}": ["stylelint --fix", "prettier --write"],
  "*.md": ["prettier --write"]
}
```

> npm run lint:lint-staged 此时我们发现，脚本运行出错了（lint-staged/lib/index.js:112
> 报错了），百度很久都没有解决这个问题 555，最后想到去 npm 官网上看，lint-staged 官网上说，

```text
Since v13.0.0 lint-staged no longer supports Node.js 12. Please upgrade your Node.js version to at least 14.13.1, or 16.0.0 onward.
```

我安装的 lint-staged v13.0.2,但是我的 node 版本是 v12.22.7，解决方案就是要么升级我们的 node 版本，要么降级我们的 lint-staged 版本，这里我采用的是降级 lint-staged 版本。

现在我们再运行 npm run lint:lint-staged lint-staged 能正常工作了

（4）commitlint（commit 信息校验工具，不符合则报错）  
Commit Message 的标准格式：Header，Body，Footer

```text
<type>[scope]: <subject>
// 空一行
<body>
// 空一行
<footer>
```

添加/.husky/commit-msg 文件

```text
npx husky add .husky/commit-msg
```

编辑/.husky/commit-msg 文件

```text
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no-install commitlint --edit $1
```

添加/.commitlintrc.js

```js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // @see: https://commitlint.js.org/#/reference-rules
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
        'revert',
        'wip',
        'workflow',
        'types',
        'release',
      ],
    ],
    'subject-full-stop': [0, 'never'],
    'subject-case': [0, 'never'],
  },
}
```

（5）commitizen（当您使用 Commitizen（git-cz） 提交时，系统会提示您在提交时填写所有必需的提交字段）  
编辑/package.json

```json
"scripts": {
    "commit": "git-cz",
  },
"config": {
    "commitizen": {
      "path": "node_modules/cz-conventional-changelog"
    }
  }
```

然后我们就可以使用 npm run commit 来提交代码，系统会一步步提示我们填写符合标准的 Commit Message
