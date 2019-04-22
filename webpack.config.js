const path = require('path');

const currGameDir = './003-dope-wars';

module.exports = {
  mode: 'development',
  context: path.resolve(__dirname, 'src'),
  entry: currGameDir + '/app.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: currGameDir + '/bundle.js',
  },
};