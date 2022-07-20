// webpack.config.js
const { getPath } = require('./utils')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader/dist/index')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 提取js中的css文件
const { DefinePlugin } = require('webpack')
const WindiCSSWebpackPlugin = require('windicss-webpack-plugin')
// const { WebpackManifestPlugin } = require('webpack-manifest-plugin')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin') // 打包速度分析

module.exports = {
  entry: getPath('../src/main.ts'), // 打包入口
  output: {
    path: getPath('../dist'), // 打包出口
    filename: 'js/[name].[contenthash:8].bundle.js', // 根据列在entry中打包完的静态资源文件名 hash => chunkhash 这里可以了解一下hash和chunkhash的区别
    chunkFilename: 'js/[name].[contenthash:8].bundle.js', // 未列在entry中（如路由懒加载import）打包出来的文件名
    clean: true,
    pathinfo: false, // 输出bundle中不生成路径信息
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: getPath('../public/index.html'), // 我们要使用的 html 模板地址
      filename: 'index.html', // 打包后输出的文件名
      inject: 'body', //打包出来的那个js文件，放置在生成的body标签内
      title: '从0到1手搭Vue开发环境', // index.html 模板内，通过 <%= htmlWebpackPlugin.options.title %> 拿到的变量
    }),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css', // 生成的bundle名 chunkhash => contenthash
      chunkFilename: 'css/[name].[contenthash:8].css', // chunk名
    }),
    new DefinePlugin({
      __VUE_PROD_DEVTOOLS__: false, // 生产环境是否继续支持devtools插件
      __VUE_OPTIONS_API__: false, // 是否支持 options api 的写法
    }),
    new WindiCSSWebpackPlugin(),
    // new WebpackManifestPlugin(),
    new SpeedMeasurePlugin(),
  ],
  resolve: {
    // 解析
    alias: {
      '@': getPath('../src'),
      vue: 'vue/dist/vue.runtime.esm-browser.js',
    },
    // 尝试按顺序解析这些后缀名。如果有多个文件有相同的名字，但后缀名不同，webpack 会解析列在数组首位的后缀的文件 并跳过其余的后缀。
    extensions: ['.ts', '.tsx', '.js'], // 减少条目数量数量，可提高解析速度。因为他们会增加文件系统调用的次数。
    symlinks: false, // 可提高解析速度
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: ['vue-loader'],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'], // 从右向左解析原则
      },
      // {
      //   test:/\.less$/,
      //   use:['style-loader','css-loader', {
      //     loader: 'postcss-loader',
      //     options: {
      //       postcssOptions: {
      //         plugins: []
      //       }
      //     }
      //   }, 'less-loader']
      // },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader'],
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024,
          },
        },
        generator: {
          filename: 'img/[name].[hash:8][ext]',
        },
      },
      {
        test: /\.(js|ts)x?$/,
        include: getPath('../src'),
        exclude: /node_modules/, // 不编译node_modules下的文件
        use: ['babel-loader'],
      },
    ],
  },
}
