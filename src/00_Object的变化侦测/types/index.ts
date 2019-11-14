declare global {
  interface Window {
    target?: Watcher
  }
}

export interface Dep {}

export interface Watcher {
  update(): void
}
