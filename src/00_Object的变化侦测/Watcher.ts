export default class Watcher {
  vm: any
  cb: any
  value: any
  getter: any

  constructor(vm: any, expOrFn: string, cb?: any) {
    this.vm = vm

    this.getter = parsePath(expOrFn)
    this.cb = cb
    this.value = this.get()
  }

  get() {
    window.target = this
    const value = this.getter.call(this.vm, this.vm)
    window.target = undefined

    return value
  }

  update() {
    const oldValue = this.value
    this.value = this.get()
    this.cb.call(this.vm, this.value, oldValue)
  }
}
