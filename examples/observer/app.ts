import Observer from '../../src/core/observer/Observer'
import Watcher from '../../src/core/observer/Watcher'

const $ = selector => document.querySelector(selector)

// * 验证
window.testData = {
  foo: 1,
  bar: {
    baz: 2,
    bax: 'test'
  },
  arr: [3, 4, 5],
  arrNest: [6, [7, 8], 9],
  arrNestObject: [
    10,
    {
      xx: 'test xx',
      yy: 'text yy'
    }
  ]
}

window.vmOb = new Observer(window.testData)

console.log('after new Observer vmOb：', vmOb)

const watchFoo = new Watcher(window.testData, 'foo', (newVal, oldVal) => {
  console.log('watchFoo', newVal, oldVal)
})
// window.testData.foo=9 // 触发回调

const watcheBar = new Watcher(
  window.testData,
  'bar',
  (newVal, oldVal) => {
    console.log('watcheBar', newVal, oldVal)
  },
  {
    deep: false
  }
)

// window.testData.bar=null  // bar值改变，会触发回调
// window.testData.bar.baz=3  // deep为true时，虽然watcher的是bar，但是baz的改变也会触发watcher回调
// window.testData.bar.newProp=3  // 新增属性不会触发

const watchArrDeep = new Watcher(
  window.testData,
  'arr',
  (newVal, oldVal) => {
    console.log('watchArrDeep', newVal, oldVal)
  },
  {
    deep: true // deep选项对简单数组(元素为基本值)不生效；为了发现对象内部值的变化，可以在选项参数中指定 deep: true 。注意监听数组的变动不需要这么做。https://cn.vuejs.org/v2/api/#vm-watch
  }
)

const watcheBarBax = new Watcher(
  window.testData,
  'bar.bax', // 使用keypath
  (newVal, oldVal) => {
    console.log('watcheBarBax', newVal, oldVal)
  }
)

// window.testData.bar.bax='test' // 不触发回调，因为新旧值相等，都是test
// window.testData.bar.bax='test2' // 触发回调

const watchArr = new Watcher(window.testData, 'arr', (newVal, oldVal) => {
  console.log('watchArr', newVal, oldVal)
})

// window.testData.arr.push(6) // 触发回调
// window.testData.arr.push({name:'test'}) // 触发回调,新增的对象也是响应式的(带有__ob__标识)

const watchArrNest = new Watcher(
  window.testData,
  'arrNest',
  (newVal, oldVal) => {
    console.log('watchArrNest', newVal, oldVal) // 由于引用值，所以newVal === oldVal
  }
)

// window.testData.arrNest.push(3) // 触发回调
// window.testData.arrNest[1].push(3) // 触发回调，数组子值变化，会触发数组的回调

const watchArrNestObject = new Watcher(
  window.testData,
  'arrNestObject',
  (newVal, oldVal) => {
    console.log('watchArrNestObject', newVal, oldVal)
  },
  {
    deep: false // testData.arrNestObject[1].xx=4 // 不会触发回调，需要指定deep为true，deep不适用于数组，数组本身就实现了depp效果；object需要手动添加deep来实现子值变化，触发父值回调
  }
)

// testData.arrNestObject.push(4) // 会触发回调
