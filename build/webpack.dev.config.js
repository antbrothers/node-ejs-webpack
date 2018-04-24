const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
    entry: {
        app: './src/app.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/' //也会在服务器脚本用到，以确保文件资源能够在 http://localhost:3000 下正确访问
    },
    module: {
        rules: [
            {
                test: /\.ejs$/,
                loader: 'ejs-compiled-loader'
            },
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            template: './src/index.ejs',            
            filename: 'index.html'
        })
    ],
    mode: 'development'
}
