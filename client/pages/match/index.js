// pages/match/index.js
const config = require("../../config")
const util = require("../../utils/util.js")
const Canvas = require("../../utils/canvas.js")
const $toast = require("../../utils/toast.js")
const { getImagesInfo } = require("../../utils/defer.js")

Page({
  /**
   * 页面的初始数据
   */
  data: {
    urlLeft: null,
    urlRight: null,
    loadingLeft: false,
    loadingRight: false,
    description: ""
  },

  // todo, 当前只能画两张图片
  onDraw(urls) {
    if (urls.length) {
      let that = this
      let ctx = new Canvas("canvas")
      let imagesInfo = getImagesInfo(urls)
      // 返回值是 promise 实例，data 是 2 张图片在 canvas 上的位置信息
      return Promise.sequence(
        () => {
          return imagesInfo.then(images => {
            return ctx.drawImages(images)
          })
        },
        () => {
          return ctx.canvasToTempFilePath()
        }
      )
    } else {
      return Promise.reject({
        code: -1,
        msg: "draw image to canvas error"
      })
    }
  },

  canvasIdErrorCallback: function(e) {
    // todo, 错误上报
    console.error(e.detail.errMsg)
  },

  handleMatch() {
    let left = this.data.urlLeft
    let right = this.data.urlRight
    if (left && right) {
      let that = this
      this.onDraw([left, right])
        .then(data => {
          let position = data[0]
          let filePath = data[1]
          $toast.showLoading("正在上传")
          wx.uploadFile({
            url: `${config.service.faceUrl}/match`,
            method: "POST",
            filePath: filePath,
            name: "image",
            formData: {
              position: JSON.stringify(position)
            },
            success: function(res) {
              $toast.hideLoading("上传图片成功")
              let response = JSON.parse(res.data)
              let result = response.data.result[0]
              let description = ""
              if (result.score >= 80) {
                description = "判断为同一个人"
              } else {
                description = "判断为不同人"
              }
              description = `${description}, 相似度为：${util.formatScore(result.score)}%`
              that.setData({
                description
              })
            },
            fail: function(e) {
              $toast.hideLoading("上传图片失败")
            }
          })
        })
        .catch(err => {
          console.log("error, ", err)
        })
    }
  },

  onUpload(event) {
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: ["compressed"],
      sourceType: ["album", "camera"],
      success: function(res) {
        let data = {}
        if (event.currentTarget.dataset.direction === "left") {
          data["urlLeft"] = res.tempFilePaths[0]
        } else {
          data["urlRight"] = res.tempFilePaths[0]
        }
        that.setData(data, that.handleMatch)
      },
      fail: function(e) {
        console.error(e)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {}
})
