import {FormWidth, FormMaxHeight} from "../../data/constants.js";
import React from "react";

import "./ProjectForm.css"
import {Empty} from "antd";

/**
 *
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
function TypeOfText (props){
  return (<div className="m-typeOfText">
      <div className="p-red-point">{props.point.id}</div>
      <div>
        <label className="m-text">
          请设置备注
          <input type="text"/>
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
      project:null
    }
  }

  updateProject(project){
    this.setState({project})
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
      list.push(<TypeOfText point = {this.props.points[i]}/>)
    }
    return list
  }



  render() {
    const {project} = this.state
    console.log(project)
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
            {this.formList()}
          </div>
        }
      </>

    )
  }
}