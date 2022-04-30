import {ProjectMetadata} from "./ProjectMetadata";

const getNextProjectId = async () => {
  // TODO 调接口
  return 1
}

const ProjectStore = {
  async getById(id) {
    // TODO 调接口
    let obj = {id}
    return ProjectMetadata.fromObj(obj)
  },
  async createNewProject() {
    // TODO 调接口
    let nextId = await getNextProjectId()
    return ProjectMetadata.default(nextId)
  },
  /**
   * 保存
   * @param proj {ProjectMetadata}
   * @return {Promise<void>}
   */
  async save(proj) {
    // TODO 调接口
  },
  /**
   * 删除
   * @param proj {ProjectMetadata}
   * @return {Promise<void>}
   */
  async delete(proj){
    // TODO 调接口
    console.log(`delete proj {${proj}`)
  }
}

export default ProjectStore