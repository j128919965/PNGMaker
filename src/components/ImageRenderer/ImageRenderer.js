import {A4Height, A4Width} from "../../data/constants";
import ImageLoader from "../../utils/imageLoader";

export default class ImageRenderer{

  /**
   * 项目元数据，需要手动设置，否则默认位空
   * 手动设置：load
   * @type {ProjectMetadata}
   */
  project

  /**
   * 用于后台渲染的canvas
   * @type {HTMLCanvasElement}
   */
  backGroundCanvas

  // 创建一个默认的ImageRenderer
  constructor() {
    let cvs = document.createElement("canvas")
    cvs.height = A4Height;
    cvs.width = A4Width;
    this.backGroundCanvas = cvs;
  }

  /**
   * 在渲染、预览前手动设置project
   * @param project
   */
  load(project) {
    this.project = project
  }

  /**
   * 渲染，并且在预览canvas上进行展示
   * <br/><strong>异步函数！</strong>
   * @param canvas {HTMLCanvasElement} 用于显示预览的canvas
   * @param inputDataLoadResult {InputDataLoadResult} 数据列表
   */
  async showPreview(canvas,inputDataLoadResult){
    if (!canvas){
      throw new Error("未设置预览canvas！")
    }

    // 先渲染
    await this.render(inputDataLoadResult)

    // 在已设置的 previewCanvas 上展示
    // 自动缩放
    canvas.getContext('2d').drawImage(this.backGroundCanvas , 0 , 0 , canvas.width , canvas.height)
  }

  /**
   * 渲染图片，将图片暂存到backGroundCanvas上
   * <br/><strong>异步函数！</strong>
   * @param data
   */
  async render(data){
    // 先检查数据是否和本项目对应
    this.checkData(data)

    // TODO: 渲染（绘制）
    // 注意point位置的等比例缩放
    const proj = this.project
    const canvas = this.backGroundCanvas
    const context = canvas.getContext("2d")

    // 绘制背景
    if (proj.background){
      let backgroundPicture = await ImageLoader.load(proj.background)
      context.drawImage(backgroundPicture , 0,0 , A4Width , A4Height)
    }

    // 按照小红点一个一个绘制
    proj.points.forEach(point => {
      // TODO
    })
  }

  /**
   * 检查传入的数据是否格式正确
   * 主要检查：每一项的类型是否对应、必填项是否填写正常（字符串是否为空、如果是）
   * @param inputDataLoadResult {InputDataLoadResult}
   */
  checkData(inputDataLoadResult){
    // TODO: 一条一条检查是否正常，如果不想检查也可以先放一放

  }

  /**
   * 将已渲染好的图片下载下来
   */
  download(){
    // TODO: 下载逻辑
  }


}
