import {Component} from "react";

import "./ProjectEditor.css"

export default class ProjectEditor extends Component{
  /**
   * 用于编辑、展示小红点的canvas
   * @type {HTMLCanvasElement}
   */
  canvas;

  project

  constructor(props) {
    super(props)
    this.props = props
  }

  resetProj(proj){
    if (proj == null){
      return
    }
    // TODO 绘制小红点
    let ctx = this.canvas.getContext('2d')
    ctx.fillStyle = "#f00"
    ctx.fillRect(0,0,100,100)
    this.project = proj
  }

  componentDidMount() {
    this.canvas = document.getElementById("pe-editor")
  }


  render() {
    return (
      <div className="m-pe-container">
        <canvas id="pe-editor" width="800" height="473"/>
      </div>
    );
  }
}