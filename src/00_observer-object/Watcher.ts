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
    this.vm = vm

    this.getter = parsePath(expOrFn) // parsePath(expOrFn)返回一个缓存了expOrFn的函数并赋值给this.getter，this.getter调用时传入一个对象，就可以链式访问对象的对应属性

    this.cb = cb // 毁掉

    this.value = this.get() // 最新值
  }

  get() {
    window.target = this
    const value = this.getter.call(this.vm, this.vm) // 读取值，触发Observer中的getter，进而将此Watcher实例收集到Dep类中
    window.target = undefined

    return value
  }

  update() {
    const oldValue = this.value
    this.value = this.get()
    this.cb.call(this.vm, this.value, oldValue)
  }
}
