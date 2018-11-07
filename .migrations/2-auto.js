'use strict'

var Sequelize = require('sequelize')

/**
 * Actions summary:
 *
 * addColumn "domain" to table "weixinJSSDKKey"
 *
 **/

var info = {
  'revision': 2,
  'name': 'auto',
  'created': '2018-11-01T10:43:03.602Z',
  'comment': ''
}

var migrationCommands = [
  { fn: 'addColumn',
    params: [
      'weixinJSSDKKey',
      'domain',
      { 'type': 'VARCHAR(255)', 'allowNull': false }
    ] }
]

module.exports = {
  pos: 0,
  up: function (queryInterface, Sequelize) {
    var index = this.pos
    return new Promise(function (resolve, reject) {
      function next () {
        if (index < migrationCommands.length) {
          let command = migrationCommands[index]
          console.log('[#' + index + '] execute: ' + command.fn)
          index++
          queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject)
        } else { resolve() }
      }
      next()
    })
  },
  info: info
}
