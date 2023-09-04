const webpack = require('webpack');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const EslingPlugin = require('eslint-webpack-plugin');
const { merge } = require('webpack-merge');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (_env, options) => {
    const isProduction = options.mode === 'production';

    const config = {
        mode: isProduction ? 'production' : 'development',
        devtool: 'inline-source-map',
        entry: isProduction ? ['./src/script', './src/script-gh-spa.js'] : ['./src/script'],
        resolve: {
            extensions: ['.ts', '.js', '.json'],
        },
        output: {
            path: path.join(__dirname, '/dist'),
            filename: 'script.js',
            publicPath: isProduction ? '/eCommerce-sprint2-deploy/' : '/',
        },
        module: {
            rules: [
                { test: /\.ts$/i, use: 'ts-loader' },
                {
                    test: /\.scss$/i,
                    use: ['style-loader', 'css-loader', 'sass-loader'],
                },
                {
                    test: /\.html$/i,
                    loader: 'html-loader',
                },
                {
                    test: /\.(png|jpe?g|gif)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: './img/[name][ext]',
                    },
                },
                {
                    test: /\.svg$/i,
                    type: 'asset/source',
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
                filename: 'index.html',
                template: './src/index.html',
            }),
            new EslingPlugin({ extensions: 'ts' }),
            new FaviconsWebpackPlugin('./src/assets/icons/fav-icon.svg'),
            new CopyWebpackPlugin({
                patterns: [
                  {
                    from: path.resolve(__dirname, './src/assets/img/category'),
                    to: path.resolve(__dirname, './dist/img/category')
                  }
                ]
              })
        ],
    };

    if (isProduction) {
        config.plugins.push(
            new HtmlWebpackPlugin({
                filename: '404.html',
                template: './src/404.html',
            })
        );
    }

    if (!isProduction) {
        const envConfig = require('./webpack.dev.config');
        return merge(config, envConfig);
    }

    return config;
};
