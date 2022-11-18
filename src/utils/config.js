import httpx2 from "./httpx2";
import urls from "../data/urls";

const host = document.domain.split(".")[0]

const namespace = `ag/${host}`

let maxId = 0

let configMap = {}

const onChangeCallBacks = {}

const loadConfig = async () => {
  let resp = await httpx2.get(urls.cfg.get + '?namespace=' + namespace)
  if (!resp.s) {
    console.error(resp)
    return
  }
  let newConfig = resp.d
  Object.keys(newConfig).forEach(key => {
    if (configMap[key] === newConfig[key]) {
      return
    }
    configMap[key] = newConfig[key]
    Object.keys(onChangeCallBacks)
      .map(callBackId => onChangeCallBacks[callBackId])
      .filter(callBack => callBack.key === key)
      .forEach(callBack => callBack.fn(newConfig[key]))
  })
}

const addListener = (key, fn) => {
  let newId = maxId++
  onChangeCallBacks[newId] = {
    key, fn
  }
  return newId
}

const removeListener = (id) => delete onChangeCallBacks[id]

const getConfigMap = () => {
  if (configMap) return configMap;
  let str = localStorage.getItem("que-config")
  if (str == null) {
    loadConfig()
    return {}
  }
  configMap = JSON.parse(str)
  return configMap
}

const get = key => {
  let cfg = getConfigMap()
  return cfg[key]
}


loadConfig()
// 每隔 1 分钟，刷新一次最新配置
setInterval(loadConfig, 1000 * 60)

export default {
  get, addListener, removeListener
}