export default {
  async get (ctx, next) {
    ctx.body = 'error'
    next()
  }
}
