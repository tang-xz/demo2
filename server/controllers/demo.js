const { uploader, mysql } = require('../qcloud')

module.exports = ctx => {
  mysql('recognize_db').select('*')
  ctx.state.data = {
    msg: 'hello world'
  }
}