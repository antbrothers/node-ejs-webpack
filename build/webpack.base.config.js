const path = require('path')
const webpack = require('webpack')

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}
module.exports = {
    entry: {
        app: './src/app.js',
        verdors: './src/verdors.js'
    },
    module: {
        rules: [
            {
                test: /\.ejs$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'ejs-compiled-loader'
                }]
                
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src')]       
            },
            {
                test: /\.less$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "less-loader" // compiles Less to CSS
                }]
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.json', 'ejs'],
        alias: {
            '@': resolve('src'),     
        }
    }
}