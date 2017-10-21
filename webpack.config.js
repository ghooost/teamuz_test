var CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractSass = new ExtractTextPlugin({
    filename: "[name]"
});
const path = require('path');

module.exports = {
  entry: {
    'styles.css':'./src/styles.scss',
    'quest.js':"./src/quest.js"
  },
  output: {
    filename: '[name]',
    path: path.resolve(__dirname, 'dst')
  },
  module: {
      rules: [{
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
