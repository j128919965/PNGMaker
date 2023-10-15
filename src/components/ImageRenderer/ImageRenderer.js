import {A4Height, A4Width, EditorHeight, EditorWidth, RedPointSize} from "../../data/constants";
import ImageLoader from "../../utils/imageLoader";
import {Position} from "../../data/ProjectMetadata";
import {message} from "antd";
import formula from "../../utils/formula";
import fontx from "../../utils/fontx";
import messagex from "../../utils/messagex";

const LargerRedPointSize = RedPointSize * A4Width / EditorWidth;

export default class ImageRenderer {

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
  async showPreview(canvas, inputDataLoadResult) {
    if (!canvas) {
      throw new Error("未设置预览canvas！")
    }

    // 先渲染
    try {
      await messagex.load('渲染中，请稍后',()=>this.render(inputDataLoadResult.data))
    } catch (e) {
      message.error(e)
      throw e
    }


    // 在已设置的 previewCanvas 上展示
    // 自动缩放
    canvas.getContext('2d').drawImage(this.backGroundCanvas, 0, 0, canvas.width, canvas.height)
  }

  /**
   * 渲染图片，将图片暂存到backGroundCanvas上
   * <br/><strong>异步函数！</strong>
   * @param data {InputData[]}
   */
  async render(data) {
    // message.info("图片资源加载中，请稍候")
    const getData = (id) => {
      for (let datum of data) {
        if (datum.pointId === id) {
          return datum.data
        }
      }
      console.error(`ID为${id}的输入项为空！`)
    }

    let set = {}
    this.project.points.filter(p => p.type === 1).map(p => p.pattern.fontType)
      .filter(font => !fontx.supportFont(font)).forEach(font => set[font] = 1)
      message.warn(`本机未安装字体 ${Object.keys(set).join(',')}，出图将无法使用该字体`)

    // 注意point位置的等比例缩放
    let trulyPos = {}
    const proj = this.project
    for (let p of proj.points) {
      trulyPos[p.id] = new Position((p.position.x * A4Width) / EditorWidth, (p.position.y * A4Height) / EditorHeight)
    }
    const canvas = this.backGroundCanvas
    const context = canvas.getContext("2d")

    // 绘制背景
    if (proj.background) {
      let backgroundPicture = await ImageLoader.load(proj.background)
      context.drawImage(backgroundPicture, 0, 0, A4Width, A4Height)
    } else {
      context.clearRect(0, 0, A4Width, A4Height)
    }

    // 按照小红点一个一个绘制
    for (const point of proj.points) {
      if (!getData(point.id)) {
        continue
      }
      if (point.type === 1) {
        context.fillStyle = point.pattern.color
        context.font = (point.pattern.italic ? "italic " : "normal ") + (point.pattern.bold ? "bolder " : "normal ") + point.pattern.fontSize * 3 + "px " + point.pattern.fontType
        let textWidth = context.measureText(getData(point.id)).width
        switch (point.pattern.align) {
          case 1:
            context.textBaseline = "top"
            context.fillText(getData(point.id), trulyPos[point.id].x - LargerRedPointSize, trulyPos[point.id].y - LargerRedPointSize)
            break
          case 2:
            context.textBaseline = "top"
            context.fillText(getData(point.id), trulyPos[point.id].x, trulyPos[point.id].y)
            break
          case 3:
            context.textBaseline = "middle"
            context.fillText(getData(point.id), trulyPos[point.id].x - textWidth / 2, trulyPos[point.id].y)
            break
          case 4:
            context.textBaseline = "bottom"
            context.fillText(getData(point.id), trulyPos[point.id].x - textWidth - LargerRedPointSize, trulyPos[point.id].y + LargerRedPointSize)
            break
          case 5:
            context.textBaseline = "bottom"
            context.fillText(getData(point.id), trulyPos[point.id].x - textWidth - LargerRedPointSize * 2, trulyPos[point.id].y)
            break
          default:
            break
        }

      } else if (point.type === 2) {
        let img = await ImageLoader.safeLoad(getData(point.id))
        if (img == null) {
          continue
        }
        let imgWidth = point.pattern.width * A4Width / EditorWidth
        let imgHeight = point.pattern.height * A4Height / EditorHeight
        switch (point.pattern.align) {
          case 1:
            context.drawImage(img, trulyPos[point.id].x - LargerRedPointSize, trulyPos[point.id].y - LargerRedPointSize, imgWidth, imgHeight)
            break
          case 2:
            context.drawImage(img, trulyPos[point.id].x, trulyPos[point.id].y, imgWidth, imgHeight)
            break
          case 3:
            context.drawImage(img, trulyPos[point.id].x - imgWidth / 2, trulyPos[point.id].y - imgHeight / 2, imgWidth, imgHeight)
            break
          case 4:
            context.drawImage(img, trulyPos[point.id].x - imgWidth + LargerRedPointSize, trulyPos[point.id].y - imgHeight + LargerRedPointSize, imgWidth, imgHeight)
            break
          case 5:
            context.drawImage(img, trulyPos[point.id].x - imgWidth, trulyPos[point.id].y - imgHeight, imgWidth, imgHeight)
            break
          default:
            break
        }
      }
    }
  }


  /**
   * 将已渲染好的图片下载下来
   * @param id {string?}
   * @param inputDataLoadResult {InputDataLoadResult}
   * @param project {ProjectMetadata}
   */
  async download(inputDataLoadResult, id, project) {
    this.backGroundCanvas.getContext('2d').clearRect(0, 0, A4Width, A4Height)
    await this.render(inputDataLoadResult.data)

    const MIME_TYPE = "image/png";
    const imgURL = this.backGroundCanvas.toDataURL(MIME_TYPE);
    const dlLink = document.createElement('a');

    let now = new Date()

    let pngName = this.project.name + " " + now.getFullYear() + (now.getMonth() + 1 > 10 ? now.getMonth() + 1 : "0" + (now.getMonth() + 1)) + (now.getDate() > 10 ? now.getDate() : "0" + now.getDate())
    let execResult = formula.exec(project.outputNamePattern, null, project, inputDataLoadResult);
    if (execResult.s) {
      pngName = execResult.d
    }
    // if (id !== null) {
    //   pngName = pngName + " " + id
    // }
    dlLink.download = pngName;
    dlLink.href = imgURL;
    dlLink.dataset.downloader = [MIME_TYPE, dlLink.download, dlLink.href].join(':');

    document.body.appendChild(dlLink);
    dlLink.click();
    document.body.removeChild(dlLink);
  }


}
