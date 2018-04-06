// 参数 items 必须是函数的数组，且函数的返回值必须是 promise 实例
let promiseSequence = function() {
  let items = Array.prototype.concat.apply([], arguments)
  return new Promise((resolve, reject) => {
    let result = []
    function nextPromise(index, items) {
      if (index >= items.length) {
        resolve(result)
      }
      items[index]()
        .then(data => {
          result.push(data)
          nextPromise(index + 1, items)
        })
        .catch(err => {
          reject(err)
        })
    }
    nextPromise(0, items)
  })
}

let promiseFinally = function(callback) {
  let P = this.constructor
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason =>
      P.resolve(callback()).then(() => {
        throw reason
      })
  )
}

module.exports = {
  promiseFinally,
  promiseSequence
}
