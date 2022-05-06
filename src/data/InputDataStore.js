import {InputDataLoadResult} from "./InputData";
import {get, post} from "../utils/httpx";
import urls from "./urls";

const InputDataStore = {
  /**
   * 获取云端存储的还未渲染的暂存数据
   * @return {Promise<InputDataLoadResult[]>}
   */
  async getNotRenderedByProject(projectId) {
    let resps = await get(urls.input.getNotRenderedByProject , {projectId})
    resps.forEach(resp=>resp.data = JSON.parse(resp.data))
    resps = resps.map(resp => InputDataLoadResult.fromObj(resp))
    return resps
  },
  /**
   * 上传数据到服务端
   * @param result {InputDataLoadResult}
   * @return {Promise<InputDataLoadResult>}
   */
  async save(result) {
    let obj = {...result}
    obj.data = JSON.stringify(obj.data)
    return post(urls.input.create, obj)
  },
  /**
   * 从文件中读取数据
   * @param file
   * @return {Promise<InputDataLoadResult[]>}
   */
  async loadFromExcel(file) {
    return []
  }
}

export default InputDataStore
