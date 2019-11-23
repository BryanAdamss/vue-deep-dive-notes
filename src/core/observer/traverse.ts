import { isObject } from '../util'

const seenObjects: Set<number> = new Set()

export function traverse(val: any): void {
  _traverse(val, seenObjects)

  seenObjects.clear()
}

function _traverse(val: any, seen: Set<number>): void {
  let i, keys
  const isA = Array.isArray(val)

  // 非数组、非对象或val被冻结的，不需要遍历
  if ((!isA && !isObject(val)) || Object.isFrozen(val)) {
    return
  }

  // val已经被观测过
  if (val.__ob__) {
    // 拿到dep的id
    const depId = val.__ob__.dep.id

    // 已经有depId，则返回；防止收集到重复的依赖
    if (seen.has(depId)) return

    // 否则将其添加到set中
    seen.add(depId)
  }

  // 数组，则遍历访问其子元素，触发依赖收集逻辑
  if (isA) {
    i = val.length
    while (i--) _traverse(val[i], seen)
  } else {
    // 非数组（即对象）则，遍历访问其属性，触发依赖收集逻辑
    keys = Object.keys(val)
    i = keys.length
    while (i--) _traverse(val[keys[i]], seen)
  }
}
