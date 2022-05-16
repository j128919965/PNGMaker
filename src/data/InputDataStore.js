import {InputDataLoadResult} from "./InputData";
import {get, post} from "../utils/httpx";
import urls from "./urls";

const InputDataStore = {
  /**
   * 获取云端存储的还未渲染的暂存数据
   * @return {Promise<InputDataLoadResult[]>}
   */
  async getNotRenderedByProject(projectId) {
    let resps = await get(urls.input.getNotRenderedByProject, {projectId})
    resps.forEach(resp => resp.data = JSON.parse(resp.data))
    resps = resps.map(resp => InputDataLoadResult.fromObj(resp))
    return resps
  },

  async getAllByProject(projectId) {
    let resps = await get(urls.input.getAllByProject , {projectId})
    resps.forEach(resp => resp.data = JSON.parse(resp.data))
    resps = resps.map(resp => InputDataLoadResult.fromObj(resp))
    return resps
  },

  async setRendered(id){
    let resp = await post(urls.input.setRendered+`?id=${id}`)
    return resp
  },
  /**
   * 上传数据到服务端
   * @param result {InputDataLoadResult}
   * @return {Promise<InputDataLoadResult>}
   */
  async save(result) {
    let obj = {...result}
    obj.success = undefined
    obj.data = JSON.stringify(obj.data)
    return post(urls.input.create, obj)
  },
  async remove(id){
    let resp = await post(urls.input.del+`?id=${id}`)
    return resp
  }
}

export default InputDataStore
