/** 参考
 * https://github.com/dominicbarnes/koa-file-router/blob/master/index.js
 */
import inject, { client } from './inject'
import flatten from 'array-flatten'
import path from 'path'
import Router from 'koa-router'
import eachModule from 'each-module'
var debug = require('debug')('koa-file-router')

const methods = [
  'get',
  'post',
  'put',
  'head',
  'delete',
  'options',
  'data'
]

export const redisClient = client

export default (dir, options) => {
  if (!options) options = {}
  debug('initializing with options: %j', options)
  var router = new Router()
  return mount(router, discover(dir))
}

function discover (dir) {
  var resources = {
    params: [],
    routes: []
  }

  debug('searching %s for resources', dir)

  eachModule(dir, function (id, resource, file) {
    // console.log(id)
    // console.log(file)
    if (id.startsWith('_params')) {
      var name = path.basename(file, '.js')
      debug('found param %s in %s', name, file)
      resources.params.push({
        name: name,
        handler: resource.default
      })
    } else {
      methods.concat('all').forEach(function (method) {
        if (method in resource.default) {
          var url = path2url(id)
          debug('found route %s %s in %s', method.toUpperCase(), url, file)
          resources.routes.push({
            name: resource.name,
            url: url,
            method: method,
            handler: resource.default[method]
          })
        }
      })
    }
  })

  resources.routes.sort(sorter)

  return resources
}

function mount (router, resources) {
  resources.params.forEach(function (param) {
    debug('mounting param %s', param.name)
    router.param(param.name, param.handler)
  })

  let binds = {}
  resources.routes.forEach(function (route) {
    debug('mounting route %s %s', route.method.toUpperCase(), route.url)
    if (route.method === 'data') {
      binds = route.handler()
    }
  })

  resources.routes.forEach(function (route) {
    debug('mounting route %s %s', route.method.toUpperCase(), route.url)
    // console.log('mounting route %s %s', route.method.toUpperCase(), route.url)
    if (route.method !== 'data') {
      route.handler = route.handler.bind(Object.assign(binds, inject))
      let args = flatten([route.url, route.handler])
      if (route.method === 'get' && route.name) args.unshift(route.name)
      router[route.method].apply(router, args)
      // router[route.method](route.url, route.handler)
    }
  })

  // console.log(router)

  return router
}

function path2url (id) {
  var parts = id.split(path.sep)
  var base = parts[parts.length - 1]

  if (base === 'index') parts.pop()
  return '/' + parts.join('/')
}

function sorter (a, b) {
  var a1 = a.url.split('/').slice(1)
  var b1 = b.url.split('/').slice(1)

  var len = Math.max(a1.length, b1.length)

  for (var x = 0; x < len; x += 1) {
    // same path, try next one
    if (a1[x] === b1[x]) continue

    // url params always pushed back
    if (a1[x] && a1[x].startsWith(':')) return 1
    if (b1[x] && b1[x].startsWith(':')) return -1

    // normal comparison
    return a1[x] < b1[x] ? -1 : 1
  }
}
