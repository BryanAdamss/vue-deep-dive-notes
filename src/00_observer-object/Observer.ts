import Dep from './Dep'

/**
 * @author ghchu
 * @description Observer类，负责将对象转为响应式
 */

export function defineReactive(data: any, key: string, val: any): void {
  // 值是对象，递归遍历
  if (typeof val === 'object') new Observer(val)

  const dep = new Dep()

  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get() {
      console.log('defineReactive:get', data, key)
      // 读取data[key]时，触发get，通过depend方法将读取者收集到dep中
      dep.depend()
      return val
    },
    set(newVal) {
      console.log('defineReactive:set', newVal)
      if (val === newVal) return

      val = newVal

      // data[key]被设置新值时，通过所有依赖更新
      dep.notify()
    }
  })
}

export default class Observer {
  value: any
  constructor(value: any) {
    debugger
    console.log('Observer:constructor', value)

    this.value = value

    if (!Array.isArray(value)) this.walk(value)
  }

  /**
   * 遍历对象
   *
   * @param {*} obj 待遍历对象
   * @memberof Observer
   */
  walk(obj: any) {
    const keys = Object.keys(obj)
    keys.forEach(k => {
      defineReactive(obj, k, obj[k])
    })
  }
}
