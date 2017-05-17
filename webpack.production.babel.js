/**
 * PRODUCTION WEBPACK CONFIGURATION
 */

const path = require('path');
const webpack = require('webpack');
// const CircularDependencyPlugin = require('circular-dependency-plugin');

const buildPath = path.resolve(__dirname, 'dist');
const appPath = path.resolve(__dirname, 'src', 'main.js');

const plugins = [
  /* new CircularDependencyPlugin({
    exclude: /a\.js|node_modules/, // exclude node_modules
    failOnError: false, // show a warning when there is a circular dependency
  }),*/
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production')
    }
  }),
  new webpack.optimize.UglifyJsPlugin()
];

module.exports = require('./webpack.base.babel')({
  // Add hot reloading in development
  entry: [
    appPath
    // App entry point
  ],

  // Tell babel that we want to hot-reload
  babelQuery: {
  },

  output: {
    // path: path.resolve(__dirname, 'build'),
    path: buildPath,
    filename: 'bundle.js',
    publicPath: './'
  },

  // Add development plugins
  plugins, // eslint-disable-line no-use-before-define
});
