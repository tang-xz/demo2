// 显示繁忙提示
const showBusy = text =>
  wx.showToast({
    title: text,
    icon: "loading",
    duration: 10000
  })

// 显示成功提示
const showSuccess = text =>
  wx.showToast({
    title: text,
    icon: "success"
  })

// 显示失败提示
const showModel = (title, content) => {
  wx.hideToast()

  wx.showModal({
    title,
    content: JSON.stringify(content),
    showCancel: false
  })
}

const showLoading = (title = "加载中") => {
  wx.showToast({
    title,
    duration: 600000,
    icon: "loading"
  })
}

const hideLoading = (title = "加载完成", duration = 1000) => {
  wx.hideToast()
  wx.showToast({
    title,
    duration,
    icon: "loading"
  })
}

module.exports = {
  showBusy,
  showSuccess,
  showModel,
  showLoading,
  hideLoading
}
