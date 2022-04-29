export class ProjectMetadata {
  /**
   * 项目ID
   * @type {number}
   */
  id
  /**
   * 项目名
   * @type {string}
   */
  name
  /**
   * 小红点列表
   * @type {RedPoint[]}
   */
  points
}

class RedPoint{
  /**
   * 小红点标号
   * @type {number}
   */
  id
  /**
   * @type {Position}
   */
  position
  /**
   * 小红点类型
   * 1:word 2:image
   * @type {number}
   */
  type = 1

  /**
   * 小红点渲染模式（样板）
   * @type {Pattern}
   */
  pattern
}

class Position{
  x = 0
  y = 0
}

class Pattern{
  /**
   * 对齐方式
   * 1：以小红点左上角为输入左上角
   * 2：以小红点中心为输入左上角
   *
   * 3：以小红点中心为输入中心
   *
   * 4：以小红点右下角为输入右下角
   * 5：以小红点中心为输入右下角
   * @type {number}
   */
  align = 1
}

class FontPattern extends Pattern {
  fontType = "宋体"
  fontSize = 16
  bold = false
  italic = false
}

class PicturePattern extends Pattern{
  width
  height
}