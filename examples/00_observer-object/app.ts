import Observer from '../../src/core/Observer'
import Watcher from '../../src/core/Watcher'

const $ = selector => document.querySelector(selector)

const data = {
  foo: 3,
  bar: {
    baz: 4
  }
}

const dataOb = new Observer(data) // 将data转为响应式

const watcherFoo = new Watcher(data, 'foo', (newVal, oldVal) => {
  console.log('watcherFoo', newVal, oldVal)
})

const watcherBaz = new Watcher(data, 'bar.baz', (newVal, oldVal) => {
  console.log('watcherBaz', newVal, oldVal)
})

$('#getFoo').onclick = function() {
  console.log(data.foo) // 触发dataObj的getter
}

$('#plusFoo').onclick = function() {
  data.foo++
}

$('#plusBaz').onclick = function() {
  data.bar.baz++
}
