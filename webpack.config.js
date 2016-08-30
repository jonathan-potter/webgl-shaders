var path = require('path');

module.exports = {
  entry: "./javascript/index",
  output: {
    path: __dirname,
    filename: "build/bundle.js",
    sourceMapFilename: "sourcemap"
  },
  resolve: {
    // Allow to omit extensions when requiring these files
    extensions: ['', '.js'],
    alias: {
      assets:     path.resolve(__dirname, 'assets'),
      javascript: path.resolve(__dirname, 'javascript'),
      shaders:    path.resolve(__dirname, 'shaders'),
      components: path.resolve(__dirname, 'javascript', 'components'),
      reducers:   path.resolve(__dirname, 'javascript', 'reducers'),
      utility:    path.resolve(__dirname, 'javascript', 'utility')
    }
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.glsl$/,
        exclude: /node_modules/,
        loader: "raw-loader"
      }
    ]
  },
  devtool: "#inline-source-map"
};
