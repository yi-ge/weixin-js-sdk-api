import Chance from 'chance'
import iconv from 'iconv-lite'
import uuidv4 from 'uuid/v4'
import JsSHA from 'jssha'

const chance = new Chance()

export const uuid = (version = 'v4') => {
  return uuidv4()
}

/**
 * 数字高位补0
 * @param  {int} num  数字
 * @param  {int} size 指定数字位数
 * @return {string}   返回用0补足指定位数的数字字符串
 */
export const preZeroFill = (num, size) => Array(Math.abs(('' + num).length - ((size || 2) + 1))).join(0) + num

/**
 * 获取指定位数的整数随机数
 * @param  {int} size 位数
 * @return {string}     定位数的整数随机数字符串
 */
export const getIntRandom = (size) => preZeroFill(chance.integer({
  min: 0,
  max: Array(size + 1).join(9)
}), size)

/**
 * 截取字符串，多余的部分用...代替
 * @param {string} str 字符串
 * @param {int} len 欲截取的字符串长度
 */
export const setString = (str, len) => {
  let StrLen = 0
  let s = ''
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 128) {
      StrLen += 2
    } else {
      StrLen++
    }
    s += str.charAt(i)
    if (StrLen >= len) {
      return s + '...'
    }
  }
  return s
}

// 数组去重
export const HovercUnique = (arr) => {
  const n = {}
  const r = []
  for (var i = 0; i < arr.length; i++) {
    if (!n[arr[i]]) {
      n[arr[i]] = true
      r.push(arr[i])
    }
  }
  return r
}

// 获取json长度
export const getJsonLength = (jsonData) => {
  var arr = []
  for (var item in jsonData) {
    arr.push(jsonData[item])
  }
  return arr.length
}

/**
 * IP转换为INTEGER
 * @param ip
 * @returns {number}
 */
export const ipToInt = (ip) => {
  const REG = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
  const result = REG.exec(ip)
  if (!result) return 0
  return (parseInt(result[1]) << 24 |
    parseInt(result[2]) << 16 |
    parseInt(result[3]) << 8 |
    parseInt(result[4])) >>> 0
}

/**
 * INTEGER转换为IP
 * @param INT
 * @returns {string}
 */
export const intToIp = (INT) => {
  if (INT < 0 || INT > 0xFFFFFFFF) {
    throw new Error('The number is not normal!')
  }
  return (INT >>> 24) + '.' + (INT >> 16 & 0xFF) + '.' + (INT >> 8 & 0xFF) + '.' + (INT & 0xFF)
}

/**
 * 格式化时间
 * @param date
 * @param fmt
 * @returns {*}
 */
export const formatDate = (date, fmt) => {
  !(date instanceof Date) && (date = new Date(date))
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
  }
  return fmt
}

/**
 * 生成Id 临时 不建议用
 * @returns {number}
 */
export const generateId = () => {
  return new Date().getTime() + parseInt(Math.random() * 10000)
}

const pad = (number, length, pos) => {
  let str = '%' + number
  while (str.length < length) {
    // 向右边补0
    if (pos === 'r') {
      str = str + '0'
    } else {
      str = '0' + str
    }
  }
  return str
}

const toHex = (chr, padLen) => {
  if (padLen === null) {
    padLen = 2
  }
  return pad(chr.toString(16), padLen)
}

/***
 * 转换字符串编码为GB2312.
 * @param data
 * @returns {string}
 */
export const chinese2Gb2312 = (data) => {
  const gb2312 = iconv.encode(data.toString('UCS2'), 'GB2312')
  let gb2312Hex = ''
  for (let i = 0; i < gb2312.length; ++i) {
    gb2312Hex += toHex(gb2312[i])
  }
  return gb2312Hex.toUpperCase()
}

/**
 * 根据含义字符串换算对应的毫秒数
 * @param  {[type]} str 字符串
 * @return {[type]}     ms
 */
export const getsec = function (str) {
  if (/[s|h|d|l]/i.test(str)) {
    var str1 = str.substring(0, str.length - 1)
    var str2 = str.substring(str.length - 1, str.length)
    if (str2 === 's') {
      return str1 * 1000
    } else if (str2 === 'h') {
      return str1 * 60 * 60 * 1000
    } else if (str2 === 'd') {
      return str1 * 24 * 60 * 60 * 1000
    }
  } else {
    if (str.indexOf('l') === -1) {
      return str * 1000
    } else {
      return 30 * 24 * 60 * 60 * 1000
    }
  }
}

/**
 * 将json按一定规律组合成父子模式
 * @param  {[type]} data                        json数据
 * @param  {Number} [maxPid=0]                  最大的儿子ID（可能不是0，最大的是几就填几，就从几开始排）
 * @param  {String} [IDString='ID']             ID的别名
 * @param  {String} [pidString='pid']           父ID的别名
 * @param  {String} [childrenString='children'] 生成的子的别名（子的数据就在这个名称下）
 * @return {[type]}                             父子JSON
 */
export const toTreeData = (data, minPid = 0, IDString = 'ID', pidString = 'pid', childrenString = 'children') => {
  const pos = {}
  const tree = []
  let n = 0

  while (data.length !== 0) {
    if (data[n][pidString] === minPid) {
      data[n].children = []
      tree.push(data[n])
      pos[data[n][IDString]] = [tree.length - 1]
      data.splice(n, 1)
      n--
    } else {
      const posArray = pos[data[n][pidString]]
      if (posArray !== undefined) {
        let obj = tree[posArray[0]]
        for (let j = 1; j < posArray.length; j++) {
          obj = obj.children[posArray[j]]
        }
        data[n].children = []
        obj.children.push(data[n])
        pos[data[n][IDString]] = posArray.concat([obj.children.length - 1])
        data.splice(n, 1)
        n--
      }
    }
    n++
    if (n > data.length - 1) {
      n = 0
    }
  }
  return tree
}

/**
 * 对象比较器
 * 使用方法：data.sort(compare("对象名称")) 在对象内部排序，不生成副本
 * @param  {[type]} propertyName 要排序的对象的子名称（限一级）
 * @return {[type]}              排序规则
 */
export const compare = (propertyName) => {
  return function (object1, object2) {
    var value1 = object1[propertyName]
    var value2 = object2[propertyName]
    if (value2 < value1) {
      return -1
    } else if (value2 > value1) {
      return 1
    } else {
      return 0
    }
  }
}

/**
 * 深拷贝对象、数组
 * @param  {[type]} source 原始对象或数组
 * @return {[type]}        深拷贝后的对象或数组
 */
export const deepCopy = function (o) {
  if (Array.isArray(o)) {
    var n = []
    for (var i = 0; i < o.length; ++i) {
      n[i] = deepCopy(o[i])
    }
    return n
  } else if (typeof o === 'object') {
    var z = {}
    for (var m in o) {
      z[m] = deepCopy(o[m])
    }
    return z
  } else {
    return o
  }
}

/**
 * 判断对象是否为空
 * @param  {[type]}  e [对象]
 * @return {Boolean}   [bool]
 */
export const isEmptyObject = (e) => {
  for (const t in e) {
    return !1
  }
  return !0
}

export const checkIP = (ip) => {
  const re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/
  if (re.test(ip)) {
    if (RegExp.$1 < 256 && RegExp.$2 < 256 && RegExp.$3 < 256 && RegExp.$4 < 256) {
      return true
    }
  }
  return false
}

/**
 * 获取用户IP地址
 * 这是一个并非可靠的函数，仅适用于koa2，并且必须配置Nginx的 proxy_set_header X-Real-IP $remote_addr; 。
 * @param  {[type]} ctx [description]
 * @return {[type]}     [description]
 */
export const getUserIP = (ctx) => {
  const ip = ctx.headers['x-real-ip'] || ctx.headers['remote-host'] || ctx.headers['x-forwarded-for']
  if (checkIP(ip)) {
    return ip
  } else {
    return '123.12.12.123'
  }
}

/**
 * 随机生成密码
 * @param {number} length 密码长度
 * @param {Array<String>} config 密码包含字符 'abc'|'ABC'|'number'|'symbol'
 */
export const createPassword = (length, config = ['abc', 'ABC', 'number']) => {
  const dictionary = {
    abc: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
    ABC: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    number: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    symbol: ['~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '=', '+', '_', ',', '.', '/', '<', '>', '?', ';', ':', '\'', '"', '[', ']', '{', '}', '\\', '|']
  }

  const selectedDictionary = []
  config.forEach(con => {
    if (dictionary[con]) {
      selectedDictionary.push(dictionary[con])
    }
  })

  let psw = ''
  const dicLength = selectedDictionary.length
  for (let i = 0; i < length; i++) {
    const dp = Math.floor(Math.random() * dicLength)
    const wp = Math.floor(Math.random() * selectedDictionary[dp].length)
    psw = psw.concat(selectedDictionary[dp][wp])
  }
  return psw
}

export default {
  uuid,
  JsSHA
}
