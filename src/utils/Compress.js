import {message} from "antd";

class Compress {
  constructor(file, width = -1, quality = 0.2, targetSize = 3) {
    this.file = file//文件
    this.width = width//不传初始赋值-1，等比缩放不用传高度
    this.quality = quality//不传初始赋值0.2。值范围0~1
    this.targetSize = targetSize//目标大小，控制上传图片大小 传值方式：targetSize:1 * 1024 * 1024的值默认3m
  }

  // 压缩
  compressUpload() {
    const rawImage = this.file//获取文件
    if (!rawImage) return false
    if (!this.isImage(rawImage)) {
      return false
    }
    return new Promise(async (resolve, reject) => {
      if (!this.isLimitSize(rawImage)) {
        // 需压缩
        let imageFile = await this.readImage(rawImage)
        resolve(imageFile.file)
        console.log('压缩后上传')
      } else {
        // 无需压缩
        resolve(rawImage)
        console.log('原图上传')
      }
    })
  }

  /**
   * @desc 图片压缩
   * @param image 被压缩的img对象
   * @param type 压缩后转换的文件类型
   **/
  // 对图片进行处理
  readImage(file) {
    return new Promise((resolve, reject) => {
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
        image.src = data
        image.onload = async e => {
          const canvas = document.createElement('canvas')
          const context = canvas.getContext('2d')
          const {width: originWidth, height: originHeight} = image
          // 目标尺寸
          let targetWidth = originWidth
          let targetHeight = originHeight
          // 获得长宽比例
          const scale = targetWidth / targetHeight;
          //获取压缩后的图片宽度,如果width为-1，默认原图宽度
          targetWidth = this.width === -1 ? targetWidth : this.width;
          //获取压缩后的图片高度,如果width为-1，默认原图高度
          targetHeight = this.width === -1 ? targetHeight : parseInt(this.width / scale);
          canvas.width = targetWidth
          canvas.height = targetHeight
          context.clearRect(0, 0, targetWidth, targetHeight)
          context.fillStyle = '#fff'
          // 图片绘制
          context.drawImage(image, 0, 0, targetWidth, targetHeight)
          let dataUrl = canvas.toDataURL(file.type, this.quality || 0.92)//0.92为压缩比，可根据需要设置，设置过小会影响图片质量
          let fileObj = await this.dataURItoBlob(dataUrl, file.type, file)
          resolve(fileObj)
        }
      }
      reader.onerror = e => {
        message.error('图片读取出错!')
      }
    })
  }

  // base64转为Blob
  async dataURItoBlob(dataurl, type = "image/png", file) {
    return new Promise((resolve, reject) => {
      const filename = 'file'
      let arr = dataurl.split(',')
      let mime = arr[0].match(/:(.*?);/)[1]
      let suffix = mime.split('/')[1]
      let bstr = atob(arr[1])
      let n = bstr.length
      let u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      const miniFile = new File([u8arr], `${filename}.${suffix}`, {type: mime})
      resolve({
        file: miniFile,
        origin: file,
        beforeKB: Number((file.size / 1024).toFixed(2)),
        afterKB: Number((miniFile.size / 1024).toFixed(2))
      })
    })
  }

  // 判断上传的图片格式是否符合要求
  isImage(image) {
    return /\.(jpg|png|bmp|jpeg|webp|gif)$/.test(image.name)
  }

  // 判断图片是否过大
  isLimitSize(image) {
    const isLimitSize = this.targetSize < (image.size / 1024 / 128)
    if (!isLimitSize) {
      return true
    } else {
      return false
    }
  }
}

export default Compress
