const HtmlWebPackPlugin = require( 'html-webpack-plugin' );
const path = require( 'path' );
const Dotenv = require('dotenv-webpack');
module.exports = {
  context: __dirname,
  entry: ['babel-polyfill', './src/ts/index.tsx'],
  output: {
      path: path.resolve( __dirname, 'dist' ),
      filename: 'main.js',
      publicPath: '/',
  },
  devServer: {
      historyApiFallback: true
  },
  module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
              loader: 'babel-loader'
          }
        },
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader']
        },
        {
          test: /\.(png|j?g|svg|gif)?$/,
          use: 'file-loader'
        },
        {
          test: /\.(ts|tsx)$/,
          loader: "ts-loader",
        },
      ]
  },
  resolve: {
      extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
  },
  devtool: 'source-map',
  plugins: [
      new HtmlWebPackPlugin({
        template: path.resolve( __dirname, 'public/index.html' ),
        filename: 'index.html'
      }),
      new Dotenv()
  ]
};