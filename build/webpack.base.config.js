const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin') //从js中抽出css
function resolve(dir) {
    return path.join(__dirname, '..', dir)
}
module.exports = {
    entry: {
        app: path.resolve(__dirname, '..', 'src/app.js'),
        common: path.resolve(__dirname, '..' , 'src/verdors.js')
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
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader'
                        }
                    ]
                })
            },
            {
                test: /.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                modules: false,
                                camelCase: 'dashes',
                                minimize: true
                            }
                        },
                        {
                            loader: 'less-loader'
                        }
                    ]
                })
            },          
            {
                test: /\.(gif|jpe?g|png|svg|mp3|ttf)$/i,
                loader: "url-loader",
                include: [                 
                  path.resolve(__dirname, "./src/assets"),                
                ],
                query: {
                  limit: 5000,
                  name: '[name].[hash:16].[ext]'                 
                }
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