
export default (ctx, next) => {
  return next().catch((err) => {
    if (ctx.method === 'OPTIONS') {
      // ctx.status = 200
      // ctx.body = ''
    } else {
      switch (err.status) {
        case 401:
          ctx.status = 200
          ctx.body = {
            status: 401,
            err: 'Authentication Error',
            result: 'Protected resource, use Authorization header to get access.'
          }
          break
        default:
          throw err
      }
    }
  })
}
