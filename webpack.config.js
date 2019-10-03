const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const WebpackShellPlugin = require('webpack-shell-plugin')
require('dotenv').config()

module.exports = {
  entry: ['webpack/hot/poll?1000', './server/src/main.ts'],
  watch: true,
  target: 'node',
  externals: [
    nodeExternals({
      whitelist: ['webpack/hot/poll?1000'],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: {
          test: [/\spec.ts$/, /node_modules/],
        },
      },
    ],
  },
  mode: 'development',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new WebpackShellPlugin({
      onBuildEnd: ['node dist/main.js'],
    }),
  ],
  output: {
    path: `${__dirname}/dist`,
    publicPath: '/',
  },
}
