const baseConfig = require('./base.config')
const { merge } = require('webpack-merge')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
// const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = merge(baseConfig, {
  mode: 'production',
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
      new UglifyJsPlugin({
        uglifyOptions: {
          mangle: true,
          warnings: false,
          compress: {
            pure_getters: true,
            unsafe: true,
            unsafe_comps: true
          },
          output: {
            comments: false
          }
        },
        exclude: [/\.min\.js$/gi]
      })
    ]
  },
  plugins: [
    /* new ImageMinimizerPlugin({
      minimizerOptions: {
        plugins: [
          ['gifsicle', { interlaced: true }],
          ['jpegtran', { progressive: true }], // <--- Result image is larger than source (so don't use for now).
          ['optipng', { optimizationLevel: 5 }]
        ]
      }
    }) */
  ]
})
