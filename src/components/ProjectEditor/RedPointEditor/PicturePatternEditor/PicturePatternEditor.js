import {Button, Input, message, Modal, Select, Switch} from "antd";
import {EditorHeight, EditorWidth} from "../../../../data/constants";
import React, {useEffect, useState} from "react";
import ImageLoader from "../../../../utils/imageLoader";
import {getLeftTopPosition} from "../utils"

import './PicturePatternEditor.css'
import {FormulaEditor} from "../../../FomulaEditor/FormulaEditor";

const {Option} = Select

export const PicturePatternEditor = (props) => {
  const {project, close, onSuccess, openDefaultModal} = props

    /**
     * @type {RedPoint}
     */
    const [p,setP] = useState(props.redPoint.clone())

  const [tempVisible, setTempVisible] = useState(p.visible);

  const [tempNecessity, setTempNecessity] = useState(p.isNecessary)

  const [tempDefaultValue, setTempDefaultValue] = useState(p.defaultValue)

  const [isDefaultModalVisible, setIsDefaultModalVisible] = useState(false);

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
  }, [p])

  return <>
    {
      isDefaultModalVisible &&
      <FormulaEditor project={props.project}
                     redPoint={p}
                     defaultValue={tempDefaultValue}
                     onSuccess={tmp => {
                       setTempDefaultValue(tmp)
                       setIsDefaultModalVisible(false)
                     }}
                     close={() => {
                       setIsDefaultModalVisible(false)
                     }}
      />
    }

    <Modal title="设置图片输入格式"
           visible={true}
           width={EditorWidth + 380}
           onCancel={() => close()}
           onOk={() => {
             p.isNecessary = tempNecessity
             p.visible = tempVisible
             p.defaultValue = tempDefaultValue
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
        <div style={{width:'300px'}}>
          <div className="m-ppe-title">
            位置调整
          </div>
          <div className="m-re-pt-block" style={{width: '100%'}}>
            对齐方式
            <Select defaultValue={p.pattern.align} style={{width: 300}} onChange={(v) => {
              p.pattern.align = v;
              setP(p.clone())
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
                       setP(p.clone())
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
                       setP(p.clone())
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
                       setP(p.clone())
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
                       setP(p.clone())
                     }}
              />
            </div>
          </div>

          <div className="m-ppe-title margin-top">
            可见性及默认值
          </div>
          <div className="m-re-pt-container">
            <div className="m-re-pt-block medium">
              是否展示
              <Switch checked={tempVisible}
                      style={{width: 56}}
                      checkedChildren="展示"
                      unCheckedChildren="隐藏"
                      onChange={v => {
                        if (!v) {
                          setTempNecessity(false)
                        }
                        setTempVisible(v)
                      }}/>
            </div>
            <div className="m-re-pt-block medium">
              是否必填
              <Switch checked={tempNecessity}
                      style={{width: 56}}
                      checkedChildren="必填"
                      unCheckedChildren="可空"
                      onChange={v => {
                        if (v) {
                          setTempVisible(true)
                          setTempDefaultValue("")
                        }
                        setTempNecessity(v)
                      }}/>
            </div>
            <div className="m-re-pt-block large">
              默认值
              <div style={{fontSize: 12}}>
                当前默认值为：{tempDefaultValue?.trim()?.length < 1 ? "无默认值" : tempDefaultValue}
              </div>
              <Button style={{width: 120}}
                      disabled={tempNecessity}
                      onClick={() => {
                        if (tempNecessity) {
                          message.error(`必填项不可设置默认值`)
                        } else {
                          setIsDefaultModalVisible(true)
                        }
                      }}>设置默认值</Button>
            </div>
          </div>
        </div>
      </div>


    </Modal>
  </>
}