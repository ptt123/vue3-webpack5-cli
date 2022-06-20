// webpack.config.js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader/dist/index')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // 提取js中的css文件

module.exports = {
  entry: ['@babel/polyfill', path.resolve(__dirname, '../src/main.ts')], // 打包入口
  output: {
    path: path.resolve(__dirname, '../dist'), // 打包y出口
    filename: 'js/[name].[hash:8].js', // 打包完的静态资源文件名
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'), // 我们要使用的 html 模板地址
      filename: 'index.html', // 打包后输出的文件名
      title: '从0到1手搭Vue开发环境', // index.html 模板内，通过 <%= htmlWebpackPlugin.options.title %> 拿到的变量
    }),
    new CleanWebpackPlugin(),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash:8].css',
      chunkFilename: '[id].css',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'),
      vue: 'vue/dist/vue.runtime.esm-browser.js',
    },
    // 尝试按顺序解析这些后缀名。如果有多个文件有相同的名字，但后缀名不同，webpack 会解析列在数组首位的后缀的文件 并跳过其余的后缀。
    extensions: ['', '.js', '.jsx', '.ts', '.tsx'],
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
          filename: 'img/[name][hash:8][ext]',
        },
      },
      {
        test: /\.(js|ts)x?$/,
        exclude: /node_modules/, // 不编译node_modules下的文件
        use: ['babel-loader'],
      },
    ],
  },
}
