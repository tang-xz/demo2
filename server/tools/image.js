let { getRequestForm } = require("./bodyParser")
let Jimp = require("jimp")
const fs = require("fs")

function getBase64(path, mime = Jimp.MIME_PNG) {
  return new Promise((resolve, reject) => {
    Jimp.read(path)
      .then(function(image) {
        image.getBase64(mime, (err, base64) => {
          if (err) {
            reject({
              code: -1,
              error: err,
              msg: "jimp get base64 string error"
            })
          }
          resolve(base64)
        })
      })
      .catch(function(err) {
        reject({
          code: -1,
          error: err,
          msg: "jimp read image error"
        })
      })
  })
}

// 只接受单张图片
function clipAndGetBase64(req, cf = {}) {
  return getRequestForm(req).then(({ fields, files }) => {
    let position = JSON.parse(fields[cf.fieldName || "position"])
    let filePath = files[cf.fileName || "image"][0].path
    return Jimp.read(filePath)
      .then(function(image) {
        return Promise.all(
          position.map((p, i) => {
            return new Promise((resolve, reject) => {
              let img = image.clone()
              let imgSave = image.clone()
              imgSave.write(i + ".jpg")
              img.crop(p.x, p.y, p.width, p.height).getBase64(Jimp.MIME_JPEG, function(err, data) {
                if (err) {
                  reject({
                    code: -1,
                    error: err,
                    msg: "Jimp get base64 error"
                  })
                }
                resolve(data)
              })
            })
          })
        ).finally(() => {
          fs.unlink(filePath)
        })
      })
      .catch(function(err) {
        Promise.reject({
          code: -1,
          error: err,
          msg: "jimp read image error"
        })
      })
  })
}

module.exports = {
  clipAndGetBase64,
  getBase64
}
