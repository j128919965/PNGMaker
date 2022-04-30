import {Component} from "react";

import "./ProjectEditor.css"
import ImageLoader from "../../utils/imageLoader";

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

  async resetProj(proj){
    console.log(proj)
    if (proj == null){
      return
    }
    // 先绘制背景图片
    let ctx = this.canvas.getContext('2d')
    if (proj.background != null){
      let img = await ImageLoader.load(proj.background)
      ctx.drawImage(img,0,0,800,473)
    }

    // TODO 根据project的points位置 生成小红点
    ctx.fillStyle = "#f00"
    ctx.fillRect(0,0,100,100)
    this.project = proj
  }

  componentDidMount() {
    let canvas = document.getElementById("pe-editor")
    this.canvas = canvas
    // TODO: 编辑小红点属性
    canvas.onclick = ()=>{
      // TODO 判断有没有按到小红点，注意两个小红点有重合时的判断
      if (true){

      }
    }
    // TODO: 小红点移动
    canvas.onmousedown = ()=>{
      // TODO 判断有没有按到小红点，注意两个小红点有重合时的判断
      if (true){

      }
    }
    // TODO: 创建小红点
    canvas.ondblclick = ()=>{

    }
  }


  render() {
    return (
      <div className="m-pe-container">
        <canvas id="pe-editor" width="800" height="473"/>
      </div>
    );
  }
}