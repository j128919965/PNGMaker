import {Button, Input, message, Modal, Select, Switch} from "antd";
import {A4Width, EditorHeight, EditorWidth, RedPointSize} from "../../../../data/constants";
import React, {useEffect, useState} from "react";
import ImageLoader from "../../../../utils/imageLoader";

import './WordPatternEditor.css'
import {FormulaEditor} from "../../../FomulaEditor/FormulaEditor";
import {Position} from "../../../../data/ProjectMetadata";

const {Option} = Select

const getLeftTopPosition = (w, h, p, text, context) => {
    const scaleW = w / EditorWidth
    const scaleH = h / EditorHeight

    let textMetrics = context.measureText(text)
    let position
    let pw = textMetrics.width

    let x = p.position.x;
    let y = p.position.y;
    switch (p.pattern.align) {
        case 1:
            context.textBaseline = "top"
            position = new Position(x - RedPointSize, y - RedPointSize)
            break
        case 2:
            context.textBaseline = "top"
            position = new Position(x, y)
            break
        case 3:
            context.textBaseline = "middle"
            position = new Position(x - (pw / 2), y)
            break
        case 4:
            context.textBaseline = "bottom"
            position = new Position(x + RedPointSize - pw, y + RedPointSize)
            break
        case 5:
            context.textBaseline = "bottom"
            position = new Position(x - pw, y)
            break
        default:
            throw new Error("小红点的对其方式不对")
    }
    position.x *= scaleW
    position.y *= scaleH

    return position
}


export const WordPatternEditor = (props) => {
    const {project, close, onSuccess} = props

    /**
     * @type {RedPoint}
     */
    const [p,setP] = useState(props.redPoint.clone())

    const [isDefaultModalVisible, setIsDefaultModalVisible] = useState(false);

    const [tempVisible, setTempVisible] = useState(p.visible);

    const [tempNecessity, setTempNecessity] = useState(p.isNecessary)

    const [testWord,setTestWord] =  useState("测试字符串");

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

        context.fillStyle = p.pattern.color
        let fontSize = (p.pattern.fontSize * 3) * canvasW / A4Width;
        context.font = (p.pattern.italic ? "italic " : "normal ") +
            (p.pattern.bold ? "bolder " : "normal ") +
            fontSize + "px " + p.pattern.fontType

        const leftTopPosition = getLeftTopPosition(canvasW, canvasH, p, testWord, context)

        context.fillText(testWord, leftTopPosition.x, leftTopPosition.y)
    }
    useEffect(() => {
        init()
    }, [p])

    return <>
        {
            isDefaultModalVisible &&
            <FormulaEditor project={props.project}
                           redPoint={p}
                           defaultValue={p.defaultValue}
                           onSuccess={tmp => {
                               p.defaultValue = tmp
                               setIsDefaultModalVisible(false)
                               setP(p.clone())
                           }}
                           close={() => {
                               setIsDefaultModalVisible(false)
                           }}
            />
        }

        <Modal title="设置文字输入格式"
               visible={true}
               width={EditorWidth + 380}
               onCancel={() => close()}
               onOk={() => {
                   p.visible = tempVisible
                   p.isNecessary = tempNecessity
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
                <div style={{width: '300px'}}>
                    <div className="m-ppe-title">
                        测试文字内容
                    </div>
                    <div className="m-re-pt-container">
                        <div className="m-re-pt-block large">
                            测试文字内容
                            <Input defaultValue={testWord}
                                   style={{width: 120}}
                                   onChange={(v) => {
                                       setTestWord( v.target.value)
                                       setP(p.clone())
                                   }}
                            />
                        </div>
                    </div>
                    <div className="m-ppe-title margin-top">
                        字体
                    </div>
                    <div className="m-re-pt-container">
                        <div className="m-re-pt-block medium">
                            字体类型
                            <Select defaultValue={p.pattern.fontType} style={{width: 120}}
                                    onChange={(v) => {
                                        p.pattern.fontType = v;
                                        setP(p.clone())
                                    }}>
                                <Option value="宋体">宋体</Option>
                                <Option value="楷体">楷体</Option>
                                <Option value="黑体">黑体</Option>
                                <Option value="华文新魏">华文新魏</Option>
                            </Select>
                        </div>
                        <div className="m-re-pt-block medium">
                            字体大小
                            <Input type="number"
                                   defaultValue={p.pattern.fontSize}
                                   style={{width: 120}}
                                   onChange={(v) => {
                                       p.pattern.fontSize = v.target.value
                                       setP(p.clone())
                                   }}
                            />
                        </div>
                        <div className="m-re-pt-block small">
                            加粗
                            <Switch defaultChecked={p.pattern.bold}
                                    style={{width: 40}}
                                    onChange={(checked) => {
                                        p.pattern.bold = checked
                                        setP(p.clone())
                                    }}/>
                        </div>
                        <div className="m-re-pt-block small">
                            斜体
                            <Switch defaultChecked={p.pattern.italic}
                                    style={{width: 40}}
                                    onChange={(checked) => {
                                        p.pattern.italic = checked
                                        setP(p.clone())
                                    }}/>
                        </div>
                        <div className="m-re-pt-block small">
                            字体颜色
                            <Input type='color' defaultValue={p.pattern.color} style={{width: "42px"}}
                                   onChange={v => {
                                       p.pattern.color = v.target.value
                                       setP(p.clone())
                                   }}/>
                        </div>
                    </div>

                    <div className="m-ppe-title margin-top">
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
                                            p.defaultValue = ""
                                        }
                                        setTempNecessity(v)
                                    }}/>
                        </div>
                        <div className="m-re-pt-block large">
                            默认值
                            <div style={{fontSize: 12}}>
                                当前默认值为：{p.defaultValue?.trim()?.length > 0 ? p.defaultValue : "无默认值" }
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
