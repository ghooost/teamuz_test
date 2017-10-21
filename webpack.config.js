var CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractSass = new ExtractTextPlugin({
    filename: "[name]"
});
const path = require('path');

module.exports = {
  entry: {
    'styles.css':'./src/styles.scss',
    'testquest.js':"./src/testquest.js"
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
                  loader: "css-loader", options: { minimize: false }
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
      ])
  ]
};
