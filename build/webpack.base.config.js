const path = require('path')
const webpack = require('webpack')

module.exports = {
    entry: {
        app: './src/app.js'
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
                include: [path.join(__dirname, '../src')]            
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.json', 'ejs'],
        alias: {
            '@': path.join(__dirname, 'src')           
        }
    }
}