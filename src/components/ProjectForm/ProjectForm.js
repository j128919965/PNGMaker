import React from "react";

import "./ProjectForm.css"
import {Empty, Input, Button, Modal, message} from "antd";
import {ExclamationCircleOutlined, ExclamationCircleTwoTone, UploadOutlined} from '@ant-design/icons';

import {EditorHeight, EditorWidth} from '../../data/constants'
import files from "../../utils/files";
import ImageRenderer from "../ImageRenderer/ImageRenderer";
import {InputDataLoadResult} from "../../data/InputData";
import InputDataStore from "../../data/InputDataStore";

/**
 *
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
function TypeOfText(props) {
  const {point, oninput, data, emptyHint} = props
  return <div className="m-pf-editor-text">
    <div className="u-point">{point.id}</div>
    <div>
      <label>{point.label?.length > 0 ? point.label + ' ' : "请设置备注 "}{point.isNecessary ?
        <ExclamationCircleTwoTone twoToneColor="red"/> : ''}<br/>
        <Input type="text"
               status={emptyHint[point.id] ? "error" : ""}
               placeholder={point.defaultValue}
               onInput={oninput}
               value={data[point.id]}/>
      </label>
    </div>
  </div>

}
/* 提示按钮，通过变红提示用户需要点击 */
function HintButton(props) {
  const {value, type, handler} = props
  if (type === 0) {
    return (
      <Button
        className='u-pf-editor-upload-default'
        icon={<UploadOutlined/>}
        onClick={handler}
      >
        {value}
      </Button>
    )
  } else if (type === 1) {
    return (
      <Button
        className='u-pf-editor-upload-error'
        icon={<UploadOutlined/>}
        onClick={handler}
      >
        {value}
      </Button>
    )
  }

}

function TypeOfImage(props) {
  const {point, onclick, data, emptyHint} = props
  return (
    <div className="m-pf-editor-image">
      <div className="u-point">{props.point.id}</div>
      <div>
        <div>{(point.label?.length > 0 ? point.label : "请设置备注")}{point.isNecessary ?
          <ExclamationCircleTwoTone twoToneColor="red"/> : ''}<br/>
          <HintButton
            type ={emptyHint[point.id]?1:0}
            handler = {onclick}
            value={"上传图片"}/>
          <br/>
          {data[point.id] ? data[point.id].substring(data[point.id].indexOf("/file/") + 6) : '未选择文件'}
        </div>
      </div>
    </div>
  )
}


export default class ProjectForm extends React.Component {

  constructor(props) {
    super(props);
    this.props = props
    this.state = {
      project: null,
      data: {},
      isModalVisible: false,
      role: props.role,
      countDown: 0,
      emptyCheckFlag: {}
    }
  }

  /**
   *
   * @param project {ProjectMetadata}
   */
  updateProject(project) {
    if (project == null) {
      this.setState({
        project: null,
        data: {}
      })
      return;
    }
    const prev = this.state.project
    // 新项目
    if (prev === null || prev.id !== project.id) {
      let initData = {}
      let initFlag = {}
      for (const point of project.points) {
        initData[point.id] = ""
        initFlag[point.id] = false
      }
      this.setState({
        project: project,
        data: initData,
        emptyCheckFlag: initFlag
      })
      return
    }

    const {data} = this.state

    /**
     *
     * @type {{number:string}}
     */
    const newData = {}

    for (const newPoint of project.points) {
      for (const prevPoint of prev.points) {
        if (prevPoint.id === newPoint.id) {
          let inputData = data[newPoint.id]
          if (prevPoint.type === newPoint.type) {
            newData[newPoint.id] = inputData
          } else {
            newData[newPoint.id] = ""
          }
          break
        }
      }
      // no break
      newData[newPoint] = ""
    }
    this.setState({project, data: newData})
  }

  updateStateData = (data, i) => {
    let ds = this.state.data
    ds[i] = data
    this.setState({data: ds})
  }

  formList() {
    /**
     * @type {ProjectMetadata}
     */
    const project = this.state.project
    if (!project) {
      return
    }

    const {points} = project
    let list = []
    for (let point of points) {
      if (!point.visible) {
        continue;
      }
      if (point.type === 1) {
        list.push(
          <TypeOfText key={point.id}
                      point={point}
                      oninput={e => this.updateStateData(e.target.value, point.id)}
                      data={this.state.data}
                      emptyHint={this.state.emptyCheckFlag}
          />
        )
      } else if (point.type === 2) {
        list.push(
          <TypeOfImage key={point.id}
                       point={point}
                       onclick={async () => {
                         let imageData = await files.readFile(undefined)
                         this.updateStateData(imageData, point.id)
                       }}
                       data={this.state.data}
                       emptyHint={this.state.emptyCheckFlag}
          />)
      }
    }
    return list
  }

  downloadPNG = async (project) => {
    let pfImageRenderer = new ImageRenderer()
    pfImageRenderer.load(project)
    await pfImageRenderer.download(InputDataLoadResult.fromMap(this.state.data, project), null, project)
  }

  saveInputDataResult = async () => {
    let data = InputDataLoadResult.fromMap(this.state.data, this.state.project)
    let resp = await InputDataStore.save(data)
    if (!resp.s) {
      message.error(resp.m)
      return
    }
    message.success(`保存成功，请在电脑端 "云端数据" 查看`)
  }

  checkNecessity = () => {
    const project = this.state.project
    /* 是否准备完毕 */
    let isPre = true
    if (!project) {
      return
    }
    let data = this.state.data
    /**
     * 遍历每个小红点的id，如果小红点必填且data为''，设置emptyCheckFlag对应为true
     * @type {{number:boolean}}
     */
    let flag = this.state.emptyCheckFlag
    const {points} = project
    for (let point of points) {
      if (point.isNecessary && data[point.id] === '') {
        message.error("第 "+point.id+" 项数据未填写！")
        flag[point.id] = true
        isPre = false
      } else {
        flag[point.id] = false
      }
    }
    this.setState({
      emptyCheckFlag: flag
    })

    return isPre
  }

  render() {
    const {project} = this.state
    return (
      <>

        {
          !project &&
          <div className="m-main-hint">
            <Empty description=""/>
            请打开或新建项目
          </div>
        }
        {
          project &&
          <div className="m-pf-editor">
            {
              project.points.length === 0 &&
              <div>
                <div className="m-pf-main-hint">
                  <Empty description=""/>
                  双击左侧创建输入项
                </div>
                <div>
                  <Button type="primary" className="u-pf-btn" disabled="none">预 览</Button>
                  <Button type="primary" className="u-pf-btn" disabled="none">导 出</Button>
                </div>
              </div>
            }
            {
              project.points.length !== 0 &&

              <div>

                <div className="m-pf-editor-list">
                  {this.formList()}
                </div>
                <div>
                  {
                    this.props.role > 0 &&
                    <Button type="primary" className="u-pf-btn" id="u-pf-btn-preview"
                            onClick={() => {
                              this.setState({isModalVisible: true}, async () => {
                                let pfImageRenderer = new ImageRenderer()
                                pfImageRenderer.load(project)
                                let pfReviewCanvas = document.getElementById('pfPreviewCanvas')
                                pfReviewCanvas.getContext('2d').clearRect(0, 0, pfReviewCanvas.width, pfReviewCanvas.height)
                                await pfImageRenderer.showPreview(pfReviewCanvas, InputDataLoadResult.fromMap(this.state.data, project))
                              })
                            }}
                    >
                      预 览
                    </Button>
                  }
                  {
                    this.props.role > 0 &&
                    <Button type="primary" className="u-pf-btn" id="u-pf-btn-download"
                            onClick={() => {
                              this.downloadPNG(project)
                            }}
                    >
                      导 出
                    </Button>
                  }
                  <Button type="primary" className="u-pf-btn" disabled={this.state.countDown !== 0}
                          onClick={() => {
                            const {antiShakeTime} = this.props.project
                            this.setState({countDown: antiShakeTime}, () => {
                              let t = setInterval(() => {
                                const newTime = this.state.countDown - 1
                                this.setState({countDown: newTime}, () => {
                                  if (this.state.countDown <= 0) {
                                    clearInterval(t)
                                  }
                                })
                              }, 1000)
                            })
                            if (this.checkNecessity()) {
                              this.saveInputDataResult()
                            }
                          }}
                  >
                    {
                      this.state.countDown === 0 ? <div>上 传</div> : <div>{this.state.countDown} 秒</div>
                    }
                  </Button>
                </div>
              </div>
            }
          </div>
        }
        <Modal title='图片预览'
               width={EditorWidth * 0.8 + 100}
               visible={this.state.isModalVisible}
               footer={null}
               onCancel={() => {
                 this.setState({isModalVisible: false})
               }}
        >
          <div className='m-pf-preview-container' style={{width: '100%', display: 'flex'}}>
            <canvas
              id='pfPreviewCanvas'
              width={EditorWidth * 0.8}
              height={EditorHeight * 0.8}
              style={{border: '1px solid #ccc', borderRadius: '5px'}}>
              no canvas
            </canvas>
            <Button className='u-pf-btn' type={"primary"} style={{marginTop: 20}}
                    onClick={() => {
                      this.downloadPNG(project)
                    }}>导 出</Button>
          </div>
        </Modal>
      </>
    )
  }
}
