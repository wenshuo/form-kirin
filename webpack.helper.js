const MiniCssExtractPlugin = require('mini-css-extract-plugin');

function cssLoaderOptions(cssModuleOptions, loaderOptions, useStyleLoader = false) {
  const finalLoader = useStyleLoader ? { loader: 'style-loader' } : {
    loader: MiniCssExtractPlugin.loader,
    options: {
      hmr: true
    }
  };

  return Object.assign({}, loaderOptions, {
    test: /\.scss$/,
    use: [
      finalLoader,
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

exports.cssLoaderConfig = (useStyleLoader = false) => ([
  cssLoaderOptions(false, { exclude: /\.module\.scss$/ }, useStyleLoader),
  cssLoaderOptions({
    mode: 'local',
    localIdentName: '[path][name]__[local]'
  }, {
    include: /\.module\.scss$/
  }, useStyleLoader)
]);
