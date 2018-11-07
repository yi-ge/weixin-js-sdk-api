// import Util from '../utils'

const defaultOptions = {}

export default (options, app) => {
  options = Object.assign({}, defaultOptions, options)
  return (ctx, next) => {
    ctx.post = function (name, value) {
      return name ? this.request.body[name] : this.request.body
    }
    ctx.file = function (name, value) {
      return name ? ctx.request.body.files[name] : ctx.request.body.files
    }
    ctx.put = ctx.post
    ctx.get = function (name, value) {
      return name ? this.request.query[name] : this.request.query
    }
    ctx.params = function (name, value) {
      return name ? this.params[name] : this.params
    }
    return next()
  }
}
