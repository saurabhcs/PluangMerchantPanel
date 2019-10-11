/*
 * created by aditya on 2019-08-24
*/

const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const environment = require('./environment');

const env = process.env.NODE_ENV || 'local';

const options = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: '[name].[contenthash].js'
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        port: 7082,
        historyApiFallback: true
    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader', 'eslint-loader']
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader']
            },
            {
                test: /\.sass$/,
                use: ['style-loader', 'css-loader', 'less-loader']
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: ['file-loader']
            },
            {
                test: /\.(ttf|eot|svg|woff(2)?)(\S+)?$/,
                loader: 'file-loader?publicPath=/&name=fonts/[name].[ext]'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve('./index.html'),
            API_BASE: environment[env].API_BASE
        })
    ]
};

if (env !== 'production') {
    options.devtool = 'inline-source-map';
}

module.exports = options;
