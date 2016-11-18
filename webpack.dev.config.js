const autoprefixer = require('autoprefixer');
const path = require('path');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const buildPath = path.resolve(__dirname, 'public', 'build');
const mainPath = path.resolve(__dirname, 'src', 'main.js');

module.exports = {
  context: __dirname,
  progress: true,
  entry: mainPath,
  output: {
    // path: path.resolve(__dirname, 'build'),
    path: buildPath,
    filename: 'bundle.js',
    publicPath: '/build/'
  },
  resolve: {
    resolve: { fallback: path.join(__dirname, 'node_modules') },
    resolveLoader: { fallback: path.join(__dirname, 'node_modules') },
    extensions: ['', '.js', '.json', '.less'],
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [
          /node_modules/
        ],
        query: {
          presets: ['es2015', 'stage-0', 'react'],
          plugins: [
            'transform-decorators-legacy',
            'transform-class-properties'
          ]
        }
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
        loader: 'url-loader?limit=10000'
      },
      {
        test: /\.yaml$/,
        loader: 'json-loader!yaml-loader'
      }
    ]
  },
  postcss: function () {
    return [
      autoprefixer({
        browsers: ['last 2 version']
      })
    ];
  },
  plugins: [
    new ProgressBarPlugin()
  ]
};
