const Koa = require('koa')
const app = new Koa()
const debug = require('debug')('koa-weapp-demo')
const bodyParser = require('koa-bodyparser')
const koaBody = require('koa-body');
const serve = require('koa-static');
const response = require('./middlewares/response')
const config = require('./config')

// polyfill for Android before app starts
if(!Object.assign) {
  Object.assign = require('./utils/object-assign')
}

// 使用响应处理中间件
app.use(response)

// or use absolute paths
app.use(serve(__dirname + '/static'));

// 解析请求体
// app.use(bodyParser())
app.use(koaBody())

// 引入路由分发
const router = require('./routes')
app.use(router.routes())

// 启动程序，监听端口
app.listen(config.port, () => debug(`listening on port ${config.port}`))
