export class InputData{
  /**
   * 数据类型，文字 or 图片
   * word : 1 or image : 2
   * @type {number}
   */
  type = 1
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