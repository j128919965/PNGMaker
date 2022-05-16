const cache = {}

const ImageLoader = {
  /**
   * 加载成功图片后再返回
   * <b>多次调用同一个链接 不会产生副作用</b>
   * @param url
   * @return {Promise<HTMLImageElement>}
   */
  load : (url)=>{
    if (cache[url]) return cache[url]
    const img = new Image()
    img.setAttribute('crossOrigin', 'anonymous')
    img.src = url
    return new Promise((res,rej)=>{
      setTimeout(()=>rej("加载图片超时，请检查") , 10000)
      img.onload = ()=>{
        cache[url] = img
        res(img)
      }
      img.onerror = e=>rej(e)
    })
  }
}

export default ImageLoader
