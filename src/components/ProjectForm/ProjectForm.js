import {FormWidth, FormMaxHeight} from "../../data/constants.js";
import React from "react";

import "./ProjectForm.css"


export default class ProjectForm extends React.Component{

  constructor(props) {
    super(props);
    this.props = props=
    this.state = {
      project:null
    }
  }

  updateProject(project){
    this.setState({project})
  }

  // componentWillReceiveProps(nextProps){
  //   this.render()
  // }

  formList(){
    /**
     * @type {ProjectMetadata}
     */
    const project= this.state.project
    if (!project){
      return
    }
    const {points} = project

    return points.map(p=> <div>{p.id}</div>
    )
  }



  render() {
    return (
        <div className="pf-editor">
          {this.formList()}
        </div>
    )
  }
}