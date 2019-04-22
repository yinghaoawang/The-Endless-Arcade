const path = require('path');

const currGameDir = './003-dope-wars'

module.exports = {
  mode: 'development',
  context: path.resolve(__dirname, 'public'),
  entry: currGameDir + '/src/app.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: currGameDir + '/build/bundle.js',
  },
};