const Router = require("koa-router")
const recognize = new Router()
const axios = require("axios")
const base64 = require("base64-js")
const qs = require("querystring")
const fs = require("fs")
const { getRequestFiles } = require("../tools/bodyParser")

const { uploader } = require("../qcloud")
const baiduAPIConfig = require("../baiduAPIConfig")

recognize.post("/", async function (ctx, next) {
  const p1 = uploader(ctx.req)
  const p2 = getRequestFiles(ctx.req).then(files => {
    // 这里的 file 是前端上传的 name 字段，之所以是一个数组，是因为有可能有多张图片
    const filePath = files.file[0].path
    const image = fs.readFileSync(filePath)
    const str = base64.fromByteArray(image)
    // be better to remove tmp image
    fs.unlink(filePath)
    return str
  })
  // 1. 这里必须使用 Promise.all 来同时处理两个读取 request form 操作的函数
  // 2. 如果先执行某一个函数，则 multiparty 会提示 stream ended unexpectedly 错误，还没找到原因
  // 3. 不能使用 koa-body 的原因，是因为会提示 2 的错误，至于为什么，猜测是 req 中 stream 监听一次结束后，
  //    不能再次被监听
  const data = await Promise.all([p1, p2])
  const uploadInfo = data[0]
  const base64Image = data[1]

  const identifyResponse = await axios.request({
    method: "POST",
    // 百度的这个 API 很恶心，必须是 base64 格式图片，且通过 urlencoded 方式上传
    "content-type": "application/x-www-form-urlencoded",
    transformRequest: data => qs.stringify(data),
    url: baiduAPIConfig.api.identify,
    params: {
      access_token: baiduAPIConfig.auth.access_token
    },
    data: {
      image: base64Image,
      group_id: "set0001",
      ext_fields: "faceliveness",
      user_top_num: 1
    }
  })

  ctx.state.data = Object.assign(
    { identifyResponse: identifyResponse.data },
    uploadInfo
  )
})

module.exports = recognize