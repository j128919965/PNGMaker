const files = {
  /**
   * 上传文件，并获取URL
   * @return {Promise<string>}
   */
  readFile(){
    return new Promise((res,rej)=>{
      const reader = document.getElementById('upload-block-real-input')
      reader.onchange = async ()=>{
        let file = reader.files[0]
        if (file.size > 1024*1024*10){
          rej("文件大小不能大于10m")
        }
        let resp = await uploadImage(file)
        if (resp.success) {
          res(resp.url)
        }else {
          rej(resp.message)
        }
      }
      reader.click()
    })

  }
}

const uploadImage = async (file)=>{
  let form = new FormData();
  form.append('file',file)
  return new Promise((resolve,reject)=>{
    // TODO: update
    fetch('https://service-eybsd6ln-1307637143.sh.apigw.tencentcs.com/release/upload',{
      method:'POST',
      body:form,
    }).then(async e=>{
      if (e.ok){
        let resp = await e.json();
        if (resp.success) {
          resolve(resp)
        }
      }else {
        console.error(e)
        resolve({success:false,message:"网络错误"})
      }

    }).catch(e=>{
      resolve({success:false,message:"网络错误"})
      console.error(e)
    })
  })
}

export default files
