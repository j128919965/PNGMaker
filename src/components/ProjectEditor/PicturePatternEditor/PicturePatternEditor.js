import {Input, Modal, Select} from "antd";
import {EditorHeight, EditorWidth, RedPointSize} from "../../../data/constants";
import React, {useEffect} from "react";
import ImageLoader from "../../../utils/imageLoader";
import {Position} from "../../../data/ProjectMetadata";

import './PicturePatternEditor.css'

const {Option} = Select

const getLeftTopPosition = (w, h, p) => {
  const scaleW = w / EditorWidth
  const scaleH = h / EditorHeight

  let pattern = p.pattern;
  let pw = pattern.width
  let ph = pattern.height

  let position
  let x = p.position.x;
  let y = p.position.y;
  switch (p.pattern.align) {
    case 1:
      position = new Position(x - RedPointSize, y - RedPointSize)
      break
    case 2:
      position = new Position(x, y)
      break
    case 3:
      position = new Position(x - (pw / 2), y - (ph / 2))
      break
    case 4:
      position = new Position(x + RedPointSize - pw, y + RedPointSize - ph)
      break
    case 5:
      position = new Position(x - pw, y - ph)
      break
    default:
      throw new Error("小红点的对其方式不对")
  }
  position.x *= scaleW
  position.y *= scaleH

  return {
    leftTopPosition: position,
    pw: pw * scaleW,
    ph: ph * scaleH
  }
}

export const PicturePatternEditor = (props) => {
  const {project, close,onSuccess} = props
  /**
   * @type {RedPoint}
   */
  const p = props.redPoint.clone()

  const init = async () => {
    /**
     *
     * @type {HTMLCanvasElement}
     */
    const previewCanvas = document.getElementById("m-ise-preview")
    let context = previewCanvas.getContext('2d');
    let canvasW = previewCanvas.width;
    let canvasH = previewCanvas.height;
    context.clearRect(0, 0, canvasW, canvasH)

    const back = document.getElementById("m-ise-preview")
    let backContext = back.getContext('2d');
    backContext.clearRect(0, 0, canvasW, canvasH)

    if (project.background) {
      let backgroundPicture = await ImageLoader.load(project.background)
      backContext.drawImage(backgroundPicture, 0, 0, canvasW, canvasH)
    }


    const {leftTopPosition, pw, ph} = getLeftTopPosition(canvasW, canvasH, p)

    context.fillStyle = "rgba(0,0,0,0.5)"
    context.fillRect(0, 0, canvasW, canvasH)

    context.clearRect(leftTopPosition.x, leftTopPosition.y, pw, ph)
  }
  useEffect(() => {
    init()
  }, [])

  return <>
    <Modal title="图片格式"
           visible={true}
           width={EditorWidth + 380}
           onCancel={() => close()}
           onOk={()=>{
             onSuccess(p)
             close()
           }}
           okText="确定"
           cancelText="取消"
    >
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <div style={{
          width: EditorWidth,
          height: EditorHeight
        }}>
          <canvas
            width={EditorWidth}
            height={EditorHeight}
            id='m-ise-background' style={{border: '1px solid black', position: "absolute", zIndex: 9}}>
            请更换浏览器！推荐使用Google Chrome
          </canvas>
          <canvas
            width={EditorWidth}
            height={EditorHeight}
            id='m-ise-preview' style={{border: '1px solid black', posWzition: "absolute", zIndex: 9}}>
            请更换浏览器！推荐使用Google Chrome
          </canvas>
        </div>
        <div>
          <div className="m-ppe-title">
            位置调整
          </div>
          <div className="m-re-pt-block" style={{width: '100%'}}>
            对齐方式
            <Select defaultValue={p.pattern.align} style={{width: 300}} onChange={(v) => {
              p.pattern.align = v;
              init()
            }}>
              <Option value={1}>以小红点左上角为输入左上角</Option>
              <Option value={2}>以小红点中心为输入左上角</Option>
              <Option value={3}>以小红点中心为输入中心</Option>
              <Option value={4}>以小红点右下角为输入右下角</Option>
              <Option value={5}>以小红点中心为输入右下角</Option>
            </Select>
          </div>
          <div className="m-re-pt-container">
            <div className="m-re-pt-block medium">
              横向坐标（x）微调
              <Input type="number"
                     defaultValue={p.position.x}
                     style={{width: 120}}
                     onChange={(v) => {
                       p.position.x = v.target.value
                       init()
                     }}
              />
            </div>
            <div className="m-re-pt-block medium">
              纵向坐标（y）微调
              <Input type="number"
                     defaultValue={p.position.y}
                     style={{width: 120}}
                     onChange={(v) => {
                       p.position.y = v.target.value
                       init()
                     }}
              />
            </div>
          </div>

          <div className="m-ppe-title margin-top">
            图片宽高
          </div>
          <div className="m-re-pt-container">
            <div className="m-re-pt-block">
              高度（像素）
              <Input type="number"
                     defaultValue={p.pattern.height}
                     style={{width: 120}}
                     onChange={(v) => {
                       p.pattern.height = v.target.value
                       init()
                     }}
              />
            </div>
            <div className="m-re-pt-block">
              宽度（像素）
              <Input type="number"
                     defaultValue={p.pattern.width}
                     style={{width: 120}}
                     onChange={(v) => {
                       p.pattern.width = v.target.value
                       init()
                     }}
              />
            </div>
          </div>
        </div>
      </div>


    </Modal>
  </>
}