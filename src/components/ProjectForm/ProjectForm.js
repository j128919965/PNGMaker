import React from "react";

import "./ProjectForm.css"
import {Empty, Input, Button, Modal} from "antd";
import {UploadOutlined} from '@ant-design/icons';

import {EditorHeight, EditorWidth} from '../../data/constants'
import files from "../../utils/files";
import ImageRenderer from "../ImageRenderer/ImageRenderer";
import {InputDataLoadResult} from "../../data/InputData";

/**
 *
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
function TypeOfText(props) {
  const {point, oninput, data} = props
  return (<div className="m-pf-editor-text">
      <div className="u-point">{point.id}</div>
      <div>
        <label>{point.label?.length > 0 ? point.label : "请设置备注"}<br/>
          <Input type="text" onInput={oninput} value={
            data[point.id]
          }/>
        </label>
      </div>
    </div>
  )
}

function TypeOfImage(props) {
  const {point, onclick, data} = props
  return (
    <div className="m-pf-editor-image">
      <div className="u-point">{props.point.id}</div>
      <div>
        <div>{(point.label?.length > 0 ? point.label : "请设置备注")}<br/>
          <Button
            className='u-pf-editor-upload'
            icon={<UploadOutlined/>}
            onClick={onclick}
          >
            上传图片
          </Button>
          <br/>
          {data[point.id]? data[point.id].substring(data[point.id].indexOf("/file/")+6) : '未选择文件'}
        </div>
      </div>
    </div>
  )
}

export default class ProjectForm extends React.Component {
  /**
   * @type {HTMLCanvasElement}
   */
  pfPreviewCanvas

  constructor(props) {
    super(props);
    this.props = props
    this.state = {
      project: null,
      data: {},
      isModalVisible: false
    }
  }

  /**
   *
   * @param project {ProjectMetadata}
   */
  updateProject(project) {

    const prev = this.state.project
    // 新项目
    if (prev === null || prev.id !== project.id) {
      this.setState({
        project: project,
        data: {}
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
            newData[newPoint.id] = null
          }
          break
        }
      }
      // no break
      newData[newPoint] = null
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
      if (point.type === 1) {
        list.push(
          <TypeOfText key={point.id}
                      point={point}
                      oninput={e => this.updateStateData(e.target.value, point.id)}
                      data={this.state.data}
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
          />)
      }
    }
    return list
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
                  <Button type="primary" className="u-pf-btn"
                          onClick={() => {
                            this.setState({isModalVisible: true}, async () => {
                              let pfImageRenderer = new ImageRenderer()
                              pfImageRenderer.load(project)
                              let pfReviewCanvas = document.getElementById('pfPreviewCanvas')
                              pfReviewCanvas.getContext('2d').clearRect(0, 0, pfReviewCanvas.width, pfReviewCanvas.height)
                              await pfImageRenderer.showPreview(pfReviewCanvas, InputDataLoadResult.fromMap(this.state.data , project.id))
                            })
                          }}
                  >
                    预 览
                  </Button>
                  <Button type="primary" className="u-pf-btn" id='pfSave'>
                    导 出
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
            <Button className='u-pf-btn' type={"primary"} style={{marginTop: 20}}>导 出</Button>
          </div>
        </Modal>
      </>
    )
  }
}
