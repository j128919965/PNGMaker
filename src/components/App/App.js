import EdiText from "react-editext";
import {EditOutlined, ExclamationCircleOutlined, ProjectOutlined, ToolOutlined} from "@ant-design/icons";
import {Menu , Modal} from "antd";
import {useState} from "react";

import ProjectEditor from "../ProjectEditor/ProjectEditor";
import ProjectStore from "../../data/projects";

import './App.css';

const App = () => {
  const [project, setProject] = useState(null)

  const items = [
    {
      key: "proj",
      label: '项  目',
      icon: <ProjectOutlined/>,
      children: [
        {
          key: "proj-create",
          label: '新建项目',
          onClick: async () => setProject(await ProjectStore.createNewProject())
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
              label: "上传背景"
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

      <ProjectEditor/>
    </div>
  );
}

export default App;
