export const loadImage = (url)=>{
  const img = new Image()
  img.src = url
  return new Promise((res,rej)=>{
    img.onload = ()=>res(img)
    img.onerror = e=>rej(e)
  })
}