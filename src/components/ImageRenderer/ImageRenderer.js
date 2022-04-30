export default class ImageRenderer{

  /**
   * 项目元数据
   * @type {ProjectMetadata}
   */
  project

  /**
   * 用于后台渲染的canvas
   * @type {HTMLCanvasElement}
   */
  backGroundCanvas = document.createElement("canvas")


  load(project) {
    this.project = project
  }


  /**
   * 渲染，并且在预览canvas上进行展示
   * @param canvas {HTMLCanvasElement} 用于显示预览的canvas
   * @param data {InputData[]} 数据列表
   */
  showPreview(canvas,data){
    if (!canvas){
      throw new Error("未设置预览canvas！")
    }

    // 先渲染
    this.render(data)

    // TODO: 在已设置的 previewCanvas 上展示

  }

  /**
   * 渲染图片，将图片暂存到backGroundCanvas上
   * @param data
   */
  render(data){
    // 先检查数据是否和本项目对应
    this.checkData(data)
    // TODO: 渲染（绘制）
  }

  /**
   * 检查传入的数据是否格式正确
   * 主要检查：每一项的类型是否对应、必填项是否填写正常（字符串是否为空、如果是）
   * @param data {[InputData]}
   */
  checkData(data){
    // TODO: 一条一条检查是否正常
  }

  /**
   * 将已渲染好的图片下载下来
   */
  download(){
    // TODO: 下载逻辑
  }


}