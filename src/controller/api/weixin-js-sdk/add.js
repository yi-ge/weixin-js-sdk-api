export default {
  async get (ctx, next) {
    await this.model('weixinJSSDKKey').create({
      domain: ctx.get('domain'),
      APPID: ctx.get('APPID'),
      APPSECRET: ctx.get('APPSECRET')
    })
    ctx.body = {
      status: 1,
      msg: '添加成功' // JS-SDK配置数据获取地址：/api/weixinJSSDK/get?APPID=' + ctx.get('APPID') + '&url='
    }
    next()
  }
}
