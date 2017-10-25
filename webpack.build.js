const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractSass = new ExtractTextPlugin({
    filename: "[name]"
});
const path = require('path');

module.exports = {
  entry: {
    'styles.css':'./src/styles.scss',
    'testquest.js':["babel-polyfill","./src/testquest.js"],
    'crnp.js':["babel-polyfill","./src/crnp.js"]
  },
  output: {
    filename: '[name]',
    path: path.resolve(__dirname, 'dst')
  },
  module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: 'babel-loader'
        },
        {
          test: /\.scss$/,
          use: extractSass.extract({
              use: [{
                  loader: "css-loader", options: { minimize: true }
              }, {
                  loader: "sass-loader"
              }]
          })
      }]
  },
  plugins: [
      extractSass,
      new CopyWebpackPlugin([
        { from: './src/index.html', to: 'index.html' }
      ]),
      new webpack.optimize.UglifyJsPlugin({
          compress: {
              warnings: false,
          },
          output: {
              comments: false,
          },
      })
  ]
};
