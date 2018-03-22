const webpack = require('webpack');
const nodeEnv = process.env.NOED_ENV || 'production';

module.exports = {
   devtool: 'source-map',
   entry: {
      file: [
         './js/app.js'         
      ]
   },
   output: {
      filename: 'build/bundle.js'
   },
   module: {
      loaders: [
         {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
               presets: ['es2015-native-modules']
            }
         }
      ]
   },
   plugins: [
      // uglify js
      new webpack.optimize.UglifyJsPlugin({
         compress: { warnings: false },
         output: { comments: false },
         sourceMap: true
      }),
      // env plugin
      new webpack.DefinePlugin({
         'process.env': { NOED_ENV: JSON.stringify(nodeEnv)}
      })
   ]
}