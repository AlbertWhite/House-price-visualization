const path = require('path')
const webpack = require('webpack')

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
    contentBase: './',
    hot: true,
    publicPath: './dist'
  },
  mode: 'development',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [new webpack.HotModuleReplacementPlugin()] // https://webpack.js.org/guides/hot-module-replacement/
}
