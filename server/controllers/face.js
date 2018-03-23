const Router = require('koa-router')
const face = new Router()
const {
  uploadAndGetBase64,
  getRequestFileBase64
} = require('../tools/bodyParser')
const baiduAPI = require('../tools/baiduAPI')

face.post('/', async function(ctx, next) {
  const data = await uploadAndGetBase64(ctx.req)
  const result = await search({
    image: data.fileString,
    group_id: 'set0001'
  })
    // todo, 捕获所有请求错误的情况
    .catch(err => {
      console.log('face api error: ', err)
    })
  ctx.state.data = Object.assign({ result }, data.fileInfo)
})

face.post('/search', async function(ctx, next) {
  const fileString = await getRequestFileBase64(ctx.req)
  const result = await baiduAPI('search', {
    image: fileString,
    group_id: 'set0001'
  })
  ctx.state.data = result
})

face.post('/add', async function(ctx, next) {
  const data = await uploadAndGetBase64(ctx.req)
  const result = await baiduAPI('add', {
    image: data.fileString,
    group_id: 'set0001',
    uid: uid,
    // 除了 fileInfo，是否需要存储用户信息？
    // 用户信息是不是应该保存在腾讯的后台数据库中
    user_info: JSON.stringify(data.fileInfo)
  })
  ctx.state.data = data.fileInfo
})

face.get('/users', async function(ctx, next) {
  const result = await baiduAPI('getUsers', {
    group_id: 'set0001'
  })
  ctx.state.data = result
})

module.exports = face
