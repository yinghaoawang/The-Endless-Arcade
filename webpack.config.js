const path = require('path');

const jquery = path.join(__dirname, './lib/jquery@3.4.0/jquery.min.js')
const phaser3 = path.join(__dirname, './lib/phaser@3.16.2/phaser.min.js')

module.exports = {
  mode: 'development',
  context: path.resolve(__dirname, 'src'),
  entry: {
    //'001-asteroid-souls': './001-asteroid-souls/app.js',
    //'002-dog-souls': './002-dog-souls/app.js',
    //'003-dope-wars': './003-dope-wars/app.js',
    '004-plane': './004-plane/app.js',
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name]/bundle.js',
  },
  resolve: {
    alias: {
      'jquery': jquery,
      'phaser3': phaser3,
    }
  }
};