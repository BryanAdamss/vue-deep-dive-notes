export function isObject(obj: any): obj is Object {
  return obj !== null && typeof obj === 'object'
}
