const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

function cssLoaderOptions(cssModuleOptions, loaderOptions) {
  return Object.assign({}, loaderOptions, {
    test: /\.scss$/,
    use: [
      {
        loader: MiniCssExtractPlugin.loader,
        options: {
          hmr: true
        }
      },
      {
        loader: 'css-loader',
        options: {
          modules: cssModuleOptions,
          sourceMap: true,
          importLoaders: 2
        }
      },
      {
        loader: 'postcss-loader',
        options: {
          plugins: [
            require('autoprefixer')()
          ],
          sourceMap: true
        }
      },
      {
        loader: 'sass-loader',
        options: {
          implementation: require('node-sass'),
          sourceMap: true
        }
      }
    ]
  });
}

module.exports = {
  context: path.resolve(__dirname, '.'),
  entry: './app/js/examples/index',
  output: {
    filename: '[name].js',
    sourceMapFilename: '[name].map',
    path: path.resolve(__dirname, './public'),
    publicPath: '/'
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      cssLoaderOptions(false, { exclude: /\.module\.scss$/ }), // global css processing
      cssLoaderOptions({
        mode: 'local',
        localIdentName: '[path][name]__[local]'
      }, {
        include: /\.module\.scss$/
      }) // css module processing
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
  devtool: 'eval-source-map',
  mode: 'development',
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './app/template.hbs')
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
};
