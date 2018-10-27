var path = require('path');
var webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: {
    app: [
      'babel-polyfill',
      path.resolve(__dirname, 'src/client/index.js')
    ]
  },
  devtool: 'source-map',
  resolveLoader: {
    moduleExtensions: ['-loader']
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  output: {
    path: __dirname + '/dist',
    filename: 'client.js'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env':{
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.OccurrenceOrderPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        loader: "babel",
        query:{
          presets: ['react', 'env']
        }
      }
    ]
  }
};
