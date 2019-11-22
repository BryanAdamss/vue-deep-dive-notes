declare class Watcher {
  update(): void
}

declare class Observer {}

declare interface Window {
  target?: Watcher
}
