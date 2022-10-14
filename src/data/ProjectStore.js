import {ProjectMetadata} from "./ProjectMetadata";
import urls from "./urls";
import httpx2 from "../utils/httpx2";
import {message} from "antd";

const ProjectStore = {
    async getAll() {
        const resp = await httpx2.get(urls.projects.getAll)
        console.log(resp)
        return resp.d
    },
    async getById(id) {
        let resp = await httpx2.get(urls.projects.getById + `?id=${id}`)
        return ProjectMetadata.fromObj(JSON.parse(resp.d.content))
    },
    async createNewProject() {
        let proj = ProjectMetadata.default(1)
        let resp = await httpx2.post(urls.projects.create, {content: JSON.stringify(proj)})
        if (!resp.s) {
            message.error(resp.m)
            return null
        }
        resp = resp.d
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
     * @return {Promise<Boolean>}
     */
    async save(proj) {
        return httpx2.post(urls.projects.save, proj.toBackendObj())
    },
    /**
     * 删除
     * @return {Promise<boolean>}
     */
    async delete(id) {
        return httpx2.post(urls.projects.del + '?id=' + id)
    },
}

export default ProjectStore
