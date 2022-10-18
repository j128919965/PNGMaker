import urls from "../data/urls";

const uploadImage = async (file, needCompress) => {
  let form = new FormData();
  // form.append('file', file)
  form.append('image', file)
  if (needCompress){
    let compressCanvas = document.createElement("canvas")
    let width = file.width
    let height = file.height
    let scale = height / width
    let quality = 0.5
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    // 创建属性节点
    const anw = document.createAttribute('width')
    anw.nodeValue = w
    const anh = document.createAttribute('height')
    anh.nodeValue = h
    canvas.setAttributeNode(anw)
    canvas.setAttributeNode(anh)
    ctx.drawImage(file, 0, 0, w, h)
    // 图像质量
    if (file.quality && file.quality <= 1 && file.quality > 0) {
      quality = file.quality
    }
    const data = canvas.toDataURL('image/jpeg', quality)
  }
  return new Promise((resolve, reject) => {
    fetch(urls.files.upload, {
      method: 'POST',
      body: form,
    })
      .then(async e => {
        if (e.ok) {
          let resp = await e.json();
          resolve(resp)
        }
      })
      .catch(e => {
        resolve({success: false, message: "网络错误"})
        console.error(e)
      })
  })
}

const files = {
  /**
   * 上传文件，并获取URL
   * @return {Promise<string>}
   */
  readFile(onSubmitOpen) {
    return new Promise((res, rej) => {
      const reader = document.getElementById('upload-block-real-input')
      reader.onchange = async () => {
        if (onSubmitOpen){
          onSubmitOpen()
        }
        let file = reader.files[0]
        if (file.size > 1024 * 1024 * 10) {
          rej("文件大小不能大于10m")
        }
        let resp = await uploadImage(file)
        if (resp.success) {
          res(resp.url)
        } else {
          rej(resp.message)
        }
      }
      reader.click()
    })
  },

  // uploadImage: async (file) => {
  //   console.warn("模拟文件上传")
  //   return "https://s2.loli.net/2022/04/30/x8ZALg4NSRpcqU2.jpg"
  // }
  uploadImage
}


export default files
