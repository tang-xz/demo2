const Router = require("koa-router")
const recognize = new Router()
const { uploadAndGetBase64 } = require("../tools/bodyParser")
const { search } = require("./baiduAPI")

recognize.post("/", async function(ctx, next) {
  const data = await uploadAndGetBase64(ctx.req)
  const result = await search({
    image: data.fileString,
    group_id: "set0001"
  })
    // todo, 捕获所有请求错误的情况
    .catch(err => {
      console.log('recognize api error: ', err)
    })
  ctx.state.data = Object.assign({ result }, data.fileInfo)
})

module.exports = recognize