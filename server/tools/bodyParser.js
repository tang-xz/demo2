const multiparty = require('multiparty')
const base64 = require('base64-js')
const fs = require('fs')
const config = require('../config')
const objectAssign = require('./objectAssign')
const argv = require('minimist')(process.argv.slice(2))
// local dev block
let uploader = () => {}
if (!argv.local) {
  uploader = require('../qcloud').uploader
}

// 获取 request 上传的 form 表单数据，包含 fields 和 files
function getRequestForm(req, cf) {
  // todo, need check cf type
  let _cf = objectAssign(cf || {}, config)
  return new Promise((resolve, reject) => {
    var form = new multiparty.Form()

    form.parse(req, function(err, fields, files) {
      if (err) {
        console.log('getRequestForm err: ', err)
        reject(err)
      }
      resolve({ fields, files })
    })
  })
}

// 获取 request 上传文件
function getRequestFiles(req, cf) {
  return getRequestForm(req, cf).then(({ fields, files }) => files)
}

// 获取 request 中上传的第一个文件的 base64 格式字符串
function getRequestFileBase64(req, cf = { name: 'file' }) {
  return getRequestFiles(req, cf).then(files => {
    const name = cf.name || 'file'
    const filePath = files[name][0].path
    const image = fs.readFileSync(filePath)
    const str = base64.fromByteArray(image)
    // be better to remove tmp image
    fs.unlink(filePath)
    return str
  })
}

// 上传 request file 到腾讯 oss，并获取此 file 的 base64 格式
// 返回值是 [ossImageInfo, base64String]
function uploadAndGetBase64(req, cf) {
  // 1. 这里必须使用 Promise.all 来同时处理两个读取 request form 操作的函数
  // 2. 如果先执行某一个函数，则 multiparty 会提示 stream ended unexpectedly 错误，还没找到原因
  // 3. 不能使用 koa-body 的原因，是因为会提示 2 的错误，至于为什么，猜测是 req 中 stream 监听一次结束后，
  //    不能再次被监听
  const p1 = uploader(req)
  const p2 = getRequestFileBase64(req, cf)
  return Promise.all([p1, p2]).then(values => ({
    fileInfo: values[0],
    fileString: values[1]
  }))
}

module.exports = {
  getRequestForm,
  getRequestFiles,
  getRequestFileBase64,
  uploadAndGetBase64
}
