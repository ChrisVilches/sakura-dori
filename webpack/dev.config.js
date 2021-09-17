const baseConfig = require('./base.config');
const { merge } = require('webpack-merge');

module.exports = merge(baseConfig, {
  mode: 'development',
  watch: true, // TODO: USE THIS? OR DEVSERVER? OR BOTH?
  devtool: 'eval-source-map',
  devServer: {
    hot: false,
    client: false
  }
});
