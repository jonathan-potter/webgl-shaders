var path = require('path')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: './javascript/index',
  output: {
    path: __dirname,
    filename: 'build/bundle.js',
    sourceMapFilename: 'sourcemap'
  },
  resolve: {
    // Allow to omit extensions when requiring these files
    extensions: ['', '.js', '.jsx'],
    alias: {
      /* eslint-disable key-spacing */
      assets:            path.resolve(__dirname, 'assets'),
      css:               path.resolve(__dirname, 'css'),
      shaders:           path.resolve(__dirname, 'shaders'),
      javascript:        path.resolve(__dirname, 'javascript'),
      actions:           path.resolve(__dirname, 'javascript', 'actions'),
      components:        path.resolve(__dirname, 'javascript', 'components'),
      reducers:          path.resolve(__dirname, 'javascript', 'reducers'),
      utility:           path.resolve(__dirname, 'javascript', 'utility'),

      webgl:             path.resolve(__dirname, 'javascript', 'webgl'),
      'webgl-utilities': path.resolve(__dirname, 'javascript', 'webgl', 'utility')
      /* eslint-enable key-spacing */
    }
  },
  module: {
    loaders: [
      {
        test: /\.js$|.jsx$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.glsl$/,
        exclude: /node_modules/,
        loader: 'raw-loader'
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
      }
    ]
  },
  devtool: '#inline-source-map',
  plugins: [
    new ExtractTextPlugin('build/style.css', {
      allChunks: true
    })
  ]
}
