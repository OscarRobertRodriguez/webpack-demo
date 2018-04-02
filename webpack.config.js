const HtmlWebpackPlugin = require('html-webpack-plugin');
const SystemBellPlugin = require('system-bell-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const parts = require('./config/webpack.parts');
const merge = require('webpack-merge');
const path = require('path');
const glob = require('glob');
const FlowStatusWebpackPlugin = require('flow-status-webpack-plugin');

const PATHS = {
  app: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'dist'),
};

const commonConfig = merge([
  {
    plugins: [
      new HtmlWebpackPlugin({
        title: 'webpack demo',
        template: './src/index.html',
      }),
      new SystemBellPlugin(),
      new WebpackNotifierPlugin(),
      new FriendlyErrorsWebpackPlugin(),
    ],
  },
  parts.loadSVGS(),
  parts.loadJavaScript({ include: PATHS.app }),
]);

const productionConfig = merge([
  parts.clean(PATHS.build),
  parts.extractCSS({ use: ['css-loader', parts.autoprefix()] }),
  parts.loadFonts({
    options: {
      limit: 50000,
      name: './fonts/[name].[ext]',
      publicPath: '../',
    },
  }),
  parts.loadImages({
    options: {
      limit: 150,
      name: './images/[name].[ext]',
    },
  }),
  parts.purifyCSS({
    paths: glob.sync(`${PATHS.app}/**/*.js`, {
      nodir: true,
    }),
  }),
  parts.generateSourceMaps({
    type: 'source-map',
  }),
  {
    optimization: {
      splitChunks: {
        chunks: 'initial',
      },
    },
  },
]);

const developmentConfig = merge([
  {
    plugins: [new FlowStatusWebpackPlugin()],
  },
  parts.devServer,
  parts.loadCSS(),
  parts.loadImages(),
  parts.loadFonts({
    options: {
      limit: 50000,
    },
  }),
]);

module.exports = mode => {
  if (mode === 'production') {
    return merge(commonConfig, productionConfig, { mode });
  }
  return merge(commonConfig, developmentConfig, { mode });
};
