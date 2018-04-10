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
    description: "",

    url: null
  },

  onCompress(e) {
    console.log("Compresse finished!", e.detail.data)
    // todo，canvas 多画了一次？
    // todo，给 compress-canvas 添加 class
    this.handleMatch(e.detail.data)
  },

  canvasIdErrorCallback: function(e) {
    // todo, 错误上报
    console.error(e.detail.errMsg)
  },

  handleMatch(data) {
    let that = this
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
        that.setData({
          url: [res.tempFilePaths[0], res.tempFilePaths[0]]
        })
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
