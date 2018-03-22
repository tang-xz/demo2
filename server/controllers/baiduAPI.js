const axios = require("axios")
const qs = require("querystring")
const config = require("../baiduConfig")
const objectAssign = require("../tools/objectAssign")

var request = axios.create({
  baseURL: config.api.baseURL,
  timeout: 60000,
  "content-type": "application/x-www-form-urlencoded",
  transformRequest: data => qs.stringify(data),
  params: {
    access_token: config.auth.access_token
  }
})

// 人脸查找
// image 必须是 base64 格式
function search(data) {
  let _data = objectAssign(
    {
      group_id: "set0001",
      user_top_num: 3
    },
    data
  )
  return request
    .post(config.api.identify, _data)
    .then(response => response.data)
}

module.exports = {
  search
}