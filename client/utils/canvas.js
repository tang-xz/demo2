// canvas 需要直接在 html 中设置 style 宽高，且单位应该是 px，这样有利于后端切分图片
function Canvas(canvasId, option, context) {
  if (!canvasId) {
    return
  }

  this.option = Object.assign(
    {
      // todo, 这里可以设置宽高，本意是想做成插件，动态设置 html 中 canvas 的宽高
      width: 300,
      // 需要注意的是，默认 canvas 高度为宽度的 2 倍，即最多只能拼接两幅图
      height: 600,
      // todo, 更新 html canvas 函数
      update: () => {},
      complete: () => {}
    },
    option
  )
  this.context = context
  // 记录填充图片的位置信息和尺寸信息
  this.images = []
  this.width = this.option.width
  this.height = this.option.height
  this.offsetY = 0
  this.offsetX = 0
  this.canvasId = canvasId
  this.option.imageMaxWidth = this.option.width
  this.option.imageMaxHeight = this.option.height / 2
  this.ctx = wx.createCanvasContext(canvasId, this.context)
  this.reverse = false
}
Canvas.prototype.getScaledImage = function(image, option) {
  if (!image || image.constructor.name !== "Object") {
    return Promise.reject({
      code: -1,
      msg: "getScaledImage params error, is not object"
    })
  }
  let opt = Object.assign(this.option, option)
  if (image.width > image.height) {
    if (image.width > opt.imageMaxWidth) {
      image.scaledWidth = opt.imageMaxWidth
      image.scaledHeight = image.scaledWidth * image.height / image.width
    } else {
      image.scaledWidth = image.width
      image.scaledHeight = image.height
    }
  } else {
    if (image.height > opt.imageMaxHeight) {
      image.scaledHeight = opt.imageMaxHeight
      image.scaledWidth = image.scaledHeight * image.width / image.height
    } else {
      image.scaledWidth = image.width
      image.scaledHeight = image.height
    }
  }
  return image
}
Canvas.prototype.drawImage = function(image) {
  if (!image || image.constructor.name !== "Object") {
    return Promise.reject({
      code: -1,
      msg: "drawImage params error, is not object"
    })
  }
  return new Promise(resolve => {
    let scaledImage = this.getScaledImage(image)
    this.ctx.drawImage(scaledImage.path, this.offsetX, this.offsetY, scaledImage.scaledWidth, scaledImage.scaledHeight)
    this.ctx.draw(this.reverse, () => {
      const positionInfo = {
        x: this.offsetX,
        y: this.offsetY,
        width: scaledImage.scaledWidth,
        height: scaledImage.scaledHeight
      }
      // 记录图片信息
      this.images.push(positionInfo)
      // 纵向添加
      this.offsetY = this.offsetY + scaledImage.scaledHeight
      resolve(positionInfo)
    })
  })
}
Canvas.prototype.drawImages = function(images) {
  if (!images || !images.length) {
    return Promise.reject({
      code: -1,
      msg: "draw image params error"
    })
  }
  let tasks = images.concat()
  if (tasks.length > 1) {
    // 每次批量画图之前都需要清除 canvas
    tasks.splice(1, 0, () => {
      this.reverse = true
      return Promise.resolve()
    })
    tasks.push(() => {
      this.reverse = false
      return Promise.resolve()
    })
  }
  // Promise.sequence 的参数必须是函数的数组，且函数的返回值是 Promise 实例
  return Promise.sequence(
    tasks.map(item => {
      if (typeof item === "object") {
        return () => this.drawImage(item)
      } else if (typeof item === "function") {
        return item
      }
    })
  )
}
Canvas.prototype.canvasToTempFilePath = function(cb) {
  let that = this
  return new Promise((resolve, reject) => {
    wx.canvasToTempFilePath(
      {
        canvasId: that.canvasId,
        x: 0,
        y: 0,
        width: this.width,
        height: this.height,
        destWidth: this.width,
        destHeight: this.height,
        success: function(res) {
          cb && cb(res.tempFilePath)
          resolve(res.tempFilePath)
        },
        fail: function(err) {
          reject({
            code: -1,
            error: err,
            msg: "canvas to temp file path error"
          })
        }
      },
      this.context
    )
  })
}

module.exports = Canvas
