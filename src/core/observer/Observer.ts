/**
 * @author GuangHui
 * @description Observer类，负责将对象转为响应式
 */

import Dep from './Dep'
import { def } from '../util/lang'
import { supportProto } from './../util/env'
import { arrayMethods } from './array'

const arrayKeys = Object.getOwnPropertyNames(arrayMethods)

export default class Observer {
  value: any
  dep: Dep
  constructor(value: any) {
    console.log('Observer:constructor', value)

    this.value = value

    this.dep = new Dep()

    def(value, '__ob__', this) // 将Observer实例挂载到value上，一用来标识对象是否被Observer过，二可以很方便的在数据上拿到Observer实例，进而拿到Dep实例，这在侦测array的变化时很有用

    if (Array.isArray(value)) {
      const augment = supportProto ? protoAugment : copyAugment

      augment(value, arrayMethods, arrayKeys)
    } else {
      this.walk(value)
    }
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

export function protoAugment(target: any, src: any, keys: any): void {
  target.__proto__ = src
}

export function copyAugment(target: any, src: any, keys: string[]): void {
  keys.forEach(k => {
    def(target, k, src[k])
  })
}
