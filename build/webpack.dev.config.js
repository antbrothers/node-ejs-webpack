const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const merger = require('webpack-merge')

const baseWebpackConfig = require('./webpack.base.config')

const glob = require('glob')

Object.keys(baseWebpackConfig.entry).forEach(function (name) {
    baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

function getEntry(globPath) {
    var entries = {},
        basename, tmp;

    glob.sync(globPath).forEach(function (entry) {
        basename = path.basename(entry, path.extname(entry));
        tmp = entry.split('/').splice(-3);        
        if (basename === 'preview') {
            entries[tmp[1]+'.preview'] = entry;
        } else {
            entries[basename] = entry;
        }        
    });
    return entries;
}
const Entry = getEntry('./src/components/**/*.js')
const HtmlTpl = getEntry('./src/**/*.ejs')

const htmlConfig = () => {
    let config = []
    for (let attr in HtmlTpl) {
        if (attr === 'index') { // 首页
            config.push(
                new HtmlWebpackPlugin({
                    filename: `./${attr}.html`,
                    template: HtmlTpl[attr],
                    chunks: ['app'], // 选择要打包js 入口文件
                    chunksSortMode: 'dependency',
                    inject: true
                })
            )
        } else if (attr.indexOf('preview') > -1) { // 模块预览
            config.push(
                new HtmlWebpackPlugin({
                    filename: `./${attr}.html`,
                    template: HtmlTpl[attr],
                    chunks: [HtmlTpl[attr].split('/')[3]], // 预览模块js独立打包
                    chunksSortMode: 'dependency',
                    inject: true
                })
            )
        } else {
        }
    }
    return config;
}

var obj = merger(baseWebpackConfig, {
    entry: Entry,
    devtool: '#cheap-module-eval-source-map',
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '..', 'dist'),
        publicPath: '/' //也会在服务器脚本用到
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),  // 实现刷新浏览器
        new CleanWebpackPlugin(['dist']),
        new webpack.NoEmitOnErrorsPlugin(),
      
    ].concat(htmlConfig()),
    mode: 'development'
})
module.exports = obj
