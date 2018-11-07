import utils from './lib/utils'
import { Redis } from './config'
import redis from 'redis'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'
import Sequelize from 'sequelize'
import jwt from 'jsonwebtoken'

const publicKey = fs.readFileSync(path.join(__dirname, '../publicKey.pub'))

export const client = redis.createClient(Redis)

const getAsync = promisify(client.get).bind(client)

const modelsDir = path.join(__dirname, './models')
const sequelize = require(modelsDir).default.sequelize
const models = sequelize.models

export default {
  $utils: utils,
  Model: Sequelize,
  model (val) {
    return models[val]
  },
  /**
   * send success data
   */
  success (data, status = 1, msg) {
    return {
      status,
      msg,
      result: data
    }
  },
  /**
   * send fail data
   */
  fail (data, status = 10000, msg) {
    return {
      status,
      msg,
      result: data
    }
  },
  /**
   * 通过Redis进行缓存
   */
  cache: {
    set (key, val, ex) {
      if (ex) {
        client.set(key, val, 'PX', ex)
      } else {
        client.set(key, val)
      }
    },
    get (key) {
      return getAsync(key)
    }
  },
  /**
   * 深拷贝对象、数组
   * @param  {[type]} source 原始对象或数组
   * @return {[type]}        深拷贝后的对象或数组
   */
  deepCopy (o) {
    if (o === null) {
      return null
    } else if (Array.isArray(o)) {
      if (o.length === 0) {
        return []
      }
      let n = []
      for (let i = 0; i < o.length; i++) {
        n.push(this.deepCopy(o[i]))
      }
      return n
    } else if (typeof o === 'object') {
      let z = {}
      for (let m in o) {
        z[m] = this.deepCopy(o[m])
      }
      return z
    } else {
      return o
    }
  },
  async updateToken (userGUID, expiresIn = '365d') {
    const userInfo = await models['user'].findOne({
      where: {
        userGUID
      }
    })

    models['userLog'].create({
      userGUID: userInfo.userGUID,
      type: 'update'
    })

    const token = jwt.sign({
      userInfo
    }, publicKey, {
      expiresIn
    })

    return token
  },

  decodeToken (token) {
    return jwt.verify(token.substr(7), publicKey)
  }
}
