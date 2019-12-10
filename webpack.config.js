const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  context: path.resolve(__dirname, '.'),
  entry: './app/js/index',
  output: {
    filename: '[name].js',
    sourceMapFilename: '[name].map',
    path: path.resolve(__dirname, './public'),
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  devServer: {
    port: 9000,
    contentBase: path.join(__dirname, './public'),
    historyApiFallback: true,
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  mode: 'development',
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './app/template.hbs')
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
};
