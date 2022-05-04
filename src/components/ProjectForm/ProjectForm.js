import React from "react";

import "./ProjectForm.css"
import {Empty, Input} from "antd";


export default class ProjectForm extends React.Component {

  constructor(props) {
    super(props);
    this.props = props
    this.state = {
      project: null
    }
  }

  updateProject(project) {
    this.setState({project})
  }


  formList() {
    /**
     * @type {ProjectMetadata}
     */
    const project = this.state.project
    if (!project) {
      return
    }
    return project.points.map(point =>
      <div className="m-pf-line">
        <div className="m-pf-p-icon">
          {point.id}
        </div>
        <div >
          <label className="m-pf-p-label">
            {point.label?.length > 0 ? point.label : '请设置备注'}
            <Input />
          </label>
        </div>
      </div>
    )
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
          <div className="m-pf-container">
            <div className="m-pf-lines">
              {this.formList()}
            </div>

          </div>
        }
      </>

    )
  }
}