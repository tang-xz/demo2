const axios = require('axios')
const qs = require('querystring')
const config = require('../baiduConfig')
const objectAssign = require('../tools/objectAssign')

var request = axios.create({
  baseURL: config.baseURL,
  timeout: 30000,
  'content-type': 'application/x-www-form-urlencoded',
  transformRequest: data => qs.stringify(data),
  params: {
    access_token: config.auth.access_token
  }
})

const api = (name, data) => {
  let method, url
  try {
    method = config.api[name][1]
    url = config.api[name][0]
  } catch (e) {
    return Promise.reject('Error: api not found.')
  }
  if (!url || !method) {
    return Promise.reject('Error: api not found.')
  }
  if (method === 'GET') {
    return request
      .get(url, { params: data })
      .then(response => response.data)
      .catch(error =>
        Promise.reject(`Error: ${name} API - ${error.error_msg}.`)
      )
  } else if (method === 'POST') {
    return request
      .post(url, data)
      .then(response => response.data)
      .catch(error =>
        Promise.reject(`Error: ${name} API - ${error.error_msg}.`)
      )
  }
}

module.exports = api
