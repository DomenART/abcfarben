const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  entry: {
    main: [
      path.join(__dirname,'resources/assets/app/js','app.js'),
      path.join(__dirname,'resources/assets/app/less','app.less'),
    ],
    admin: [
      path.join(__dirname,'resources/assets/admin/js','app.js'),
      path.join(__dirname,'resources/assets/admin/less','app.less'),
    ]
  },

  output: {
    path: path.join(__dirname, 'public/'),
    filename: '[name].js'
  },

  mode: process.env.NODE_ENV || 'development',

  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.(css|less)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      },
      {
        test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
        loaders: ['file-loader']
      },
    ]
  },

  optimization: {
    minimizer: [
      new MinifyPlugin(),
      new OptimizeCSSAssetsPlugin()
    ]
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
  ]
};