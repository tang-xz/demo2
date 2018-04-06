//index.js
var config = require("../../config")
var util = require("../../utils/util.js")
var Canvas = require("../../utils/canvas.js")
var { getImageInfo, getImagesInfo } = require("../../utils/defer.js")
const baseUrl = `${config.service.host}/weapp/`

Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: null,
    loading: false,
    result: [],
    source: null,

    imgUrlLeft: null,
    imgUrlRight: null,
    loadingLeft: false,
    loadingRight: false
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
    console.error(e.detail.errMsg)
  },

  handleMatch() {
    let left = this.data.imgUrlLeft
    let right = this.data.imgUrlRight

    if (left && right) {
      let that = this
      this.onDraw([left, right])
        .then(data => {
          let positionInfo = data[0]
          let filePath = data[1]
          util.showBusy("正在上传")
          wx.uploadFile({
            url: `${baseUrl}/face/match`,
            // url: `http://127.0.0.1:5758/weapp/face/match`,
            // url: `http://192.168.1.157:5758/weapp/face/match`,
            method: "POST",
            filePath: filePath,
            name: "image",
            formData: {
              position: JSON.stringify(positionInfo)
            },
            success: function(res) {
              util.showSuccess("上传图片成功")
              res = JSON.stringify(res)
              that.setData({
                response: res
              })
            },
            fail: function(e) {
              util.showModel("上传图片失败")
            }
          })
        })
        .catch(err => {
          console.log("error, ", err)
        })
    }
  },

  onUploadImage(event) {
    let direction = event.currentTarget.dataset.direction
    let that = this
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ["compressed"],
      sourceType: ["album", "camera"],
      success: function(res) {
        if (direction === "left") {
          that.setData(
            {
              imgUrlLeft: res.tempFilePaths[0]
            },
            that.handleMatch
          )
        } else {
          that.setData(
            {
              imgUrlRight: res.tempFilePaths[0]
            },
            that.handleMatch
          )
        }
      },
      fail: function(e) {
        console.error(e)
      }
    })
  },

  onUpload() {
    var that = this

    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ["compressed"],
      sourceType: ["album", "camera"],
      success: function(res) {
        util.showBusy("正在上传")
        var filePath = res.tempFilePaths[0]

        // 上传图片
        wx.uploadFile({
          url: `${baseUrl}/face/add`,
          filePath: filePath,
          name: "file",

          success: function(res) {
            util.showSuccess("上传图片成功")
            res = JSON.parse(res.data)
            that.setData({
              imgUrl: res.data.imgUrl
            })
          },

          fail: function(e) {
            util.showModel("上传图片失败")
          }
        })
      },
      fail: function(e) {
        console.error(e)
      }
    })
  },

  onSearch() {
    var that = this

    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ["compressed"],
      sourceType: ["album", "camera"],
      success: function(res) {
        util.showBusy("正在上传")
        var filePath = res.tempFilePaths[0]

        // 上传图片
        wx.uploadFile({
          url: `${baseUrl}/face/search`,
          filePath: filePath,
          name: "file",

          success: function(res) {
            util.showSuccess("上传图片成功")
            res = JSON.parse(res.data)
            that.setData({
              source: filePath,
              result: res.data.list
            })
          },

          fail: function(e) {
            util.showModel("上传图片失败")
          }
        })
      },
      fail: function(e) {
        console.error(e)
      }
    })
  },

  onGetUsers() {
    let that = this
    this.setData({
      loading: true
    })
    wx.request({
      url: `${baseUrl}/face/users`,
      data: {
        group_id: "set0001"
      },
      success: function(res) {
        console.log("getUsers success: ", res.data)
      },
      complete() {
        that.setData({
          loading: false
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {}
})
