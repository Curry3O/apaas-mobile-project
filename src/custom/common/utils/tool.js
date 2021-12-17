/*
 * @Author: your name
 * @Date: 2021-08-21 16:18:20
 * @LastEditTime: 2021-12-16 17:25:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \apaas-custom-pms\src\custom\common\utils\tool.js
 */
/**
 * 截取url上的参数
 * 返回某个参数的值
 */
export const getQueryVariable = function(variable) {
  var query = window.location.search.substring(1)
  var vars = query.split('&')
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=')
    if (pair[0] === variable) {
      return pair[1]
    }
  }
  return false
}

/**
 * 删除url上指定的参数
 * 返回剩余url参数
 * query (url上的所有参数)  String
 * variable (需要删除的参数)  Array
 */
export const deleteQueryVariable = function(query, variable) {
  var list = Array.isArray(variable) ? variable : []
  // var query = window.location.search.substring(1)
  var vars = query.split('&')
  var newQuery = ''
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=')
    if (!list.includes(pair[0])) {
      newQuery += (newQuery.indexOf('?') > -1 ? '&' : '?') + pair[0] + '=' + pair[1]
    }
  }
  return newQuery
}

/**
 * @param {*} fn 函数
 * @param {*} delay 延时
 * @description 防抖
 */
export const _debounce = (fn, delay) => {
  delay = delay || 200
  var timer
  return function() {
    var th = this
    var args = arguments
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(function() {
      timer = null
      fn.apply(th, args)
    }, delay)
  }
}

/**
 * 获取当前年度的周数
 * @description 获取传入时间是本年第几周
 */
export const getYearWeek = (dateString) => {
  var da = dateString
  // 当前日期
  var date1 = new Date(da.substring(0, 4), parseInt(da.substring(5, 7)) - 1, da.substring(8, 10))
  // 1月1号
  var date2 = new Date(da.substring(0, 4), 0, 1)
  // 获取1月1号星期（以周一为第一天，0周一~6周日）
  var dateWeekNum = date2.getDay() - 1
  if (dateWeekNum < 0) {
    dateWeekNum = 6
  }
  if (dateWeekNum < 4) {
    // 前移日期
    date2.setDate(date2.getDate() - dateWeekNum)
  } else {
    // 后移日期
    date2.setDate(date2.getDate() + 7 - dateWeekNum)
  }
  var d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000)
  if (d < 0) {
    var date3 = date1.getFullYear() - 1 + '-12-31'
    return getYearWeek(date3)
  } else {
    return Math.ceil((d + 1) / 7)
  }
}

// 深拷贝
export const deepCopy = function(obj) {
  if (!obj || typeof obj !== 'object') return obj
  if (obj instanceof RegExp) return new RegExp(obj)
  if (obj instanceof Date) return new Date(obj)
  let newObj = obj instanceof Array ? [] : {}
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = typeof obj[key] === 'object' ? deepCopy(obj[key]) : obj[key]
    }
  }
  return newObj
}

// 金额添加千分位
export const addThousand = function(n) {
  if (!n) return '0.00'
  let str = n.split('.')
  let re = /\d{1,3}(?=(\d{3})+$)/g
  let n1 = str[0].replace(re, '$&,')
  return str.length > 1 && str[1] ? `${n1}.${str[1]}` : `${n1}.00`
}
// 去除千分位中的‘，’
export const removeThousand = function(num) {
  if (!num) return num
  num = num.toString()
  num = num.replace(/[^-?\d.]/g, '')
  num = parseFloat(num).toFixed(2)
  num = num.toString()
  num = num.replace(/[^-?\d.]/g, '')
  num = num.replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
  num = num.replace(/,/gi, '')
  return num
}

// 格式化输出带有千分位的金额
export const formatMoney = function(inputVal) {
  return addThousand(removeThousand(inputVal))
}

// 生成唯一标识符
export const generateUUID = function() {
  var d = new Date().getTime()
  if (window.performance && typeof window.performance.now === 'function') {
    d += performance.now()
  }
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
  return uuid
}

export const findIndex = function(ary, fn) {
  if (ary.findIndex) {
    return ary.findIndex(fn)
  }
  let index = -1
  ary.some(function(item, i, ary) {
    const ret = fn.call(this, item, i, ary)
    if (ret) {
      index = i
      return ret
    }
  })
  return index
}
