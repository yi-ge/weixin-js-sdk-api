export default {
  async get (ctx, next) {
    await this.model('weixinFileIdent').create({
      name: ctx.get('name'),
      content: ctx.get('content')
    })
    ctx.body = {
      status: 1
    }
    next()
  }
}
