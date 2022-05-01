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
 * 自上而下遍历所有redPoint，并记录点击时位于最上方的redPoint，返回-1时则无锁定点
 * @param pos {Position}
 * @param redPoints {RedPoint[]}
 * @return {number}
 */
const chooseRedPoint = (pos, redPoints) => {
  for (let i in redPoints) {
    if (calcDistance(pos, redPoints[i].position) <= RedPointSize) {
      return i
    }
  }
  return -1
}