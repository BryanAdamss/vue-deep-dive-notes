declare class Dep {
  notify(): void
}

declare class Watcher {
  update(): void
}

declare class Observer {
  dep: Dep
}

declare interface Window {
  target?: Watcher
}

declare interface HackedArray<T> extends Array<T> {
  __ob__?: Observer
}
