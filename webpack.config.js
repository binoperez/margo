const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const env = require('yargs').argv.env;
const HtmlWebPackPlugin = require('html-webpack-plugin');
const express = require('express')

let libraryName = 'Library';
let plugins = [], outputFile;


plugins.push(new HtmlWebPackPlugin({
    template: './client/index.html',
    filename: 'index.html',
    inject: 'body'
}))

if (env === 'build') {
  plugins.push(new UglifyJsPlugin({ minimize: true }));
  outputFile = libraryName + '.min.js';
} else {
  outputFile = libraryName + '.js';
}

module.exports = {
    entry: './client/index.js',
    output: {
        path : path.join(__dirname, './dist'),
        filename: outputFile,
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    devtool: 'source-map',
    module:{
        loaders:[
            { 
                test: /\.js$/, 
                loader: 'babel-loader', 
                exclude: /node_modules/,
                query: {
                    presets:[ 'es2015', 'react', 'stage-2' ]
                } 
            },
            { 
                test: /\.jsx$/, 
                loader: 'babel-loader',
                exclude: /node_modules/ ,
                query: {
                    presets:[ 'es2015', 'react', 'stage-2' ]
                }
            },
            {
                test: /\.scss$/,
                loaders: [ 'style-loader', 'css-loader?sourceMap', 'sass-loader?sourceMap' ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                loader: "file-loader"
            }
        ]
    },
    resolve: {
        modules: [path.resolve('./node_modules'), path.resolve('./dist')],
        extensions: ['.json', '.js']
    },
    plugins: plugins    
}