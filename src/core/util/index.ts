export function isObject(obj: any): obj is Object {
  return obj !== null && typeof obj === 'object'
}
export function isValidArrayIndex(val: any): boolean {
  const n = parseFloat(String(val))
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}
