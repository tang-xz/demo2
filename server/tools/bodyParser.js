const multiparty = require("multiparty")
const config = require("../config")

function getRequestForm(req, cf = config) {
  return new Promise((resolve, reject) => {
    var form = new multiparty.Form({
      uploadDir: cf.uploadDir
    })

    form.parse(req, function(err, fields, files) {
      if (err) {
        console.log("getRequestForm err: ", err)
        reject(err)
      }
      resolve({ fields, files })
    })
  })
}

function getRequestFiles(req, cf = config) {
  return getRequestForm(req, cf).then(({ fields, files }) => files)
}

module.exports = {
  getRequestForm,
  getRequestFiles
}