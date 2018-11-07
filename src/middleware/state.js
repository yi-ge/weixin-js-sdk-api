import { checkAuth } from '../lib/jwt'

const defaultOptions = {}
export default (options, app) => {
  options = Object.assign({}, defaultOptions, options)
  return (ctx, next) => {
    const token = ctx.request.header.authorization
    const checkResult = checkAuth(token)
    if (!ctx.state) {
      ctx.state = {}
    }
    if (checkResult.status === 1) {
      ctx.state['userInfo'] = checkResult.result.userInfo
    }
    return next()
  }
}
