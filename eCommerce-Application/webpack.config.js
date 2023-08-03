const webpack = require('webpack');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const EslingPlugin = require('eslint-webpack-plugin');

module.exports = (_env, options) => {
    const isProduction = options.mode === 'production';

    const config = {
        mode: isProduction ? 'production' : 'development',
        devtool: 'inline-source-map',
        watch: !isProduction,
        entry: ['./src/script'],
        resolve: {
            extensions: ['.ts', '.js', '.json'],
        },
        output: {
            path: path.join(__dirname, '/dist'),
            filename: 'script.js',
        },
        module: {
            rules: [
                { test: /\.ts$/i, use: 'ts-loader' },
                {
                    test: /\.css$/i,
                    use: ['style-loader', 'css-loader'],
                },
                {
                    test: /\.html$/i,
                    loader: 'html-loader',
                },
                {
                    test: /\.(png|jpe?g|gif|svg)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'img/[name][ext]',
                    },
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'fonts/[name][ext]',
                    },
                },
            ],
        },

        plugins: [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                template: './src/index.html',
            }),
            new EslingPlugin({ extensions: 'ts' }),
        ],
    };
    return config;
};
