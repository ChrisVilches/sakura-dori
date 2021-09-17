var appName = require('../package.json').name;
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const ASSETS_FOLDER = path.resolve(__dirname, '../src', 'assets');
const DIST_FOLDER = path.resolve(__dirname, '../dist');

module.exports = {
  name: appName,
  entry: [
    path.join(ASSETS_FOLDER, './app.js'),
    path.join(ASSETS_FOLDER, './styles.css')
  ],
  output: {
    path: DIST_FOLDER,
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      '@styles': path.join(ASSETS_FOLDER, 'stylesheets'),
      '@js': path.join(ASSETS_FOLDER, 'javascripts')
    }
  },
  module: {
    rules: [
      {
        test: /\.(css)$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(ASSETS_FOLDER, './images'),
          to: path.join(DIST_FOLDER, './images')
        }
      ]
    }),
    new MiniCssExtractPlugin({ filename: 'style.css' })
  ]
};
