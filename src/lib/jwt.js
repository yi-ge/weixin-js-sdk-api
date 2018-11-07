import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'

const publicKey = fs.readFileSync(path.join(__dirname, '../../publicKey.pub'))

export const checkAuth = (token) => {
  try {
    let decoded = jwt.verify(token.substr(7), publicKey)
    if (decoded.userInfo) {
      return {
        status: 1,
        result: {
          userInfo: decoded.userInfo
        }
      }
    } else {
      return {
        status: 403,
        result: {
          errInfo: '没有授权'
        }
      }
    }
  } catch (err) {
    return {
      status: 503,
      result: {
        errInfo: '解密错误'
      }
    }
  }
}
