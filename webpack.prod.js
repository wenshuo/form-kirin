const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = {
  entry: {
    'form-kirin': './app/js/index.js'
  },
  context: path.resolve(__dirname, '.'),
  output: {
    path: path.resolve(__dirname, './dist'),
    library: 'formKirin'
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
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: false
            }
          },
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'local',
                localIdentName: '[name]__[local]'
              },
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
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  mode: 'production',
  devtool: 'source-map',
  externals: {
    react: {
      root: 'React',
      commonjs: 'react',
      commonjs2: 'react'
    }
  },
  target: 'web',
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    })
  ]
};

module.exports = [
  {
    ...config,
    output: {
      ...config.output,
      filename: '[name].umd.js',
      sourceMapFilename: '[name].umd.map',
      libraryTarget: 'umd'
    }
  },
  {
    ...config,
    output: {
      ...config.output,
      filename: '[name].cjs.js',
      sourceMapFilename: '[name].cjs.map',
      libraryTarget: 'commonjs2'
    }
  }
];
