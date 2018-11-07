export default {
  async get (ctx, next) {
    const fileContent = await this.model('weixinFileIdent').findOne({
      where: {
        name: ctx.params('file')
      },
      order: [
        ['updatedAt', 'DESC']
      ]
    })

    ctx.set('Content-Type', 'text/plain; charset=utf-8')

    if (fileContent) {
      ctx.body = fileContent.content
      next()
    } else {
      ctx.body = ''
      next()
    }
  }
}
