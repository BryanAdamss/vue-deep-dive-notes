/**
 * @author GuangHui
 * @description 辅助方法
 */

/**
 * 使用defineProperty定义对象属性
 *
 * @export
 * @param {Object} obj  对象
 * @param {string} key  key
 * @param {*} val 值
 * @param {boolean} [enumerable] 是否可枚举
 */
export function def(obj: Object, key: string, val: any, enumerable?: boolean) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}

/**
 * 解析属性值读取路径，返回一个函数；用于解析keypath(形似a.b.c)
 *
 * @export
 * @param {string} path 待解析字符串(一般是keypath)
 * @returns {*}
 */
export function parsePath(path: string): any {
  const reg = /[^\w.$]/
  if (reg.test(path)) return

  const segs = path.split('.')

  // 返回一个函数，调用后，path读取obj对应keypath的值
  return function(obj: any): any {
    for (let i = 0, len = segs.length; i < len; i++) {
      if (!obj) return
      obj = obj[segs[i]]
    }
    return obj
  }
}

/**
 * 对象本身是否存在某属性
 *
 * @export
 * @param {*} obj 待检测对象
 * @param {string} key 要检测的key
 * @returns {boolean} 是否存在属性
 */
const hasOwnProperty = Object.prototype.hasOwnProperty
export function hasOwn(obj: any, key: string): boolean {
  return hasOwnProperty.call(obj, key)
}
