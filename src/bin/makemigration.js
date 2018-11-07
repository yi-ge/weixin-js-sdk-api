import migrate from 'auto-migrations'
import fs from 'fs'
import path from 'path'
import standard from 'standard'

// const beautify = require('js-beautify').js_beautify
const _ = require('lodash')

const options = {
  name: 'auto',
  comment: '',
  migrationsPath: '../../.migrations',
  modelsPath: '../models',
  preview: false,
  execute: true
}

const migrationsDir = path.join(__dirname, options['migrationsPath'])
const modelsDir = path.join(__dirname, options['modelsPath'])

if (!fs.existsSync(migrationsDir)) {
  fs.mkdirSync(migrationsDir)
}

// current state
const currentState = {
  tables: {}
}

// load last state
let previousState = {
  revision: 0,
  version: 1,
  tables: {}
}

try {
  previousState = JSON.parse(fs.readFileSync(path.join(migrationsDir, '_current.json')))
} catch (e) { }

// console.log(path.join(migrationsDir, '_current.json'), JSON.parse(fs.readFileSync(path.join(migrationsDir, '_current.json') )))

const sequelize = require(modelsDir).default.sequelize

const models = sequelize.models

currentState.tables = migrate.reverseModels(sequelize, models)

const actions = migrate.parseDifference(previousState.tables, currentState.tables)

// sort actions
migrate.sortActions(actions)

const migration = migrate.getMigration(actions)

if (migration.commandsUp.length === 0) {
  console.log('No changes found')
  process.exit(0)
}

// log migration actions
_.each(migration.consoleOut, (v) => { console.log('[Actions] ' + v) })

if (options.preview) {
  console.log('Migration result:')
  console.log(migration.commandsUp.join(', \n'))
  console.log(standard.lintTextSync('[ \n' + migration.commandsUp.join(', \n') + ' \n];\n', {
    fix: true
  }).results[0])
  console.log(standard.lintTextSync('[ \n' + migration.commandsUp.join(', \n') + ' \n];\n', {
    fix: true
  }).results[0].output)
  process.exit(0)
}

// backup _current file
if (fs.existsSync(path.join(migrationsDir, '_current.json'))) {
  fs.writeFileSync(path.join(migrationsDir, '_current_bak.json'),
    fs.readFileSync(path.join(migrationsDir, '_current.json'))
  )
}

// save current state
currentState.revision = previousState.revision + 1
fs.writeFileSync(path.join(migrationsDir, '_current.json'), JSON.stringify(currentState, null, 4))

// write migration to file
let info = migrate.writeMigration(currentState.revision,
  migration,
  migrationsDir,
  currentState.revision === 1 ? 'initial' : options.name,
  options.comment)

console.log(`New migration to revision ${currentState.revision} has been saved to file '${info.filename}'`)

if (options.execute) {
  migrate.executeMigration(sequelize.getQueryInterface(), info.filename, 0, (err) => {
    if (!err) { console.log('Migration has been executed successfully') } else { console.log('Errors, during migration execution', err) }
    process.exit(0)
  })
} else { process.exit(0) }
