import urls from "../data/urls";

const uploadImage = async (file) => {
  let form = new FormData();
  // form.append('file', file)
  form.append('image', file)
  return new Promise((resolve, reject) => {
    // TODO: update
    // fetch('https://service-eybsd6ln-1307637143.sh.apigw.tencentcs.com/release/upload', {
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

  uploadImage: async (file) => {
    console.warn("模拟文件上传")
    return "https://s2.loli.net/2022/04/30/x8ZALg4NSRpcqU2.jpg"
  }
  // uploadImage
}


export default files
