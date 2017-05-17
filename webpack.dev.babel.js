/**
 * DEVELOPMENT WEBPACK CONFIGURATION
 */

const path = require('path');
// const fs = require('fs');
const webpack = require('webpack');
// const HtmlWebpackPlugin = require('html-webpack-plugin');

// Enable to debug circular dependencies
// const CircularDependencyPlugin = require('circular-dependency-plugin');

const buildPath = path.resolve(__dirname, 'dist');
const appPath = path.resolve(__dirname, 'src', 'main.js');

const plugins = [
  new webpack.HotModuleReplacementPlugin(),
  // Tell webpack we want hot reloading

  new webpack.NamedModulesPlugin(),
  // prints more readable module names in the browser console on HMR updates

  // new webpack.NoErrorsPlugin(),

  // // Enable to debug circular dependencies
  /*new CircularDependencyPlugin({
    exclude: /a\.js|node_modules/, // exclude node_modules
    failOnError: false, // show a warning when there is a circular dependency
  }),*/
];

module.exports = require('./webpack.base.babel')({
  // Add hot reloading in development
  entry: [
    'react-hot-loader/patch',
    // activate HMR for React

    'webpack-dev-server/client?http://localhost:8080',
    // bundle the client for webpack-dev-server
    // and connect to the provided endpoint

    'webpack/hot/only-dev-server',
    // bundle the client for hot reloading
    // only- means to only hot reload for successful updates

    appPath
    // App entry point
  ],

  // Tell babel that we want to hot-reload
  babelQuery: {
    // require.resolve solves the issue of relative presets when dealing with
    // locally linked packages. This is an issue with babel and webpack.
    // See https://github.com/babel/babel-loader/issues/149 and
    // https://github.com/webpack/webpack/issues/1866
    presets: ['babel-preset-react-hmre'].map(require.resolve),
  },

  output: {
    // path: path.resolve(__dirname, 'build'),
    path: buildPath,
    filename: 'bundle.js',
    publicPath: '/'
  },

  // Add development plugins
  plugins, // eslint-disable-line no-use-before-define

  // devtool: 'inline-source-map',

  devServer: {
    hot: true,
    // enable HMR on the server

    contentBase: buildPath,
    // match the output path

    publicPath: '/',
    // Match the output of 'publicPath'

    historyApiFallback: true
  },

  performance: {
    hints: false,
  },
});
