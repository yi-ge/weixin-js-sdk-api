const WechatAPI = require('co-wechat-api')

export default {
  async get (ctx, next) {
    const weixinJSSDKKey = this.model('weixinJSSDKKey')
    const domain = ctx.header.host.substring(0, ctx.header.host.indexOf('.abc.com')) // 根域名
    const result = await weixinJSSDKKey.findOne({
      where: {
        domain
      },
      order: [
        ['updatedAt', 'DESC']
      ]
    })
    if (result) {
      const APPID = result.APPID
      const APPSECRET = result.APPSECRET

      if (ctx.query.url) {
        const api = new WechatAPI(APPID, APPSECRET, async () => {
          // 传入一个获取全局token的方法
          let txt = null
          try {
            txt = await this.cache.get('weixin_' + APPID)
          } catch (err) {
            console.log(err)
            txt = '{"accessToken":"x","expireTime":1520244812873}'
          }
          return txt ? JSON.parse(txt) : null
        }, (token) => {
          // 请将token存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis等
          // 这样才能在cluster模式及多机情况下使用，以下为写入到文件的示例
          this.cache.set('weixin_' + APPID, JSON.stringify(token))
        })

        var param = {
          debug: false,
          jsApiList: [ // 需要用到的API列表
            'checkJsApi',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'hideMenuItems',
            'showMenuItems',
            'hideAllNonBaseMenuItem',
            'showAllNonBaseMenuItem',
            'translateVoice',
            'startRecord',
            'stopRecord',
            'onRecordEnd',
            'playVoice',
            'pauseVoice',
            'stopVoice',
            'uploadVoice',
            'downloadVoice',
            'chooseImage',
            'previewImage',
            'uploadImage',
            'downloadImage',
            'getNetworkType',
            'openLocation',
            'getLocation',
            'hideOptionMenu',
            'showOptionMenu',
            'closeWindow',
            'scanQRCode',
            'chooseWXPay',
            'openProductSpecificView',
            'addCard',
            'chooseCard',
            'openCard'
          ],
          url: decodeURIComponent(ctx.query.url)
        }

        ctx.body = {
          status: 1,
          result: await api.getJsConfig(param)
        }
        next()
      } else {
        ctx.body = {
          status: 10000,
          err: '未知参数'
        }
        next()
      }
    } else {
      ctx.body = ''
      next()
    }
  }
}
