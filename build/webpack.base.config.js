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
                loader: 'ejs-compiled-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src')]       
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