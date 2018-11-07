const gulp = require('gulp')
const eslint = require('gulp-eslint')
const nodemon = require('gulp-nodemon')
const friendlyFormatter = require('eslint-friendly-formatter')
const childProcess = require('child_process')

var jsScript = 'node'
if (process.env.npm_config_argv !== undefined && process.env.npm_config_argv.indexOf('debug') > 0) {
  jsScript = 'node debug'
}

function lintOne (aims) {
  console.log('ESlint:' + aims)
  console.time('Finished eslint')
  return gulp.src(aims)
    .pipe(eslint({configFile: './.eslintrc.js'}))
    .pipe(eslint.format(friendlyFormatter))
    .pipe(eslint.results(results => {
      // Called once for all ESLint results.
      console.log(`- Total Results: ${results.length}`)
      console.log(`- Total Warnings: ${results.warningCount}`)
      console.log(`- Total Errors: ${results.errorCount}`)
      console.timeEnd('Finished eslint')
    }))
}

function autoMigration (aims) {
  aims.forEach((aim) => {
    if (aim.indexOf('/models/') !== -1) {
      console.log('更新Model')
      childProcess.exec('node_modules/.bin/cross-env NODE_ENV=development node src/bin/index.js makemigration', function (error, stdout, stderr) {
        if (error) {
          console.error(`exec error: ${error}`)
          return
        }
        console.log(`更新Model结果:\n ${stdout}`)
        if (stderr) {
          console.log(`stderr: ${stderr}`)
        }
      })
    }
  })
}

gulp.task('ESlint', () => {
  return gulp.src(['src/**/*.js', '!node_modules/**', '!assets/**'])
    .pipe(eslint({configFile: './.eslintrc.js'}))
    .pipe(eslint.format(friendlyFormatter))
    // .pipe(eslint.failAfterError())
    .pipe(eslint.results(results => {
      // Called once for all ESLint results.
      console.log(`- Total Results: ${results.length}`)
      console.log(`- Total Warnings: ${results.warningCount}`)
      console.log(`- Total Errors: ${results.errorCount}`)
    }))
})

gulp.task('ESlint_nodemon', ['ESlint'], function () {
  var stream = nodemon({
    script: 'index.js',
    execMap: {
      js: jsScript
    },
    tasks (changedFiles) {
      lintOne(changedFiles)
      autoMigration(changedFiles)
      return []
    },
    verbose: true,
    ignore: ['build/*.js', 'dist/*.js', 'nodemon.json', '.git', 'node_modules/**/node_modules', 'gulpfile.js', 'assets/**'],
    env: {
      NODE_ENV: 'development'
    },
    ext: 'js json'
  })

  return stream
    .on('restart', function () {
      // console.log('Application has restarted!')
    })
    .on('crash', function () {
      console.error('Application has crashed!\n')
      // stream.emit('restart', 20)  // restart the server in 20 seconds
    })
})

gulp.task('nodemon', function () {
  return nodemon({
    script: 'index.js',
    execMap: {
      js: jsScript
    },
    verbose: true,
    ignore: ['build/*.js', 'dist/*.js', 'nodemon.json', '.git', 'node_modules/**/node_modules', 'gulpfile.js', 'assets/**'],
    env: {
      NODE_ENV: 'development'
    },
    ext: 'js json'
  })
})

gulp.task('default', ['ESlint', 'ESlint_nodemon'], function () {
  // console.log('ESlin检查完成')
})
