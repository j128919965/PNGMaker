import React from "react";

import "./ProjectForm.css"
import {Empty, Input, Button, Modal} from "antd";
import {UploadOutlined} from '@ant-design/icons';
import {InputData} from "../../data/InputData";
// import ImageLoader from "../../utils/imageLoader";

import {EditorHeight, EditorWidth} from '../../data/constants'
import files from "../../utils/files";
import ImageRenderer from "../ImageRenderer/ImageRenderer";

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
        <label>{(point.label?.length > 0 ? point.label : "请设置备注")+ data[point.id]}<br/>
          <Button
            className='u-pf-editor-upload'
            icon={<UploadOutlined/>}
            onClick={onclick}
          >
            Click to Upload
          </Button>
          <br/>
          {/*=== undefined ? '未选择文件' : data[point.id].match(/[a-z]{1,}\.[a-z]{1,}/)*/}
        </label>
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
            newData[newPoint.id] = new InputData(newPoint.id).data
          }
          break
        }
      }
      // no break
      newData[newPoint] = new InputData(newPoint.id).data

    }


    this.setState({project, data: newData})
  }

  updateStateData = (data, i) => {
    let ds = this.state.data
    ds[i] = data
    this.setState({data:ds})
  }

  prepareCanvas = ()=>{

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
    for (let i = 0; i < points.length; i++) {
      if (points[i].type === 1) {
        list.push(
          <TypeOfText key={points[i].id}
                      point={points[i]}
                      oninput={e => this.updateStateData(e.target.value, points[i].id)}
                      data={this.state.data}
          />
        )
      } else if (points[i].type === 2) {
        list.push(
          <TypeOfImage key={points[i].id}
                       point={points[i]}
                       onclick={async (e) => {
                         let imageData = await files.readFile()
                         console.log(imageData)
                         this.updateStateData(imageData, points[i].id)
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
            <div className="m-pf-editor-list">
              {this.formList()}
            </div>
            <div>
              <Button type="primary" className="u-pf-btn"
                      onClick={() => {
                          this.setState({isModalVisible: true}, async ()=>{
                          let pfImageRenderer = new ImageRenderer()
                          pfImageRenderer.load(project)
                          let pfReviewCanvas = document.getElementById('pfPreviewCanvas')
                          await pfImageRenderer.showPreview(pfReviewCanvas, this.state.data)
                        })
                      }}
              >
                预 览
              </Button>
              <Button type="primary" className="u-pf-btn" id='pfSave'>
                保 存
              </Button>
            </div>
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
          <div className='m-pf-preview-container' style={{width: '100%', display: 'flex',}}>
            <canvas
              id='pfPreviewCanvas'
              width={EditorWidth * 0.8}
              height={EditorHeight * 0.8}
              style={{border: '1px solid black'}}>
              no canvas
            </canvas>
            <Button className='u-pf-btn' type={"primary"} style={{marginTop: 20}}>shit</Button>
          </div>
        </Modal>
      </>
    )
  }
}