/**
 * COMMON WEBPACK CONFIGURATION
 */

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';

module.exports = options => ({
  entry: options.entry,
  output: Object.assign({ // Compile into build/bundle.js
    path: path.resolve(process.cwd(), 'build', 'bundle'),
    publicPath: '/',
  }, options.output), // Merge with env dependent settings
  module: {
    // Fix for webpack warnings about prebuilt javascript with localForage
    // https://github.com/localForage/localForage#browserify-and-webpack
    noParse: /node_modules\/localforage\/dist\/localforage.js/,
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [
          /node_modules/
        ],
        query: options.babelQuery,
        /*query: {
          presets: ['es2015', 'stage-0', 'react'],
          plugins: [
            'transform-decorators-legacy',
            'transform-class-properties'
          ]
        }*/
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader!postcss-loader'
      },
      {
        test: /\.less$/,
        loader: 'style-loader!css-loader!postcss-loader!less-loader!',
        exclude: [
          /node_modules/
        ]
      },
      { test: /\.json$/,
        loader: 'json-loader'
      },
      { test: /\.(png|jpg)$/,
        loader: 'url-loader?limit=8192' // inline base64 URLs for <=8k images, direct URLs for the rest
      },
      { test: /\.styl$/,
        loader: 'style-loader!css-loader!postcss-loader!stylus-loader'
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)(\?.*$|$)/,
        loader: 'url-loader?limit=1000000'
      },
      {
        test: /\.yaml$/,
        loader: 'json-loader!yaml-loader'
      },
      {
        test: /\.pug$/,
        loader: 'pug-loader',
      }
    ]
  },
  plugins: options.plugins.concat([
    // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
    // inside your code for any environment checks; UglifyJS will automatically
    // drop any unreachable code.
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),

    new webpack.NamedModulesPlugin(),

    // Generate HTML5 file from pug template
    new HtmlWebpackPlugin({
      inject: false,
      template: path.resolve(process.cwd(), 'template/index.html.pug'),
      bundleUrl: isDev ? 'http://localhost:8080/bundle.js' : 'bundle.js'
    })
  ]),
  resolve: {
    modules: ['src', 'node_modules'],
    extensions: [
      '.js',
      '.jsx',
      '.react.js',
    ],
    mainFields: [
      'browser',
      'jsnext:main',
      'main',
    ],
    
    // https://github.com/moment/moment/issues/1435#issuecomment-188084288
    alias: { moment: 'moment/moment.js' }
  },
  devtool: options.devtool,
  devServer: options.devServer,
  target: 'web', // Make web variables accessible to webpack, e.g. window
  performance: options.performance || {},
});
