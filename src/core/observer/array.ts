/**
 * @author GaungHui
 * @description 对array的变异方法做拦截(hack)
 */

import { ArrayMutationMethod } from '../../types'
import { def } from '../util/lang'

const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto) // 原型继承,arrayMethods.__proto__===Array.prototype

// 改变数组自身内容的方法都需要拦截
const methodsToPatch: ArrayMutationMethod[] = [
  'push',
  'pop',
  'shift',
  'unshift',
  'sort',
  'splice',
  'reverse'
]

// 对变异方法做拦截
methodsToPatch.forEach(method => {
  // 缓存原始方法，hack方法中需要调用
  const originalMethod = arrayProto[method]

  def(arrayMethods, method, function mutator(
    this: HackedArray<any>,
    ...args: any
  ) {
    // 调用原始方法
    const result = (originalMethod as any).apply(this, args) // this指向数组实例，因为arrayMethods是一个原型对象

    // 拿到定义在Array实例上的Observer实例
    const ob = this.__ob__

    // 调用方法时，通知依赖进行更新
    ob && ob.dep.notify()

    // 返回原始方法执行结果
    return result
  })
})
