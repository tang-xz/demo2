var Jimp = require("jimp")

Jimp.read("./images/1.jpeg")
  .then(function(image) {
    // do stuff with the image
    let image2 = image.clone()

    image.getBase64(Jimp.MIME_PNG, function(err, data) {
      if (err) {
        return
      }
    })
  })
  .catch(function(err) {
    // handle an exception
  })
