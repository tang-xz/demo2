function getImageInfo(option, cb) {
  if (!option.src) {
    return Promise.reject({
      code: -1,
      msg: "no src"
    })
  }
  let noop = function() {}
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: option.src,
      success: function(res) {
        cb && cb(res)
        resolve(res)
      },
      fail: function(res) {
        reject({
          code: -1,
          msg: "get image info error",
          error: res
        })
      },
      complete: function(res) {}
    })
  })
}

function getImagesInfo(images) {
  if (!images || !images.length) {
    Promise.reject({
      code: -1,
      msg: "images length is 0"
    })
  }
  let all = images.map(item => {
    let opt = typeof item === "string" ? { src: item } : item
    return getImageInfo(opt)
  })
  return Promise.all(all)
}

// 参数 items 必须是函数的数组，且函数的返回值必须是 promise 实例
let promiseSequence = function() {
  return new Promise((resolve, reject) => {
    let items = Array.prototype.concat.apply([], arguments)
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
  getImageInfo,
  getImagesInfo,
  promiseSequence,
  promiseFinally
}
