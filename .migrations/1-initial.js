'use strict'

var Sequelize = require('sequelize')

/**
 * Actions summary:
 *
 * createTable "weixinJSSDK", deps: []
 * createTable "weixinJSSDKKey", deps: []
 *
 **/

var info = {
  'revision': 1,
  'name': 'initial',
  'created': '2018-11-01T10:41:51.644Z',
  'comment': ''
}

var migrationCommands = [
  { fn: 'createTable',
    params: [
      'weixinJSSDK',
      {
        'id': { 'type': 'BIGINT UNSIGNED', 'autoIncrement': true, 'primaryKey': true, 'allowNull': false },
        'name': { 'type': 'VARCHAR(255)', 'allowNull': false },
        'content': { 'type': 'VARCHAR(255)', 'allowNull': true },
        'createdAt': { 'type': 'DATETIME', 'allowNull': false },
        'updatedAt': { 'type': 'DATETIME', 'allowNull': false },
        'deletedAt': { 'type': 'DATETIME' }
      },
      {}
    ] },
  { fn: 'createTable',
    params: [
      'weixinJSSDKKey',
      {
        'id': { 'type': 'BIGINT UNSIGNED', 'autoIncrement': true, 'primaryKey': true, 'allowNull': false },
        'APPID': { 'type': 'VARCHAR(255)', 'allowNull': false },
        'APPSECRET': { 'type': 'VARCHAR(255)', 'allowNull': true },
        'createdAt': { 'type': 'DATETIME', 'allowNull': false },
        'updatedAt': { 'type': 'DATETIME', 'allowNull': false },
        'deletedAt': { 'type': 'DATETIME' }
      },
      {}
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
