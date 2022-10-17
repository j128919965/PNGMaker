let input = document.getElementById("demoUpload")
let cvs = document.getElementById('fuckCanvas')
let ctx = cvs.getContext('2d')

function drawToCanvas(imgData) {
  let img = new Image
  img.src = imgData
  img.onload = function () {
    ctx.drawImage(this.img, 0, 0, 300, 400)
    let strDataURI = cvs.toDataURL()
  }
}

input.onchange = () => {
  let file = this.files[0]
  let reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = function (e) {
    drawToCanvas(this.result)
  }
}