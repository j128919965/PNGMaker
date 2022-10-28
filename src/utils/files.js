import urls from "../data/urls";
import Compress from "./Compress";


const imageCompress = (file) => {
  let data = ""//保存地址
  const reader = new FileReader()
  // 读取文件并将文件以URL的形式保存在resulr属性中 base64格式
  reader.readAsDataURL(file)
  // 文件读取完成时触发
  reader.onload = async e => {
    const image = new Image()
    if (typeof e.target.result === 'object') {
      // 把Array Buffer转化为blob 如果是base64不需要
      data = window.URL.createObjectURL(new Blob([e.target.result]))
    } else {
      data = e.target.result//base64格式图片地址
    }
  }
}

const uploadImage = async (file) => {
  let form = new FormData();
  // form.append('file', file)
  form.append('image', file)
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
  readFile(onSubmitOpen, needCompress = true) {
    return new Promise((res, rej) => {
      const reader = document.getElementById('upload-block-real-input')
      reader.onchange = async () => {
        if (onSubmitOpen) {
          onSubmitOpen()
        }
        let file = reader.files[0]
        file = await new Compress(file, -1, needCompress ? 0.2 : 0.6).compressUpload()
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

  uploadImage
}


export default files
