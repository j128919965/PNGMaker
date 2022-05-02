import {Position} from "../data/ProjectMetadata";
import {RedPointSize} from "../data/constants";

/**
 * 获取鼠标相对于canvas的位置
 * @param event {MouseEvent}
 * @param canvas {HTMLCanvasElement}
 * @return {Position}
 */
const getMousePosition = (event, canvas) => {
  let rectangle = canvas.getBoundingClientRect();
  let mouseX = (event.clientX - rectangle.left);
  let mouseY = (event.clientY - rectangle.top);
  return new Position(mouseX, mouseY)
}

/**
 * 计算两点距离
 * @param start {Position}
 * @param end {Position}
 * @return {number}
 */
const calcDistance = (start, end) => Math.sqrt((end.x - start.x) * (end.x - start.x) + (end.y - start.y) * (end.y - start.y))


/**
 * 自上而下遍历所有redPoint，并记录点击时位于最上方的redPoint，返回null时则无锁定点
 * @param pos {Position}
 * @param redPoints {RedPoint[]}
 * @return {RedPoint}
 */
const chooseRedPoint = (pos, redPoints) => {
  for (let point of redPoints) {
    if (calcDistance(pos, point.position) <= RedPointSize) {
      return point
    }
  }
  return null
}

/**
 *
 * @param context {CanvasRenderingContext2D}
 * @param point {RedPoint}
 */
const drawPoint = (context, point)=>{
  const { position , id } = point
  context.beginPath();
  context.arc(position.x, position.y, RedPointSize, 0, 2 * Math.PI);
  context.fillStyle = "red"
  context.fill()
  context.font = 'normal 8pt "楷体"'
  context.align = 'center'
  context.fillStyle = 'white'
  let width = context.measureText(id).width
  context.fillText(id, position.x - width/2, position.y + 4)
}

const canvasx = {
  getMousePosition,calcDistance,chooseRedPoint,drawPoint
}

export default canvasx