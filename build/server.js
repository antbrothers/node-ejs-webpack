const express = require('express');
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')

const app = express()
const config = require('./webpack.dev.config')
const compiler = webpack(config)

// 把wepack-dev-middleware当做一个中间件使用
// 把 webpack 处理后的文件,写入到内存中，并且传递给服务器(server)
app.use(webpackDevMiddleware(compiler, {    
    publicPath: config.output.publicPath
}))

// 热模块 中间件
var hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: false,
    heartbeat: 2000
})

// compilation对象代表了一次资源版本构建,当运行 webpack 开发环境中间件时，
// 每当检测到一个文件变化，就会创建一个新的 compilation，从而生成一组新的编译资源
// 当html-webpack-plugin template更改之后，强制刷新浏览器
compiler.plugin('compilation', function(compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function(data, cb) {
        hotMiddleware.publish({
            action: 'reload'
        })
        cb()
    })
})

app.use(hotMiddleware);

// 配置路由 解析 html

app.get('/:viewname?', function (req, res, next) {
    let viewname = req.params.viewname ? req.params.viewname + '.html' : 'index.html'    
    var filepath = path.join(compiler.outputPath, viewname);

    // 从内存中读取文件
    compiler.outputFileSystem.readFile(filepath, function(err, result) {
        if (err) {
            return next(err)
        }
        res.set('content-type', 'text/html');
        res.send(result);
        res.end();
    })
})


app.listen(3000, function() {
    console.log('Example app listening on port 3000!\n');
})