/**
 * @author GuangHui
 * @description Observer类，负责将对象转为响应式
 */

import Dep from './Dep'
import { arrayMethods } from './array'

import { isObject } from '../util'
import { hasProto } from './../util/env'
import { def, hasOwn } from '../util/lang'

const arrayKeys = Object.getOwnPropertyNames(arrayMethods)

export default class Observer {
  value: any
  dep: Dep
  constructor(value: any) {
    console.log('Observer:constructor', value)

    this.value = value

    this.dep = new Dep() // 将dep挂载到Observer上，主要是为了在数组的getter和拦截器中都能访问到

    def(value, '__ob__', this) // 将Observer实例挂载到value上，一用来标识对象是否被Observer过，二可以很方便的在数据上拿到Observer实例，进而拿到Dep实例，这在侦测array的变化时很有用

    if (Array.isArray(value)) {
      const augment = hasProto ? protoAugment : copyAugment

      augment(value, arrayMethods, arrayKeys)

      // 将数组每一项转为响应式
      this.observeArray(value)
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
  walk(obj: any): void {
    const keys = Object.keys(obj)
    keys.forEach(k => {
      defineReactive(obj, k, obj[k])
    })
  }

  /**
   * 将数组每一项转为响应式
   *
   * @param {any[]} items 数组
   * @memberof Observer
   */
  observeArray(items: any[]): void {
    items.forEach(observe)
  }
}

// 将数据的特定key转成getter/setter形式
export function defineReactive(data: any, key: string, val: any): void {
  const childOb = observe(val)
  const dep = new Dep()

  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get() {
      console.log('defineReactive:get', data, key)

      // 读取data[key]时，触发get，通过depend方法将读取者收集到dep中
      dep.depend()

      if (childOb) {
        childOb.dep.depend()
      }

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

/**
 * 获取Observer实例
 *
 * @export
 * @param {*} value 待观测的值
 * @returns {(Observer | void)} Observer实例
 */
export function observe(value: any): Observer | void {
  if (!isObject(value)) return // 基本类型值，无需转为getter/setter形式

  let ob

  // 数据已经被观测过，则直接返回ob
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else {
    // 否则，创建Observer实例
    ob = new Observer(value)
  }

  return ob
}

// 通过设置__proto__的方式将拦截器挂载到数组
export function protoAugment(target: any, src: any, keys: any): void {
  target.__proto__ = src
}

// 直接将拦截器方法拷贝到数组实例上
export function copyAugment(target: any, src: any, keys: string[]): void {
  keys.forEach(k => {
    def(target, k, src[k])
  })
}

// TODO:$set、$delete
