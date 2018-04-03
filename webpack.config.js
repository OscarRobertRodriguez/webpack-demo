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
      new SystemBellPlugin(),
      new WebpackNotifierPlugin(),
      new FriendlyErrorsWebpackPlugin(),
    ],
  },
  parts.loadSVGS(),
  parts.loadJavaScript({ include: PATHS.app }),
]);

const productionConfig = merge([
  {
    output: {
      publicPath: '/webpack-demo/',
      chunkFilename: '[name].[chunkhash:4].js',
      filename: '[name].[chunkhash:4].js',
    },
    recordsPath: path.join(__dirname, 'records.json'),
  },
  parts.clean(PATHS.build),
  parts.extractCSS({ use: ['css-loader', parts.autoprefix()] }),
  parts.minifyCSS({
    options: {
      discardComments: {
        removeAll: true,
      },
    },
  }),
  parts.loadFonts({
    options: {
      limit: 50000,
      name: './fonts/[name].[ext]',
      publicPath: '../',
    },
  }),
  parts.loadImages({
    options: {
      limit: 15000,
      name: './images/[name].[hash:4].[ext]',
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
      runtimeChunk: {
        name: 'manifest',
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
  const pages = [
    parts.page({ title: 'Webpack demo ', entry: { app: PATHS.app } }),
    parts.page({
      title: 'Another demo',
      path: 'another',
      entry: {
        another: path.join(PATHS.app, 'another.js'),
      },
    }),
  ];
  const config = mode === 'production' ? productionConfig : developmentConfig;
  return pages.map(page => merge(commonConfig, config, page, { mode }));
};
// if (mode === 'production') {
//   return merge(commonConfig, productionConfig, { mode });
// }
// return merge(commonConfig, developmentConfig, { mode });
