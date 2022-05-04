export class InputData{

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
   * @type {InputData[]}
   */
  data

  static success(data){
    let result = new InputDataLoadResult();
    result.success = true
    result.data = data
    return result
  }
}