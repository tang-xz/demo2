// components/CompressCanvas/compressCanvas.js
const Canvas = require("../../utils/canvas.js")
const { getImagesInfo } = require("../../utils/defer.js")

// todo，只能画两张图片

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    width: {
      type: Number,
      value: "300",
      observer: function(newVal, oldVal) {}
    },
    height: {
      type: Number,
      value: "600",
      observer: function(newVal, oldVal) {}
    },
    unit: {
      type: String,
      value: "px"
    },
    url: {
      type: null,
      value: null,
      observer: "handleUrlChange"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    draw(urls) {
      let that = this
      let canvas = new Canvas(
        "compressCanvas",
        {
          width: this.properties.width,
          height: this.properties.height
        },
        // 自定义组件内查找 canvas 实例
        this
      )
      let imagesInfo = getImagesInfo(urls)
      // 返回值是 promise 实例，data 是 2 张图片在 canvas 上的位置信息
      Promise.sequence(
        () => {
          return imagesInfo.then(images => {
            return canvas.drawImages(images)
          })
        },
        () => {
          return canvas.canvasToTempFilePath()
        }
      )
        .then(data => {
          this.triggerEvent("compress", { data })
        })
        .catch(e => {
          // todo, 处理异常
          console.log(0, e)
        })
    },
    handleUrlChange(newVal, oldVal) {
      // todo, 新旧值相同，不重绘 canvas
      if (newVal === oldVal) {
        return
      }
      let urls = []
      if (newVal.constructor.name === "String") {
        urls = [newVal]
      } else if (newVal.constructor.name === "Array") {
        urls = newVal
      }
      if (urls.length) {
        this.draw(urls)
      } else {
        // todo, 异常处理
      }
    },
    canvasIdErrorCallback(e) {
      // todo, 错误上报
      console.error(e.detail.errMsg)
    }
  }
})
