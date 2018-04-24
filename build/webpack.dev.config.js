const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const merge = require('webpack-merge')

const baseWebpackConfig = require('./webpack.base.config')

const glob = require('glob')

Object.keys(baseWebpackConfig.entry).forEach(function (name) {
    baseWebpackConfig.entry[name] = ['dev-client.js'].concat(baseWebpackConfig.entry[name])
})

function getEntry(globPath) {
    var entries = {},
        basename, tmp, pathname;

    glob.sync(globPath).forEach(function(entry) {
        basename = path.basename(entry, path.extname(entry));
        tmp = entry.split('/').splice(-3);
        pathname = tmp.splice(0, 1) + '/' + basename; // 正确输出js和html的路径
        entries[basename] = entry;
    });
    return entries;
}
const Entry = getEntry('./src/**/*.js')
const HtmlTpl =getEntry('./src/**/*.ejs')

const htmlConfig = () => {
    let config = []
    for (let attr in HtmlTpl) {
        config.push(
            new HtmlWebpackPlugin({
                filename: `./${attr}.html`,
                template: `${HtmlTpl[attr]}`,
                chunks: ['app', `${attr}`],
                inject: true
            })
        )
    }
    return config;
}

// module.exports = {
//     entry: {
//         app: './src/app.js'
//     },
//     output: {
//         filename: '[name].bundle.js',
//         path: path.resolve(__dirname, 'dist'),
//         publicPath: '/' //也会在服务器脚本用到，以确保文件资源能够在 http://localhost:3000 下正确访问
//     },
//     module: {
//         rules: [
//             {
//                 test: /\.ejs$/,
//                 loader: 'ejs-compiled-loader'
//             },
//         ]
//     },
//     plugins: [
//         new CleanWebpackPlugin(['dist']),
//         new HtmlWebpackPlugin({
//             template: './src/index.ejs',
//             filename: 'index.html'
//         })
//     ],
//     mode: 'development'
// }
module.exports = merge(baseWebpackConfig, {
    entry: Entry,
    devtool: '#cheap-module-eval-source-map',
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, '..', 'dist'),
        publicPath: '/' //也会在服务器脚本用到，以确保文件资源能够在 http://localhost:3000 下正确访问
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new webpack.NoEmitOnErrorsPlugin(),
    ].concat(htmlConfig()),
    mode: 'development'
})
