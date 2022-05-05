import EdiText from "react-editext";
import {EditOutlined, ExclamationCircleOutlined, ProjectOutlined, ToolOutlined} from "@ant-design/icons";
import { Menu, Modal} from "antd";
import {useRef, useState} from "react";

import ProjectEditor from "../ProjectEditor/ProjectEditor";
import ProjectForm from "../ProjectForm/ProjectForm";
import ImageRenderer from "../ImageRenderer/ImageRenderer";
import ProjectStore from "../../data/projects";
import files from "../../utils/files"

import './App.css';

const App = () => {

    /**
     * 用于保存和设置当前打开的项目
     */
    const [project, setProject] = useState(null)

    /**
     * 项目编辑器
     * @type {React.MutableRefObject<ProjectEditor>}
     */
    const pe = useRef();

    /**
     *
     * @type {React.MutableRefObject<ProjectForm>}
     */
    const pf = useRef();

    const updateProject = (proj, ignorePe) => {
      imageRenderer.load(proj)
      setProject(proj)
      !ignorePe && pe.current.resetProj(proj)
      pf.current.updateProject(proj)
    }

    const imageRenderer = new ImageRenderer()

    const items = [
      {
        key: "proj",
        label: '项  目',
        icon: <ProjectOutlined/>,
        children: [
          {
            key: "proj-create",
            label: '新建项目',
            onClick: async () => {
              let proj = await ProjectStore.createNewProject()
              updateProject(proj)
            }
          },
          {
            key: "proj-open",
            label: '打开项目'
          },
          {
            key: "proj-save",
            label: '保存项目',
            onClick: async () => ProjectStore.save(project)
          },
          {
            key: "proj-remove",
            label: '删除项目',
            disabled: !project,
            onClick: async () => {
              Modal.confirm({
                title: `删除项目`,
                content: `确认删除 ${project.name} 吗`,
                icon: <ExclamationCircleOutlined/>,
                okText: '确认',
                cancelText: '取消',
                onOk: () => ProjectStore.delete(project)
              })
            }
          }
        ]
      },
      {
        key: "tool",
        label: '工  具',
        icon: <ToolOutlined/>,
        disabled: !project,
        children: [
          {
            key: "tool-bg",
            label: '背景图片',
            children: [
              {
                key: "tool-bg-open",
                label: "上传背景",
                onClick: async () => {
                  project.background = await files.readFile();
                  updateProject(project)
                }
              },
              {
                key: "tool-bg-rem",
                label: "移除背景"
              }
            ]
          },
          {
            key: "tool-excel",
            label: '批量生成'
          },
          {
            key: "tool-cloud",
            label: '云端数据',
            disabled: true
          }
        ],
      },
    ];


    return (
      <div>
        {/*添加一个全局的文件上传器，不用在每个地方都重新写*/}
        <input type="file" id="upload-block-real-input" style={{display: 'none'}}
               accept="image/gif,image/jpeg,image/jpg,image/png"/>
        <div className="g-page">
          <Menu mode="horizontal" items={items}/>
          {
            project &&
            <div className="m-menu-proj-name">
              <EdiText saveButtonClassName="m-menu-proj-name-btn"
                       saveButtonContent="✓"
                       cancelButtonClassName="m-menu-proj-name-btn"
                       cancelButtonContent="✕"
                       editButtonClassName="m-menu-proj-name-btn"
                       editButtonContent={<EditOutlined/>}
                       value={project.name}
                       onSave={v => {
                         project.name = v;
                         setProject(project)
                       }}/>
            </div>
          }

          <div className="m-main">
            <div className="m-main-left">
              <ProjectEditor ref={pe} onProjectUpdate={(proj) => updateProject(proj, true)}/>
            </div>
            <div className="m-main-right">
              <ProjectForm ref={pf} project={project}/>
            </div>
          </div>


        </div>
      </div>

    );
  }
;

export default App;
