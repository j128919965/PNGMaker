import {Component} from "react";

import "./ProjectEditor.css"
import ImageLoader from "../../utils/imageLoader";
import canvasx from '../../utils/canvasx'
import {EditorHeight, EditorWidth} from "../../data/constants";
import {RedPoint} from "../../data/ProjectMetadata";

export default class ProjectEditor extends Component {
  /**
   * 用于编辑、展示小红点的canvas
   * @type {HTMLCanvasElement}
   */
  canvas;

  /**
   * @type {ProjectMetadata}
   */
  project

  constructor(props) {
    super(props)
    this.props = props
    this.state = {
      ready: false
    }
  }

  /**
   *
   * @param proj {ProjectMetadata}
   * @return {Promise<void>}
   */
  async resetProj(proj) {
    if (proj == null) {
      this.setState({ready: false})
      return
    }
    this.prepareCanvas()
    if (proj.background) {
      // 提前加载
      await ImageLoader.load(proj.background)
    }
    this.project = proj

    await this.redraw()
    this.setState({ready: true})
  }

  async redraw() {
    let proj = this.project
    // 先绘制背景图片
    /**
     *
     * @type {CanvasRenderingContext2D}
     */
    let ctx = this.canvas.getContext('2d')
    if (proj.background != null) {
      let img = await ImageLoader.load(proj.background)
      ctx.drawImage(img, 0, 0, EditorWidth, EditorHeight)
    }

    for (let point of proj.points) {
      canvasx.drawPoint(ctx, point)
    }
  }

  prepareCanvas() {
    /**
     *
     * @type {HTMLCanvasElement}
     */
    let canvas = document.getElementById("pe-editor")
    this.canvas = canvas
    // TODO: 编辑小红点属性
    canvas.onclick = (e) => {
      if (canvas.isClicking){
        if (this.project.points.length === 0) {
          return
        }
        let position = canvasx.getMousePosition(e, canvas);
        let redPoints = this.project.points;
        let redPoint = canvasx.chooseRedPoint(position, redPoints);
        if (redPoint) {
          this.showRedPointEdit(redPoint)
        }
      }
    }

    canvas.onmousedown = (e) => {
      let position = canvasx.getMousePosition(e, canvas)
      let redPoints = this.project.points;
      let chosenRedPoint = canvasx.chooseRedPoint(position, redPoints);
      if (!chosenRedPoint) {
        return
      }
      canvas.onmouseup = (ev) => {
        canvas.onmouseup = null
        canvas.onmousemove = null
        if (canvasx.calcDistance(position , canvasx.getMousePosition(ev,canvas)) <= 2){
          canvas.isClicking = true
        }else {
          canvas.isClicking = false
        }
      }
      canvas.onmousemove = (ev) => {
        let newPos = canvasx.getMousePosition(ev, canvas)
        chosenRedPoint.moveTo(newPos)
        this.redraw()
        this.props.onProjectUpdate(this.project)
      }

    }

    canvas.ondblclick = (e) => {
      let position = canvasx.getMousePosition(e, canvas);
      let point = RedPoint.fromObj({id: this.project.points.length + 1, position})
      this.project.points.push(point)
      this.redraw()
      this.props.onProjectUpdate(this.project)
    }
  }

  componentDidMount() {
    if (this.project) {
      this.prepareCanvas()
    }
  }


  showRedPointEdit(redPoint) {
    alert(redPoint.id)
  }

  render() {
    const {ready} = this.state
    return (
      <div className="m-pe-container">
        <canvas id="pe-editor" style={{display: ready ? 'block' : 'none'}} width={EditorWidth}
                height={EditorHeight}/>
        {
          !ready &&
          <div style={{width: EditorWidth, height: EditorHeight}} className="m-pe-empty">
            请打开或新建项目
          </div>
        }
      </div>
    );
  }
}
