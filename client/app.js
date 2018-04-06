//app.js
let qcloud = require("./vendor/wafer2-client-sdk/index")
let config = require("./config")
let { promiseSequence, promiseFinally } = require("./utils/defer")
Promise = require("./utils/es6-promise").Promise

// todo, 对全局构造函数的扩展
function init() {
  Promise.sequence = promiseSequence
  Promise.prototype.finally = promiseFinally
}

App({
  onLaunch: function() {
    init()
    qcloud.setLoginUrl(config.service.loginUrl)
  }
})
