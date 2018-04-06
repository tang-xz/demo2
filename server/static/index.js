let file = null,
  file2 = null

function fileToBase64(file, cb) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("no file"))
    }
    let prev = +new Date()
    var reader = new FileReader()
    reader.onloadend = function() {
      let diff = +new Date() - prev
      console.log("file to base64 consume: ", diff)
      var dataURL = reader.result
      cb && cb(dataURL)
      resolve(dataURL)
    }
    reader.readAsDataURL(file)
  })
}

document.getElementById("image").addEventListener("change", function fileChange(e) {
  file = e.target.files[0]
})
document.getElementById("image2").addEventListener("change", function fileChange(e) {
  file2 = e.target.files[0]
})

document.getElementById("search").addEventListener("click", () => {
  let formData = new FormData()
  formData.append("file", file)

  axios({
    method: "POST",
    url: "/weapp/face/search",
    data: formData
  })
    .then(function(response) {
      console.log(1, response.data)
    })
    .catch(function(error) {
      console.log(0, error)
    })
})

document.getElementById("getUsers").addEventListener("click", function() {
  axios
    .get("/weapp/face/users", {
      params: { group_id: "set0001" }
    })
    .then(function(response) {
      console.log(1, response.data.data.result)
    })
    .catch(function(error) {
      console.log(0, error)
    })
})

document.getElementById("match").addEventListener("click", function() {
  let formData = new FormData()
  formData.append("file", file)
  // formData.append("file2", file2)

  // fileToBase64(file, function() {
  //   console.log(22222)
  // }).then(dataURL => {
  //   console.log(123)
  // })

  // return

  axios({
    method: "POST",
    url: "/weapp/face/match",
    data: formData
  })
    .then(function(response) {
      console.log(1, response.data)
    })
    .catch(function(error) {
      console.log(0, error)
    })
})
