

let button = document.getElementById('button')
let image = document.getElementById('image')
let file = null

function uploadImage() {
  let formData = new FormData()
  formData.append('image', file)
  formData.append('test', 'test string')

  axios({
    method: "POST",
    url: "/detect",
    data: formData
  })
    .then(function(response) {
      console.log(1, response)
    })
    .catch(function(error) {
      console.log(0, error)
    })
}

function fileChange(e) {
  file = e.target.files[0]
}

image.addEventListener('change', fileChange)

button.addEventListener('click', uploadImage)