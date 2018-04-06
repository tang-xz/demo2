;(function() {
  let canvas = document.querySelector("#canvas")
  let file1 = document.querySelector(".canvas-image-1")
  let file2 = document.querySelector(".canvas-image-2")
  let button = document.querySelector(".draw")
  let button2 = document.querySelector(".draw2")
  let img = document.querySelector(".canvas-img")
  let img2 = document.querySelector(".canvas-img-2")
  var ctx = canvas.getContext("2d")

  function drawImage1(image1) {
    ctx.drawImage(img, 10, 10)
  }

  function getData() {
    var imgData = ctx.getImageData(10, 10, canvas.width, canvas.height)
    var base64 = base64js.fromByteArray(imgData.data)
    img2.src = "data:image/jpeg;base64,/9j/" + base64
  }

  button.addEventListener("click", drawImage1)
  button2.addEventListener("click", getData)
})()
