declare class Dep {
  id: number
  removeSub(sub: Watcher): void
  addSub(sub: Watcher): void
  notify(): void
}

declare class Watcher {
  addDep(dep: Dep): void
  update(): void
}

declare class Observer {
  dep: Dep
  observeArray(items: any[]): void
  walk(obj: any): void
}

declare interface Window {
  target?: Watcher
}

declare interface HackedArray<T> extends Array<T> {
  __ob__?: Observer
}
