/**
 * @author GuangHui
 * @description Watcher
 */

import { parsePath } from '../util/lang'
import { traverse } from './traverse'

type fn = (...args: any[]) => any

export default class Watcher {
  vm: any
  cb: any
  value: any
  getter: any
  deps: Dep[] // 用于保存Watcher实例被哪些Dep收集了，方便取消订阅
  depIds: Set<number> // 使用set防止重复添加Dep
  deep: boolean = false // watcher支持deep

  constructor(vm: any, expOrFn: string | fn, cb: any, options?: any) {
    console.log('Watcher:constructor', vm, expOrFn, cb)

    this.vm = vm

    if (options) this.deep = !!options.deep

    this.deps = []
    this.depIds = new Set()

    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn) // parsePath(expOrFn)返回一个缓存了expOrFn的函数并赋值给this.getter，this.getter调用时传入一个对象，就可以链式访问对象的对应属性
    }

    console.log('Watcher:constructor:getter', this.getter)

    this.cb = cb // 回调

    this.value = this.get() // 最新值
  }

  /**
   * 触发Observer中的getter，获取最新的值
   *
   * @returns 最新值
   * @memberof Watcher
   */
  get(): any {
    window.target = this
    const value = this.getter.call(this.vm, this.vm)

    // 在重置target前，遍历访问子属性，将此Watcher实例收集到子属性的依赖列表中
    if (this.deep) traverse(value)

    window.target = undefined

    return value
  }

  /**
   * 添加
   *
   * @memberof Watcher
   */

  /**
   * 添加Dep
   *
   * @param {Dep} dep Dep实例
   * @memberof Watcher
   */
  addDep(dep: Dep): void {
    const id = dep.id

    if (!this.depIds.has(id)) {
      // 当前Watcher保存了Dep实例；这样Watcher知道自己被哪些Dep收集了(自己订阅了哪些状态)；方便后期取消订阅
      this.depIds.add(id)
      this.deps.push(dep)

      // Dep收集当前Watcher实例；
      dep.addSub(this)
    }
  }

  /**
   * 更新，通知外界数据发生了变化
   *
   * @memberof Watcher
   */
  update(): void {
    const oldValue = this.value
    // ? 此处获取最新值时，会再收集一次依赖
    this.value = this.get()
    this.cb.call(this.vm, this.value, oldValue)
  }

  /**
   * 从所有依赖项的Dep列表中将自己移除
   *
   * @memberof Watcher
   */
  tearDown(): void {
    let i = this.deps.length
    while (i--) {
      this.deps[i].removeSub(this)
    }
  }
}
