const express = require('express');
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const path = require('path')
const fs = require("fs")
const merge = require('webpack-merge')

const app = express()
const config = process.argv[2] == 'development' ? require('./webpack.dev.config') : require('./webpack.pro.config')
const compiler = webpack(config)

app.use('/assets', express.static('src/assets'))


// 把wepack-dev-middleware当做一个中间件使用
// 把 webpack 处理后的文件,写入到内存中，并且传递给服务器(server)
app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
}))


if (process.argv[2] == 'development') {
    // 热模块 中间件
    var hotMiddleware = require('webpack-hot-middleware')(compiler, {
        log: false,
        heartbeat: 2000
    })   
    // compilation对象代表了一次资源版本构建,当运行 webpack 开发环境中间件时，
    // 每当检测到一个文件变化，就会创建一个新的 compilation，从而生成一组新的编译资源 
    // 当html-webpack-plugin template更改之后，强制刷新浏览器
    compiler.plugin('compilation', function (compilation) {
        compilation.plugin('html-webpack-plugin-after-emit', function (data) {
            hotMiddleware.publish({
                action: 'reload'
            })
        })
    })

    app.use(hotMiddleware);
}

// 获取目录结构
function walk(dir, _obj = {}, _key = '') {
    var _key = _key
    fs.readdirSync(dir).forEach(function (filename) {
        if (filename.indexOf('.') === -1) {
            _key = filename
        }
        var path = dir + "/" + filename
        var stat = fs.statSync(path)
        if (stat && stat.isDirectory()) {
            _obj[_key] = []
            walk(path, _obj, _key)
        }
        else {
            _obj[_key].push(path)
        }
    })
    return _obj
}
app.use('/get', express.Router().get('/menu', function (req, res, next) {
    var dir = 'src/components'
    var _compoents = walk(dir)
    res.send({ compoents: _compoents })
}))


// 配置路由 解析 html
// 如果要匹配更加复杂的路由，可以使用正则
app.get('/:page?', function (req, res, next) {
    let page = req.params.page;
    if (page === 'favicon.ico') {
        return next()
    } else {
        if (req.params.page.indexOf('.ejs') > -1) {
            page = req.params.page ? req.params.page.substr(0, req.params.page.length - 4) + '.html' : 'contentpage.html'
        } else {
            page = req.params.page ? req.params.page + '.html' : 'contentpage.html'
        }
    }
    var filepath = path.join(compiler.outputPath, page);
    console.log(filepath);

    // 从内存中读取文件
    compiler.outputFileSystem.readFile(filepath, function (err, result) {
        if (err) {
            return next(err)
        }
        res.set('content-type', 'text/html');
        res.send(result);
        res.end();
    })
})
app.listen(3001, function () {
    console.log('服务器已开启端口: 3001!\n');
})