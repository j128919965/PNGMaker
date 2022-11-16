import {InputDataLoadResult} from "./InputData";
import urls from "./urls";
import {message} from "antd";
import httpx2 from "../utils/httpx2";
import {post} from "../utils/httpx";


const InputDataStore = {
  /**
   * 获取云端存储的还未渲染的暂存数据
   * @return {Promise<InputDataLoadResult[]>}
   */
  async getNotRenderedByProject(projectId) {
    let resp = await httpx2.get(urls.input.getNotRenderedByProject + `?projectId=${projectId}`)
    if (!resp.s) {
      message.error(resp.m)
      return []
    }
    let resps = resp.d
    resps.forEach(resp => resp.data = JSON.parse(resp.data))
    resps = resps.map(resp => InputDataLoadResult.fromObj(resp))
    return resps
  },

  async getAllByProject(projectId, rendered) {
    let resp = await httpx2.get(urls.input.getAllByProject + `?projectId=${projectId}`)
    if (!resp.s) {
      message.error(resp.m)
      return []
    }
    let resps = resp.d
    resps.forEach(resp => resp.data = JSON.parse(resp.data))
    resps = resps.filter(resp => resp.rendered === rendered).map(resp => InputDataLoadResult.fromObj(resp))
    return resps
  },

  async getPage(projectId, rendered, start, pageSize, order) {
    let resp = await httpx2.get(urls.input.getPage + `?projectId=${projectId}&num=${pageSize}&rendered=${rendered}&start=${start}&order=${order}`)
    if (!resp.s) {
      message.error(resp.m)
      return []
    }
    let {data, total} = resp.d
    data.forEach(resp => resp.data = JSON.parse(resp.data))
    data = data.map(resp => InputDataLoadResult.fromObj(resp))
    return {data, total}
  },

  async setRendered(id) {
    return httpx2.post(urls.input.setRendered + `?id=${id}`)
  },
  /**
   * 上传数据到服务端
   * @param result {InputDataLoadResult}
   * @return {Promise<WebResponse>}
   */
  async save(result) {
    let obj = {...result}
    obj.success = undefined
    obj.data = JSON.stringify(obj.data)
    return httpx2.post(urls.input.create, obj)
  },
  /**
   * 修改数据
   * @param result {InputDataLoadResult}
   * @return {Promise<WebResponse>}
   */
  async update(result) {
    let data = {
      id: result.id,
      data: JSON.stringify(result.data)
    }
    return httpx2.post(urls.input.update, data)
  },
  async remove(id) {
    let resp = await httpx2.post(urls.input.del + `?id=${id}`)
    return resp
  }
}

export default InputDataStore
