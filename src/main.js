import Koa from 'koa'
import KoaBody from 'koa-body'
import fs from 'fs'
import path from 'path'
import jwt from 'koa-jwt'
import state from './middleware/state'
import resources, { redisClient } from './koa-file-router'
import controller from './middleware/controller'
import errorCatch from './middleware/errorCatch'

const app = new Koa()
const env = process.env.NODE_ENV || 'development' // Current mode

const fixture = path.resolve.bind(path, __dirname, 'controller')
const router = resources(fixture())

const publicKey = fs.readFileSync(path.join(__dirname, '../publicKey.pub'))

app.proxy = true

var server = require('http').createServer(app.callback())
const io = require('socket.io')(server)

io.on('connection', function (socket) {
  console.log('a user connected: ' + socket.id)
  socket.on('disconnect', function () {
    console.log('user disconnected:' + socket.id + '-' + socket.code)
    redisClient.del(socket.code)
  })

  socket.on('server', function (code) {
    console.log(code)
    socket.code = code
    redisClient.set(code, socket.id)
  })
})

app
  .use((ctx, next) => {
    ctx.io = io
    return next()
  })
  .use((ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*')
    ctx.set('Access-Control-Allow-Headers', 'Authorization, DNT, User-Agent, Keep-Alive, Origin, X-Requested-With, Content-Type, Accept, x-clientid')
    ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
    if (ctx.method === 'OPTIONS') {
      ctx.status = 200
      ctx.body = ''
    }
    return next()
  })
  .use(errorCatch)
  .use(jwt({
    secret: publicKey
  }).unless({
    path: [/\/|^\/+?\w+\.txt$|^\/public|^\/api\/weixin|^\/api\/public|test|\/user\/login|\/user\/token|\/assets/]
  }))
  .use(KoaBody({
    multipart: true,
    strict: false,
    formidable: {
      uploadDir: path.join(__dirname, '../assets/uploads/tmpfile')
    },
    jsonLimit: '10mb',
    formLimit: '10mb',
    textLimit: '10mb'
  }))
  .use(state({}))
  .use(controller({}))
  .use(router.routes())
  .use(router.allowedMethods())

if (env === 'development') { // logger
  app.use((ctx, next) => {
    const start = new Date()
    return next().then(() => {
      const ms = new Date() - start
      console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
    })
  })
}

const port = (env === 'development' ? 8362 : 8362)

console.log('Service Server...' + port)

server.listen(port)

export default app
