//index.js
var config = require('../../config')
var util = require('../../utils/util.js')
const baseUrl = `${config.service.host}/weapp/`

const mockResponse = {
  result: [
    { uid: '00004', scores: [100], group_id: 'set0001', user_info: '' },
    {
      uid: '00003',
      scores: [90.760612487793],
      group_id: 'set0001',
      user_info: {}
    },
    {
      uid: '00004',
      scores: [90.760612487793],
      group_id: 'set0001',
      user_info: {}
    },
    {
      uid: '00002',
      scores: [10.612606048584],
      group_id: 'set0001',
      user_info: {}
    },
    { uid: '00001', scores: [0], group_id: 'set0001', user_info: {} }
  ],
  result_num: 5,
  ext_info: { faceliveness: '0.48075667023659' },
  log_id: 3422532225031221
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: null,
    loading: false,
    result: [],
    source: null
    // result: mockResponse.result
  },

  onUpload() {
    var that = this

    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        util.showBusy('正在上传')
        var filePath = res.tempFilePaths[0]

        // 上传图片
        wx.uploadFile({
          url: `${baseUrl}/face/add`,
          filePath: filePath,
          name: 'file',

          success: function(res) {
            util.showSuccess('上传图片成功')
            res = JSON.parse(res.data)
            console.log(res)
            that.setData({
              imgUrl: res.data.imgUrl
            })
          },

          fail: function(e) {
            util.showModel('上传图片失败')
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
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        util.showBusy('正在上传')
        var filePath = res.tempFilePaths[0]

        // 上传图片
        wx.uploadFile({
          url: `${baseUrl}/face/search`,
          filePath: filePath,
          name: 'file',

          success: function(res) {
            util.showSuccess('上传图片成功')
            res = JSON.parse(res.data)
            console.log(res)
            that.setData({
              source: filePath,
              result: res.data.list
            })
          },

          fail: function(e) {
            util.showModel('上传图片失败')
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
        group_id: 'set0001'
      },
      success: function(res) {
        console.log('getUsers success: ', res.data)
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
