# Webpack5 从 0 到 1 搭建 Vue 3.x 开发环境

[webpack中文文档](https://webpack.docschina.org/)

## 1 配置Webpack环境
### 1.1 初始化项目
```bash
mkdir private-vue3-cli && cd private-vue3-cli
npm init
yarn add webpack webpack-cli -D/npm i -D webpack webpack-cli
```
添加/src/main.js文件   
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
此时如果生成了一个dist文件夹，并且内部含有main.js说明已经打包成功了

### 1.2 开始我们自己的配置
添加/build/webpack.config.js文件
```js
// webpack.config.js
const path = require('path')

module.exports = {
  mode: 'development', // 环境模式
  entry: path.resolve(__dirname, '../src/main.js'), // 打包入口
  output: {
    path: path.resolve(__dirname, '../dist'), // 打包出口
    filename: 'js/[name].[hash:8].js' // 打包完的静态资源文件名
  }
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
### 1.3 配置html模板
添加/public/index.html
安装html-webpack-plugin插件，自动将打包后的文件引入到index.html中
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
    filename: 'js/[name].[hash:8].js' // 打包完的静态资源文件名
  },
  plugins:[
    new HtmlWebpackPlugin({
      template:path.resolve(__dirname,'../public/index.html'),  // 我们要使用的 html 模板地址
      filename: 'index.html', // 打包后输出的文件名
      title: '从0到1手搭Vue开发环境' // index.html 模板内，通过 <%= htmlWebpackPlugin.options.title %> 拿到的变量
    })
  ]
}
```
编辑/public/index.html
```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
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
生成多个html-webpack-plugin实例来解决这个问题，这里就不贴代码了
### 1.3.2 clean-webpack-plugin
执行打包命令时，先清空dist文件夹  
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
## 2 搭建vue3.x开发环境

### 2.1 解析.vue文件
安装vue 默认为vue3.x
```bash
npm i -S vue
```
添加/src/App.vue文件
```html
<template>
    <div>拥抱vue3.x</div>
</template>
<script>
export default {}
</script>
<style>
</style>
```
编辑/src/main.js文件 
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

意思大概是说需要loader来处理.vue文件。浏览器环境不能识别.vue文件，我们需要把.vue文件转变成浏览器能解析的js，接下来我们需要添加下面的插件：  
+ vue-loader：它是基于 webpack 的一个的 loader 插件，解析和转换 .vue  文件，提取出其中的逻辑代码 script、样式代码 style、以及 HTML 模版 template，再分别把它们交给对应的 loader 去处理如 style-loader 、 less-loader 等等，核心的作用，就是提取。
+ @vue/compiler-sfc：Vue 2.x 时代，需要vue-template-compiler插件处理 .vue 内容为 ast；Vue 3.x 则变成 @vue/compiler-sfc。   

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
VueLoaderPlugin插件就是将module.rules复制并应用到.vue文件里相应语言的块。例如，如果你有一条匹配 /\.js$/ 的规则，那么它会应用到 .vue 文件里的script块

执行
```bash
npm run build
```
这次我们打包成功了

接下来我们在App.vue中加入style内容，编辑/src/App.vue
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

 大概意思就是需要loader来处理css,接下来我们需要添加下面的插件：
 + style-loader：将css样式插入到页面的style标签中。
 + css-loader
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

 但是我们想要用less来构建样式,我们编辑/src/App.vue
 ```html
 ...
 <style scoped lang="less">
.app-wrapper {
    color: red;
}
</style>
 ```
 再次打包npm run build

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

 打包又报错了，说是还需要添加loader,我们还需增加下面几个插件：
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
到这里，我们再次执行打包命令npm run build，打包成功了

### 2.2 .vue移动端适配

如果我们是做移动端项目的话，那我们还需要做移动端适配。这里我们用postcss-px-to-viewport插件来做适配，即将px自动转换为vm;用autoprefixer插件，自动给css追加前缀;我们发现autoprefixer在各个脚手架的使用较少，大多数都是用postcss-preset-env，它可以帮我们转换现代的css让各个浏览器都能解析，并且其中已经帮我们做了autoprefixer插件做的事，甚至做得更多

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
（4）如果我们使用postcss-preset-env插件，我们需要编辑/package.json，加入browserslist，postcss-preset-env才能生效
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
ok，我们在来打包npm run build，这里我们也是打包成功的

我们在浏览器运行/dist/index.html

审查元素，我们可以看到浏览器厂商前缀追加成功了，px也成功转换成了vm
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
为了让我们的代码更加优雅，我们把postcss工具相关的autoprefixer，postcss-px-to-viewport配置从webpack配置文件中抽离出去。
添加/postcss.config.js
相当于对postcss-loader的options选项写到一个新的文件然后导出，书写依赖的plugins,所有用到postcss-loader的地方都会自动到这个文件里面来查找依赖。
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
再次打包，打包成功了，且postcss-loader处理成功了。

在我们实际开发中，我们可能会引入一些公共的样式文件
（1）添加/src/assets/base.less
（2）编辑/src/App.vue,引入公共的base.less文件
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

（4）浏览器中运行打包后的index.html,我们发现base.less中的样式通过style标签的方式添加到了html中，我们想要把css拆分出来用外链的形式引入css文件。

（5）拆分css到一个单独的css文件

安装mini-css-extract-plugin插件
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
npm run build 打包成功了，css被抽离到一个单独的css文件中去了。

### 2.3 .vue模板中使用本地图片、字体、媒体、txt等文件
（1）编辑/src/App.vue
```html
<template>
    <div class="app-wrapper">
        <div class="app-wrapper">
        <!-- 大于4kb的图片 -->
        <img src="./assets/images/logo.png"/>
        <!-- 小于4kb的图片 -->
        <img src="./assets/images/address.png"/>
    </div>
    </div>
</template>
```
（2）npm run build打包   
ERROR in ./src/assets/images/logo.png 1:0
Module parse failed: Unexpected character '�' (1:0)
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders   
大概意思就是需要添加额外的loader来处理图片。  

我们知道在webpack4中需要配置额外loader,才能处理这些文件
+ raw-loader: 处理.txt文件
+ url-loader: 处理图片/字体/媒体等文件，当文件大小（单位 byte）低于指定的限制时，将导出一个资源的dataURI (base64编码)
+ file-loader: 处理图片/字体/媒体等文件，当文件大小超过指定的限制时，file-loader将文件移动到输出的目录中，发送一个单独的文件

但是在webpack5中则无需配置这些loader，直接使用webpack5的新特性 资源模块类型(asset module type) 
+ asset/source：相当于raw-loader
+ asset/resource：相当于file-loader
+ asset/inline：相当于url-loader
+ asset: 在导出一个dataURI和发送一个单独的文件之间自动选择。之前通过使用 url-loader，并且配置资源体积限制实现  

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
（4）我们再次打包npm run build,打包成功了，我们浏览器中运行打包后的index.html，图片能够正常显示。

到这里，其实我们已经能够正常敲vue代码，但是我们还要考虑一下js代码的浏览器兼容情况。（当然现代浏览器基本都支持es6+,利用这已特性，后面我们可以尝试一下用vite(基于ES module)构建项目）

### 2.4 用babel转义js文件

（1）babel相关配置，需要安装的插件  
```bash
npm i -D babel-loader @babel/preset-env @babel/core
``` 
+ @babel/core： babel 的核心库
+ @babel/preset-env：它取代了es2015 es2016 es2017，通过配置浏览器版本的形式，将编译的主动权交给了插件。
+ babel-loader：webpack的loader插件，用于编译代码，转换成浏览器可识别的代码。   
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
（3）添加babel配置文件 /babel.config.js
```js
module.exports = {
    presets: [
        ['@babel/preset-env', {
            'targets': {
                'browsers': ['last 2 versions'] // 最近2个版本的浏览器
            }
        }]
    ]
}
```
> 这里browsers的配置，就是让env去识别要打包代码到什么程度，版本选的越新，打包出来的代码越小。因为通常版本越低的浏览器，代码转译的量会更大。
（3）让我们来测试一下，编辑/src/App.vue
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
    ["@babel/preset-env", {
        "targets": {
            "browsers": ["last 1 chrome version"] // 最新1个谷歌版本
        }
    }]
  ]
}
```
再次打包，我们发现代码还是箭头函数没有被转换   
（6）补充@babel/polyfill   
babel-loader只会将部分es6+代码转换成es5，有些api（如promise/Proxy/Set/Map/Generator等），此时我们需要借助@babel/polyfill来帮助我们转换    
（7）编辑/build/webpack.config.js
```js
module.exports = {
  entry: ['@babel/polyfill', path.resolve(__dirname, '../src/main.js')], // 打包入口
}
```
（8）让我们再次打包，打包成功了，但是Proxy还在呢，哈哈哈，摆烂了，不知道了，不管了。


### 2.5 配置webpack-dev-server进行热更新
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
（4）执行npm run dev, nice我们成功了。
### 2.6 区分开发环境和生产环境
在实际项目中，我们需要区分开发环境和生产环境。
> 开发环境不需要压缩代码，需要热更新，需要完整的source-map等     

> 生产环境需要压缩代码，不需要热更新，提取css压缩css，合理的source-map，代码分割

（1）添加文件
+ /build/webpack.config.js 公用配置
+ /build/webpack.dev.js 开发环境使用
+ /build/webpack.prod.js 生产环境使用  

（2）安装插件
+ webpack-merge 合并配置
+ copy-webpack-plugin 拷贝静态资源
+ optimize-css-assets-webpack-plugin 压缩css
+ css-minimizer-webpack-plugin 压缩css，webpack中文官方文档中使用 与optimize-css-assets-webpack-plugin类似 
+ terser-webpack-plugin 压缩js（该插件使用 terser 来压缩 JavaScript。）

（3）编辑/build/webpack.dev.js
```js
// 开发环境
const WebpackConfig = require('./webpack.config.js')
const {merge} = require('webpack-merge')
process.env.NODE_ENV='development'

module.exports = merge(WebpackConfig, {
    mode: 'development',
    devtool: 'source-map',
    devServer:{
        port: 8889,
        static:'../dist'
    }
})
```
（4）编辑/build/webpack.prod.js
```js
// 生产环境
const path = require('path')
const WebpackConfig = require('./webpack.config.js')
const {merge} = require('webpack-merge')
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")
const TerserPlugin = require("terser-webpack-plugin")
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = merge(WebpackConfig, {
    mode: 'production',
    optimization: {
        minimizer: [
            new CssMinimizerPlugin(),
            new TerserPlugin()
        ]
    },
    plugins: [
        // 处理静态文件夹static，复制到打包的static文件夹
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, '../static'),
                    to: path.resolve(__dirname, '../dist/static')
                }
            ]
        })
    ]
})
```

（5）我们修改/package.json配置
```json
{
  "scripts": {
    "dev": "webpack-dev-server --config build/webpack.dev.js --open",
    "build": "webpack --config build/webpack.prod.js"
  }
}
```
（6）npm run build 我们打包出来的css成功被压缩了,js也被压缩了

### 2.7 集成Typescript
vue3源码采用TS进行重写，所以我们在vue3项目中也采用TS

（1）安装typescript
```bash
npm i -D typescript @babel/preset-typescript
```
（2）初始化tsconfig
```bash
npx tsc --init
```
（3）编辑/babel.config.js
```js
module.exports = {
    presets: [
        [
            "@babel/preset-env", {
                "targets": {
                    'browsers': ['last 2 versions']
                }
            }
        ],
        [
            "@babel/preset-typescript",
            {
              allExtensions: true, // 支持所有文件扩展名，否则在vue文件中使用ts会报错
            },
        ],
    ]
}
```
（4）添加/src/shims-vue.d.ts文件，解决 vue 类型报错
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
        use: ['babel-loader']
      }
    ]
  }
}
```
（6）修改/src/App.vue
```html
<!-- 省略template -->
<script setup lang="ts">
    import Tabbar from '@/components/tabbar/index.vue'
    import { goodsList } from "@/api/modules/goods";
    
    const getGoods = async () => {
        const res = await goodsList({})
        console.log('res', res)
    }
    getGoods()
</script>
```
（7）npm run dev   
Module not found: Error: Can't resolve '@/api/modules/goods' in 'F:\github\vue3-cli-mock\src' 意思是找不到@/api/modules/goods模块，我们为所有导入的ts模块加上.ts后缀，再次运行成功了。但是typescript检查却没有通过,typescript导入模块不予许加上.ts后缀。我们通过webpack配置解决这个问题
（8）修改/build/webpack.config.js
```js
module.exports = {
  //..省略其他配置
  resolve: {
    // ...省略其他配置
    // 尝试按顺序解析这些后缀名。如果有多个文件有相同的名字，但后缀名不同，webpack 会解析列在数组首位的后缀的文件 并跳过其余的后缀。
    extensions: ['', '.js', '.jsx', '.ts', '.tsx']
  },
}
```
（9）去掉所有导入模块的.ts后缀，再次运行，终于成功了！！！注意：每次修改webpack配置文件，都需要重启本地服务才会生效！！！

### 2.8 集成vue全家桶（vue-router、axios、pinia（状态管理，vuex5））
```bash
npm i -S axios pinia vue-router
```
#### 2.8.1 集成axios
（1）新增/src/api/index.ts
```js
import axios, {AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios'
import configs from '@/config/index'
import { ResultEnum } from "@/enums/httpEnum"

const config = {
    baseURL: process.env.NODE_ENV === 'production' ? configs.baseURL.pro : configs.baseURL.dev,
    timeout: configs.timeout,
    withCredentials: true
}

class RequestHttp {
    service: AxiosInstance
    constructor (config: AxiosRequestConfig) {
        // 实例化
        this.service = axios.create(config)
        // 请求拦截器
        this.service.interceptors.request.use((config: AxiosRequestConfig) => {  
            const token = ''   // 本地缓存
            return {...config, headers: {'authorization': token}}
        },
        (error: AxiosError) => {
            return Promise.reject(error)
        })
        // 响应拦截器
        this.service.interceptors.response.use((response: AxiosResponse) => {
            const {data} = response
            // * 登陆失效（code ==406）
            if (data.code == ResultEnum.OVERDUE) {
                // 清空token
                // 跳转登陆页
                return Promise.reject(data)
            }
            if (data.code && data.code !== ResultEnum.SUCCESS) {
                return Promise.reject(data)
            }
            return data;
        },
        (error: AxiosError) => {
            return Promise.reject(error)
        })
    }
    request({
        url,
        method,
        data
    }: any) {        
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
      data: params
    })
  }
```
（3）调用http request api，修改/src/App.vue
```html
<script setup lang="ts">
    import { goodsList } from "@/api/modules/goods"; 
    const getGoods = async () => {
        const res = await goodsList({})
        console.log('res', res)
    }
    getGoods()
</script>
```
#### 2.8.2 集成vue-router
（1）新建/src/router/router.ts
（2）新建/src/router/index.ts
（3）新建/src/router/modules/goods.ts
#### 2.8.3 集成pinia

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


### 2.8 优化webpack配置
到这里其实我们已经实现工程化了，但是为了我们更好的开发、构建体验和我们用户的体验，我们可以做一些优化。下面我们从两个方面来优化我们的webpack配置。



#### 2.8.1 优化开发体验

（1）webpack的resolve.alias别名，帮助我们更简单的导入模块   

有些时候我们的组件深度较深，若我们使用相对路径去导入其他文件会变得非常困难，我们可以运用webpack的resolve.alias来帮助我们引入模块变得简单。例如，一些位于src/文件夹。

修改/build/webpack.config.js
```js
module.exports = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname,'../src')
    }
  }
}
```
（2）webpack的resolve.alias别名，减少webpack的搜索范围，直接告诉webpack去哪个路径去查找。（当我们代码中出现 import 'vue'时， webpack会采用向上递归搜索的方式去node_modules 目录下找）
```js
module.exports = {
  resolve: {
    alias: {
      vue: 'vue/dist/vue.runtime.esm-browser.js'
    }
  }
}
```


### 2.9 统一代码规范
统一代码规范包括代码校验、代码格式化、git提交前校验、编辑器配置等
（1） Eslint代码检查工具   
添加/.eslintrc.js