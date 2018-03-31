const HtmlWebpackPlugin = require('html-webpack-plugin');
const SystemBellPlugin = require('system-bell-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const parts = require('./config/webpack.parts');
const merge = require('webpack-merge');

const commonConfig = merge([
  {
    plugins: [
      new HtmlWebpackPlugin({
        title: 'webpack demo',
      }),
      new SystemBellPlugin(),
      new WebpackNotifierPlugin(),
      new FriendlyErrorsWebpackPlugin(),
    ],
  },
  parts.loadSCSS(),
]);

const productionConfig = merge([]);

const developmentConfig = merge([parts.devServer]);

module.exports = mode => {
  if (mode === 'production') {
    return merge(commonConfig, productionConfig, { mode });
  }
  return merge(commonConfig, developmentConfig, { mode });
};
