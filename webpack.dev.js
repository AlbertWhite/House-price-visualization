const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    index: './src/index.js'
  },
  module: {
    rules: [
      {
        test: /.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  devtool: 'inline-source-map',
  devServer: {
    // live reloading already works with dev server
    contentBase: './dist',
    hot: true // Hot module replacement,
  },
  mode: 'development',
  output: {
    filename: 'index.bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: 'House price visualization',
      template: 'index.html'
    }),
    new CopyPlugin([{ from: 'static', to: 'dist' }])
  ], // https://webpack.js.org/guides/hot-module-replacement/
  resolve: {
    extensions: ['.js', '.scss']
  }
}
