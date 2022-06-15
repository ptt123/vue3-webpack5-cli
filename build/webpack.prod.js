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