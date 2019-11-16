export function parsePath(path: string): any {
  const reg = /[^\w.$]/
  if (reg.test(path)) return

  const segs = path.split('.')

  return function(obj: any): any {
    for (let i = 0, len = segs.length; i < len; i++) {
      if (!obj) return
      obj = obj[segs[i]]
    }
    return obj
  }
}

export default class Watcher {
  vm: any
  cb: any
  value: any
  getter: any

  constructor(vm: any, expOrFn: string, cb?: any) {
    debugger
    console.log('Watcher:constructor', vm, expOrFn, cb)

    this.vm = vm

    this.getter = parsePath(expOrFn) // parsePath(expOrFn)返回一个缓存了expOrFn的函数并赋值给this.getter，this.getter调用时传入一个对象，就可以链式访问对象的对应属性

    console.log('Watcher:constructor:getter', this.getter)

    this.cb = cb // 回调

    this.value = this.get() // 最新值
  }

  get() {
    window.target = this
    const value = this.getter.call(this.vm, this.vm) // /.

    window.target = undefined

    return value
  }

  update() {
    const oldValue = this.value
    // ? 此处获取最新值时，会再收集一次依赖
    this.value = this.get()
    this.cb.call(this.vm, this.value, oldValue)
  }
}
