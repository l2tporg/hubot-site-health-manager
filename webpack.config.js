const webpack = require('webpack')
const path = require('path')

const config = {
  context: path.resolve(__dirname, 'es6'),
  entry: {
    clinic: './clinic.js',
    NurseWithRedis: './NurseWithRedis.js'
  },
  output: {
    path: path.resolve(__dirname, 'src'),
    filename: '[name].js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      include: path.resolve(__dirname, 'src'),
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [
            ['es2015', { modules: false }]
          ]
        }
      }]
    }]
  }
}

module.exports = config;
