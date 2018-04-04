// canvas 需要直接在 html 中设置 style 宽高，且单位应该是 px，这样有利于后端切分图片
function Canvas(canvasId, option) {
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
  // 记录填充图片的位置信息和尺寸信息
  this.images = []
  this.y = 0
  this.x = 0
  this.option.imageMaxWidth = this.option.width
  this.option.imageMaxHeight = this.option.height / 2
  this.ctx = wx.createCanvasContext(canvasId)
}
Canvas.prototype.getScaledImage = function(image, option) {
  if (!image || image.constructor !== Object) {
    return
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
  if (!image || image.constructor !== Object) {
    return
  }
  return new Promise(resolve => {
    let scaledImage = this.getScaledImage(image)
    this.ctx.drawImage(scaledImage.path, this.x, this.y, scaledImage.scaledWidth, scaledImage.scaledHeight)
    this.ctx.draw(true, () => {
      // 记录图片信息
      this.images.push({
        x: this.x,
        y: this.y,
        width: scaledImage.scaledWidth,
        height: scaledImage.scaledHeight
      })
      // 纵向添加
      this.y = this.y + scaledImage.scaledHeight
      resolve(this.y)
    })
  })
}
Canvas.prototype.drawImages = function(images) {
  if (!images || !images.length) {
    return
  }
  // Promise.sequence 的参数必须是函数的数组，且函数的返回值是 Promise 实例
  return Promise.sequence(images.map(item => () => this.drawImage(item)))
}

module.exports = Canvas
