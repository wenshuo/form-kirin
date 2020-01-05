const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ProdConfig = require('./webpack.prod.js');

const config = Object.assign({}, ProdConfig);
config.plugins.push(new BundleAnalyzerPlugin());

module.exports = config;
