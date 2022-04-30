const ImageLoader = {
  /**
   * 加载成功图片后再返回
   * <b>多次调用同一个链接 不会产生副作用</b>
   * @param url
   * @return {Promise<HTMLImageElement>}
   */
  load : (url)=>{
    const img = new Image()
    img.src = url
    return new Promise((res,rej)=>{
      img.onload = ()=>res(img)
      img.onerror = e=>rej(e)
    })
  }
}

export default ImageLoader