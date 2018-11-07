import fs from 'fs'
import path from 'path'

export default {
  async get (ctx, next) {
    ctx.set('Content-Type', 'text/html;charset=utf-8')
    ctx.body = fs.createReadStream(path.join(__dirname, './index.html'))
    next()
  }
}
