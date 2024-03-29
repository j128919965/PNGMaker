import errors from "../utils/errors";

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

  /**
   * 背景图片
   * @type {string}
   */
  background

  latestPointId

  role

  outputNamePattern

  antiShakeTime

  static default(id) {
    return ProjectMetadata.fromObj({id})
  }

  static fromObj(obj) {
    let proj = new ProjectMetadata();
    proj.id = obj?.id ?? errors.throw("id 不能为空")
    proj.name = obj?.name ?? `项目 ${proj.id}`
    proj.background = obj?.background
    proj.points = []
    obj.points?.forEach(p => proj.points.push(RedPoint.fromObj(p)))
    proj.latestPointId = obj?.latestPointId ?? 0
    proj.role = obj?.role ?? 0
    proj.outputNamePattern = obj?.outputNamePattern ?? "${project.name} ${now.year}${now.month}${now.day}"
    proj.antiShakeTime = obj?.antiShakeTime ?? 30
    return proj
  }

  createNextPoint(position) {
    let redPoint = RedPoint.fromObj({id: this.latestPointId + 1, position: position});
    this.points.push(redPoint)
    this.latestPointId++
    return redPoint
  }

  toBackendObj() {
    let content = JSON.stringify(this)
    return {id: this.id, name: this.name, content, role: this.role}
  }
}

export class RedPoint {
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

  /**
   * 备注
   * @type {string}
   */
  label = ""

  /**
   * 默认值（公式）
   * @type {string}
   */
  defaultValue = ""

  /**
   * 是否可见
   * @type {boolean}
   */
  visible = true

  /**
   * 是否必填
   * @type {boolean}
   */
  isNecessary = false

  /**
   * 移动
   * @param pos {Position}
   */
  moveTo(pos) {
    this.position = pos
  }

  clone(){
    return RedPoint.fromObj(this)
  }

  /**
   * 创建默认小红点，必须传入ID
   * @param id
   * @returns {RedPoint}
   */
  static default(id) {
    return RedPoint.fromObj({id})
  }

  /**
   * 从JSON.parse返回的对象，创建一个当前类的实例
   * @param obj
   * @returns {RedPoint}
   */
  static fromObj(obj) {
    let point = new RedPoint()
    point.id = obj?.id ?? errors.throw("红点ID不能为空")
    point.position = Position.fromObj(obj?.position)
    point.type = obj?.type ?? 1
    point.label = obj?.label ?? ''
    point.defaultValue = obj?.defaultValue ?? ''
    point.visible = obj?.visible ?? true
    point.isNecessary = obj?.isNecessary ?? false
    if (point.type === 1) {
      point.pattern = FontPattern.fromObj(obj?.pattern)
    } else if (point.type === 2) {
      point.pattern = PicturePattern.fromObj(obj?.pattern)
    } else {
      errors.throw("小红点类型必须是1或2中的一个！")
    }
    return point
  }
}

export class Position {
  x = 0
  y = 0

  constructor(x, y) {
    this.x = x
    this.y = y
  }


  static default() {
    return Position.fromObj(null)
  }

  /**
   * 从JSON.parse返回的对象，创建一个当前类的实例
   * @param obj
   * @returns {Position}
   */
  static fromObj(obj) {
    return new Position(obj?.x ?? 0, obj?.y ?? 0)
  }

}

export class Pattern {
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

  static checkAlign = (align) => {
    if (align > 5 || align < 1) {
      errors.throw("对齐方式错误！")
    }
  }

  /**
   * @return {Pattern}
   */
  clone() {
    errors.throw("implement me !")
  }
}

export class FontPattern extends Pattern {
  fontType
  fontSize
  color
  bold
  italic

  setCanvasProperties(canvas) {
    let context = canvas.getContext("2d");
    context.font = this.fontType
  }

  static default() {
    return FontPattern.fromObj(null)
  }

  /**
   * 从JSON.parse返回的对象，创建一个当前类的实例
   * @param obj
   * @returns {FontPattern}
   */
  static fromObj(obj) {
    let pattern = new FontPattern()
    Pattern.checkAlign(obj?.align)
    pattern.align = parseInt(obj?.align ?? 1)
    pattern.bold = obj?.bold ?? false
    pattern.italic = obj?.italic ?? false
    pattern.fontSize = obj?.fontSize ?? 16
    pattern.fontType = obj?.fontType ?? '宋体'
    pattern.color = obj?.color ?? '#333'
    return pattern
  }

  clone() {
    return FontPattern.fromObj(this)
  }

}

const ShapeType = {
  Rect : 0,
  Circle : 1
}

export class PicturePattern extends Pattern {
  shapeType
  width
  height
  radius

  static default() {
    return PicturePattern.fromObj(null)
  }

  /**
   * 从JSON.parse返回的对象，创建一个当前类的实例
   * @param obj
   * @returns {PicturePattern}
   */
  static fromObj(obj) {
    let pattern = new PicturePattern()
    Pattern.checkAlign(obj?.align)
    pattern.align = parseInt(obj?.align ?? 1)
    pattern.shapeType = obj?.shapeType ?? 0
    pattern.height = obj?.height ?? 100
    pattern.width = obj?.width ?? 100
    pattern.radius = obj?.radius ?? 50
    return pattern
  }

  clone() {
    return PicturePattern.fromObj(this)
  }
}
