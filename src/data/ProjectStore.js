import {ProjectMetadata} from "./ProjectMetadata";
import {get, post} from "../utils/httpx";
import urls from "./urls";

const ProjectStore = {
  async getAll(){
    return get(urls.projects.getAll)
  },
  async getById(id) {
    let resp = await get(urls.projects.getById , {id})
    return ProjectMetadata.fromObj(JSON.parse(resp.content))
  },
  async createNewProject() {
    let proj = ProjectMetadata.default(1)
    let resp = await post(urls.projects.create, {content : JSON.stringify(proj)})
    proj = JSON.parse(resp.content)
    proj.id = resp.id
    proj.name = resp.name
    proj = ProjectMetadata.fromObj(proj)
    this.save(proj)
    return proj
  },
  /**
   * 保存
   * @param proj {ProjectMetadata}
   * @return {Promise<void>}
   */
  async save(proj) {
    await post(urls.projects.save , proj.toBackendObj())
  },
  /**
   * 删除
   * @return {Promise<void>}
   */
  async delete(id){
    return post(urls.projects.del+'?id='+id )
  },
}

export default ProjectStore