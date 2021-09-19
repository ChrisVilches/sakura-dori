var appName = require('../package.json').name;
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const ASSETS_FOLDER = path.resolve(__dirname, '../src', 'assets');
const DIST_FOLDER = path.resolve(__dirname, '../dist');

module.exports = {
  name: appName,
  entry: {
    app: [path.join(ASSETS_FOLDER, './app.js'), path.join(ASSETS_FOLDER, './app.scss')],
    // Sadly creates a useless theme.js, but at least in production it's empty.
    theme: path.join(ASSETS_FOLDER, './stylesheets/theme.scss')
  },
  output: {
    path: DIST_FOLDER,
    filename: '[name].js',
    clean: true
  },
  resolve: {
    extensions: ['.js', '.scss', '.css'],
    alias: {
      '@node_modules': path.resolve(__dirname, '../node_modules'),
      '@styles': path.join(ASSETS_FOLDER, 'stylesheets'),
      '@js': path.join(ASSETS_FOLDER, 'javascripts')
    }
  },
  module: {
    rules: [
      {
        test: /\.scss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: 'defaults' }]
            ]
          }
        }
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
    new MiniCssExtractPlugin({
      filename: "[name].css"
    })
  ]
};
