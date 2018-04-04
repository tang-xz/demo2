;(function() {
  let canvas = document.querySelector("#canvas")
  let file1 = document.querySelector(".canvas-image-1")
  let file2 = document.querySelector(".canvas-image-2")
  let button = document.querySelector(".draw")

  function handleFiles(files) {
    for (var i = 0; i < files.length; i++) {
      var file = files[i]
      var imageType = /^image\//

      if (!imageType.test(file.type)) {
        continue
      }

      var img = document.createElement("img")
      img.file = file

      var reader = new FileReader()
      reader.onload = (function(aImg) {
        return function(e) {
          aImg.src = e.target.result
        }
      })(img)
      reader.readAsDataURL(file)
    }
  }
  function drawImage(opt) {
    let option = Object.assign(
      {
        canvas: null,
        maxWidth: 2048,
        maxHeight: 2048,
        top: 0,
        left: 0,
        images: []
      },
      opt
    )

    option.images.forEach(item => {
      console.log(item)
    })

    console.log(12, option)
  }

  button.addEventListener("click", () => {
    if (file1 && file2) {
      drawImage({
        canvas,
        images: [file1, file2]
      })
    } else {
      console.error("images not enough")
    }
  })
})()
