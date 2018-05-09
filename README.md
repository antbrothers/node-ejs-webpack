# node-ejs-webpack
```js
要求兼容到iE6,并且有SEO需求, 市面上一些MVVM 框架都不能用，只能用比较原始的 jquery, 
但是mvvm的开发模式实在有很爽，于是用node webpack ejs express 
配置了一个多页面应用程序，支持模块独立开发，模块预览，模块独立调试
技术栈: jquery webpack ejs node express 
```
```js
生成静态页面部署：1 npm run probuild
                2 把生成的dist 拷贝到服务器上即可
支持服务端渲染部署(把 css、html、js写入到内存): 1 把项目通过ftp上传到服务器
                  2  npm install
                  3 pm2 start ./build/server.js production
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "devbuild": "webpack --config ./build/webpack.dev.config.js",
    "probuild": "webpack --config ./build/webpack.pro.config.js",
    "server": "node ./build/server.js development",
    "pro": "node ./build/server.js production"
  }
```

```js
|---build
|   |--- dev-client.js                  // 热加载配置
|   |--- server.js                      // node 服务模块
|   |--- webpack.base.config.js         // webpack共用模块
|   |--- webpack.dev.config.js          // 开发配置
|   |--- webpack.pro.config.js          // 生产配置
|---dist                                // 打包后
|   |--- css
|   |--- js
|   |--- index.html                     // 首页
|   |--- banner.preview.html            // 组件预览页面
|---src
|   |--- assets                         // 静态资源
|   |--- components                     // 组件
|        |--- banner                    // 组件名称
|             |--- banner.js            // 组件js
|             |--- banner.ejs           // 组件模板
|             |--- banner.less          // 组件样式
|             |--- preview.ejs          // 组件预览模板
|   |--- app.js                         // 入口文件
|   |--- contentpage.ejs                // 开发环境下导航页面
|   |--- index.ejs                      // 首页
|   |--- verdors.js                     // 公共模块
|---package.json
```

##### 用webpack打包文件，并且使用webpack-dev-middlewear,把打包好的文件写入到内存
```js
// 把wepack-dev-middleware当做一个中间件使用
// 把 webpack 处理后的文件,写入到内存中，并且传递给服务器(server)
app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath
}))
```
##### 更加expree router 从内存中读取文件
```js
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
```

##### 配置热更新
```js
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
```

##### webapck.dev.config.js 遍历入口文件，无需手动写入，实现自动扫描
```js
function getEntry(globPath) {
    var entries = {},
        basename, tmp;

    glob.sync(globPath).forEach(function (entry) {
        basename = path.basename(entry, path.extname(entry));
        tmp = entry.split('/').splice(-3);
        // 为组件模块的 preview.ejs 重新命名
        if (path.extname(entry).indexOf('.ejs') > -1 && tmp[2].indexOf(tmp[1]) === -1 || path.extname(entry).indexOf('.js') > -1) {
            if (basename === 'preview') {
                entries[tmp[1] + '.preview'] = entry;
            } else {
                entries[basename] = entry;
            }
        }
    });
    return entries;
}
const Entry = getEntry('./src/components/**/*.js')
const HtmlTpl = getEntry('./src/**/*.ejs')
```

##### 项目导航 和组件预览图片
<img src="https://github.com/antbrothers/node-ejs-webpack/blob/master/src/assets/images/1525670168.jpg"/> <img src="https://github.com/antbrothers/node-ejs-webpack/blob/master/src/assets/images/1525670269.jpg"/>
##### 项目首页图片
<img src="https://github.com/antbrothers/node-ejs-webpack/blob/master/src/assets/images/1525670385.jpg"/>

