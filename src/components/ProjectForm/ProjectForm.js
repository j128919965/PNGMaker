import {FormWidth, FormMaxHeight} from "../../data/constants.js";
import React from "react";

import "./ProjectForm.css"
import {Empty, Input, Upload, message, Button} from "antd";
import { UploadOutlined } from '@ant-design/icons';

/**
 *
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
function TypeOfText (props){
  return (<div className="m-pf-text">
      <div className="u-point">{props.point.id}</div>
      <div>
        <label className="m-pf-text-label">
          请设置备注
          <br/>
          <Input type="text" onInput={props.oninput} value={
            props.data[props.point.id]
          }/>
        </label>
      </div>
  </div>
  )
}

function TypeOfImage (props){
  return (
    <div className="m-pf-image">
      <div className="u-point">{props.point.id}</div>
      <div>
        <label className="m-pf-image-label">
          请设置备注
          <br/>
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </label>
      </div>
    </div>
  )
}

export default class ProjectForm extends React.Component{

  constructor(props) {
    super(props);
    this.props = props
    this.state = {
      project:null,
      data:[]
    }
  }

  updateProject(project){

    if (this.state.project === null){
      this.setState({
        project:project,
        data: []
      })
      return
    }

    const { points } = this.state.project

    if (points.length - 1 === project.points.length){}

    //   (this.state)=>{
    //   return {
    //     project: project
    //   }
    // }
  }

  updateStateData = (data, i)=>{
    this.state.data[i] = data
    console.log(this.state)
  }

  formList(){
    /**
     * @type {ProjectMetadata}
     */
    const project= this.state.project
    if (!project){
      return
    }

    const {points} = project
    let list = []
    for (let i = 0; i <points.length; i++){
      this.state.data.push('')
      if (points[i].type === 1){
        list.push(
          <TypeOfText point = {points[i]}
                      oninput = {(data)=>{this.updateStateData(data.target.value, i)}}
                      data = {this.state.data}
          />
        )
      }else if (points[i].type === 2){
        list.push(<TypeOfImage point = {points[i]}/>)
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
          <div className="pf-editor">
            <div>
              {this.formList()}
            </div>
            <div>
              <button className="u-pf-preview" id='pfPreview'>预 览</button>
              <button className="u-pf-save" id='pfSave'>保 存</button>
            </div>

          </div>
        }
      </>
    )
  }
}