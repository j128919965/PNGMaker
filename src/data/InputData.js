import formula from "../utils/formula";

export class InputData {

  /**
   * 对应的小红点ID
   * @type {number}
   */
  pointId
  /**
   * 实际数据，文字 or url
   * @type {string}
   */
  data

  constructor(pointId, data) {
    this.pointId = pointId
    this.data = data
  }

  static fromObj(obj) {
    return new InputData(obj.pointId, obj.data)
  }
}

export class InputDataLoadResult {
  /**
   * 是否加载成功
   * @type {boolean}
   */
  success
  /**
   * 消息
   * @type {string}
   */
  message

  /**
   * 从服务器上获取的InputDataLoadResult会有一个ID
   * 其他地方获取的没有ID
   * @type {number}
   */
  id

  /**
   * 项目ID
   * @type {number}
   */
  projectId

  /**
   * @type {InputData[]}
   */
  data

  static success(data, projectId) {
    let result = new InputDataLoadResult();
    result.success = true
    result.data = data
    result.projectId = projectId
    return result
  }

  static failure(message) {
    let result = new InputDataLoadResult();
    result.success = false
    result.message = message
    return result
  }

  /**
   * 创建一个数据列表对象
   * @param map {Object} 在线编辑数据后得到的
   * @param project {ProjectMetadata}
   * @return {InputDataLoadResult}
   */
  static fromMap(map, project) {
    let result = new InputDataLoadResult();
    result.projectId = project.id
    result.success = true
    const data = Object.keys(map).map(key => new InputData(parseInt(key), map[key]))
    project.points.filter(p => p.defaultValue?.length > 0).forEach(p => {
      const value = formula.exec(p.defaultValue, p, project).d
      if (map[p.id.toString()] == null) {
        data.push(new InputData(p.id, value))
      } else if (map[p.id.toString()].length < 1) {
        data.filter(i => i.pointId === p.id)[0].data = value
      }
    })
    result.data = data
    return result
  }

  /**
   * 调接口获取对象
   * @param obj
   */
  static fromObj(obj) {
    let result = new InputDataLoadResult();
    result.id = obj.id
    result.projectId = obj.projectId
    result.success = obj.success ?? true
    result.data = obj.data.map(d => InputData.fromObj(d))
    return result
  }
}
