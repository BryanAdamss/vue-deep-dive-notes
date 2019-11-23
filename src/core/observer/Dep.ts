/**
 * @author GuangHui
 * @description 依赖(Watcher实例)存放类 - 发布订阅模式
 */

function remove<T>(arr: T[], item: T): T[] | void {
  if (!arr.length) return

  const index = arr.indexOf(item)
  if (index > -1) return arr.splice(index, 1)
}

// Dep的唯一id
let uid = 0

export default class Dep {
  id: number = uid++ // 唯一id
  subs: Watcher[] = [] // 存放某个Data的所有Watcher实例

  /**
   * 添加
   *
   * @param {Watcher} sub Watcher实例
   * @memberof Dep
   */
  addSub(sub: Watcher): void {
    this.subs.push(sub)
  }

  /**
   * 移除订阅者
   *
   * @param {Watcher} sub Watcher实例
   * @memberof Dep
   */
  removeSub(sub: Watcher): void {
    remove(this.subs, sub)
  }

  /**
   * 读取被临时存放到window.target上Watcher实例，将其添加到subs中
   *
   * @memberof Dep
   */
  depend(): void {
    console.log('Dep:depend', this.subs)

    // window.target 是一个全局唯一位置，临时存放某个读取了Data的Watch实例
    if (window.target) window.target.addDep(this)
  }

  /**
   * Data数据变化时，通知所有依赖(Watcher)实例更新
   *
   * @memberof Dep
   */
  notify(): void {
    console.log('Dep:notify', this.subs)
    const subs = this.subs.slice()

    subs.forEach(sub => {
      sub.update()
    })
  }
}
