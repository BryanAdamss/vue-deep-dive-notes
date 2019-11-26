import Observer from '../../src/core/observer/Observer'
import Watcher from '../../src/core/observer/Watcher'

const $ = selector => document.querySelector(selector)

const data = {
  foo: 3,
  bar: {
    baz: 4
  }
}

window.vm = {
  simpleArr: [1, 2, 3],
  twoArr: [[1, 2], 3, [4, 5]],
  objectArr: [
    { name: 1 },
    2,
    {
      name: 3,
      child: {
        name: 4,
        list: [5, 6, 7]
      }
    }
  ]
}

// const dataOb = new Observer(data) // 将data转为响应式

// const watcherFoo = new Watcher(data, 'foo', (newVal, oldVal) => {
//   console.log('watcherFoo', newVal, oldVal)
// })

// const watcherBaz = new Watcher(data, 'bar.baz', (newVal, oldVal) => {
//   console.log('watcherBaz', newVal, oldVal)
// })

// $('#getFoo').onclick = function() {
//   console.log(data.foo) // 触发dataObj的getter
// }

// $('#plusFoo').onclick = function() {
//   data.foo++
// }

// $('#plusBaz').onclick = function() {
//   data.bar.baz++
// }

// TODO:验证数组
const simpleArrOb = new Observer(window.vm)

$('#pushOne').onclick = () => {
  window.vm.simpleArr.push(4)
  console.log('pushOne', window.vm.simpleArr)
}

const watchSimpleArr = new Watcher(window.vm, 'simpleArr', (newVal, oldVal) => {
  console.log('watchSimpleArr', newVal, oldVal)
})
