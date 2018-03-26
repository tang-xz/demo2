let button = document.getElementById('button')
let buttonGetUsers = document.getElementById('getUsers')
let image = document.getElementById('image')
let file = null

function uploadImage() {
  let formData = new FormData()
  formData.append('file', file)

  axios({
    method: 'POST',
    url: '/weapp/face/search',
    data: formData
  })
    .then(function(response) {
      console.log(1, response.data)
    })
    .catch(function(error) {
      console.log(0, error)
    })
}

image.addEventListener('change', function fileChange(e) {
  file = e.target.files[0]
})

button.addEventListener('click', uploadImage)

buttonGetUsers.addEventListener('click', function() {
  axios
    .get('/weapp/face/users', {
      params: { group_id: 'set0001' }
    })
    .then(function(response) {
      console.log(1, response.data.data.result)
    })
    .catch(function(error) {
      console.log(0, error)
    })
})
