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

  onDraw() {
    if (this.data.imgUrlLeft && this.data.imgUrlRight) {
      let that = this
      let ctx = new Canvas("canvas")
      let imagesInfo = getImagesInfo([this.data.imgUrlLeft, this.data.imgUrlRight])
      imagesInfo.then(images => {
        ctx.drawImages(images).then(data => {
          console.log(123, ctx.images, data)
        })
      })

      return
    }
  },
  canvasIdErrorCallback: function(e) {
    console.error(e.detail.errMsg)
  },

  handleMatch() {
    return
    if (leftFile && rightFile) {
      util.showBusy("正在上传")
      let that = this
      let formData = new FormData()
      formData.append("file1", leftFile)
      formData.append("file2", rightFile)
      wx.uploadFile({
        url: `${baseUrl}/face/match`,
        method: "POST",
        filePath: "",
        name: "tmp",
        formData: formData,
        success: function(res) {
          util.showSuccess("上传图片成功")
          res = JSON.parse(res.data)
        },
        fail: function(e) {
          util.showModel("上传图片失败")
        }
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
            console.log(res)
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
