import {InputData , InputDataLoadResult} from "./InputData";

const InputDataStore = {
  /**
   * 获取云端存储的还未渲染的暂存数据
   * @return {Promise<InputDataLoadResult[]>}
   */
  async getNoRendered(){
    return [
        InputDataLoadResult.success([])
    ]
  },
  /**
   * 上传数据到服务端
   * @param data
   * @return {Promise<void>}
   */
  async save(data){

  },
  /**
   * 从文件中读取数据
   * @param file
   * @return {Promise<InputDataLoadResult[]>}
   */
  async loadFromExcel(file){
    return []
  }
}

export default InputDataStore