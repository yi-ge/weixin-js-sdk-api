require('babel-register')
require('./' + (process.argv[2] || 'makemigration') + '.js')
