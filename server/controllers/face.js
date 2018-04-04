const Router = require('koa-router')
const face = new Router()
const { uploadAndGetBase64, getRequestFilesBase64 } = require('../tools/bodyParser')
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
  const strArr = await getRequestFilesBase64(ctx.req)
  let list = await baiduAPI('search', {
    image: strArr[0],
    group_id: 'set0001',
    user_top_num: 5
  }).then(response => {
    let list = response.result
    return list.map(item => {
      item.user_info = JSON.parse(item.user_info)
      return item
    })
  })
  ctx.state.data = { list }
})

face.post('/add', async function(ctx, next) {
  const data = await uploadAndGetBase64(ctx.req)
  const result = await baiduAPI('add', {
    image: data.fileString,
    group_id: 'set0001',
    uid: +new Date(),
    // 除了 fileInfo，是否需要存储用户信息？
    // 用户信息是不是应该保存在腾讯的后台数据库中
    // todo, user_info 最大需小于 256B
    user_info: JSON.stringify({
      imgUrl: data.fileInfo.imgUrl,
      size: data.fileInfo.size
    })
  })
  // todo, 只有当 data.fileInfo 和 result 都成功时才返回成功，其他情况返回失败
  ctx.state.data = data.fileInfo
})

face.post('/match', async function(ctx, next) {
  const strArr = await getRequestFilesBase64(ctx.req)
  const result = await baiduAPI('match', {
    images: strArr.join(','),
    types: '7,13'
  })
  console.log(333, strArr, result)
  // todo, 只有当 data.fileInfo 和 result 都成功时才返回成功，其他情况返回失败
  ctx.state.data = result
})

face.get('/users', async function(ctx, next) {
  const result = await baiduAPI('getUsers', {
    group_id: 'set0001'
  })
  ctx.state.data = result
})

module.exports = face
