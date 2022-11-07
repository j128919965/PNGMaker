import EdiText from "react-editext";
import {EditOutlined, ExclamationCircleOutlined, ProjectOutlined, ToolOutlined, UserOutlined} from "@ant-design/icons";
import {Button, Form, Menu, message, Modal, Popover, Select} from "antd";

import {useEffect, useRef, useState} from "react";

import ProjectEditor from "../ProjectEditor/ProjectEditor";
import ProjectForm from "../ProjectForm/ProjectForm";
import ProjectStore from "../../data/ProjectStore";
import files from "../../utils/files"
import formula from "../../utils/formula";

import './App.css';
import BatchLoadFromExcel from "../BatchLoadFromExcel/BatchLoadFromExcel";
import {CloudData} from "../CloudData/CloudData";
import {Login} from "../Login/Login";
import {ProjectMetadata} from "../../data/ProjectMetadata";
import {RoleManage} from "../RoleManage/RoleManage";
import {FormulaEditor} from "../FomulaEditor/FormulaEditor";
import {AntiShakeSetter} from "../AntiShakeSetter/AntiShakeSetter";


const {Option} = Select

const App = () => {

    /**
     * 用于保存和设置当前打开的项目
     */
    const [project, setProject] = useState(null)

    const [batchModalVisible, setBatchModalVisible] = useState(false)

    const [cloudDataVisible, setCloudDataVisible] = useState(false)

    const [openProjectVisible, setOpenProjectVisible] = useState(false)

    const [roleManageVisible, setRoleManageVisible] = useState(false)

    const [loginModalVisible, setLoginModalVisible] = useState(false)

    const [projectList, setProjectList] = useState([])

    const [isLogin, setIsLogin] = useState(false)

    const [role, setRole] = useState(0)

    const [outputNameConfigVisible, setOutputNameConfigVisible] = useState(false)

    const [antiShakeTime, setAntiShakeTime] = useState(30)

    const [antiShakeVisible, setAntiShakeVisible] = useState(false)

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
      setProject(proj)
      !ignorePe && pe.current.resetProj(proj)
      pf.current.updateProject(proj)
      const headBtn = document.getElementById('headBtn');
      headBtn.innerHTML = proj?.name
    }

    const openProjectById = async (id) => {
      message.info("正在加载项目，请稍候")
      let proj = await ProjectStore.getById(id)
      updateProject(proj)
      setOpenProjectVisible(false)
    }

    const successLogin = role => {
      message.success("登录成功")
      setIsLogin(true)
      setLoginModalVisible(false)
      setRole(role)
    }

    const items = [
      {
        key: "proj",
        label: '项  目',
        icon: <ProjectOutlined/>,
        children: [
          {
            key: "proj-create",
            label: '新建项目',
            disabled: role < 2,
            onClick: async () => {
              let proj = await ProjectStore.createNewProject()
              if (proj != null) {
                updateProject(proj)
              }
            }
          },
          {
            key: "proj-open",
            label: '打开项目',
            onClick: async () => {
              setProjectList(await ProjectStore.getAll())
              setOpenProjectVisible(true)
            }
          },
          {
            key: "proj-save",
            label: '保存项目',
            disabled: !project || role < 2,
            onClick: async () => {
              let resp = await ProjectStore.save(project)
              if (resp.s) {
                message.success("保存成功")
              } else {
                message.warn("保存失败，项目可能已被删除")
              }
            }
          },
          {
            key: "proj-remove",
            label: '删除项目',
            disabled: !project || role < 2,
            onClick: async () => {
              Modal.confirm({
                title: `删除项目`,
                content: `确认删除 ${project.name} 吗`,
                icon: <ExclamationCircleOutlined/>,
                okText: '确认',
                cancelText: '取消',
                onOk: async () => {
                  let resp = await ProjectStore.delete(project.id)
                  if (resp) {
                    message.success("删除成功")
                    // 不知道为啥，不异步删除没法关闭confirm框
                    setTimeout(() => updateProject(null), 0)
                  } else {
                    message.error("删除失败")
                  }
                }
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
            disabled: role < 1,
            children: [
              {
                key: "tool-bg-open",
                label: "上传背景",
                onClick: async () => {
                  project.background = await files.readFile(() => {
                    message.info("图片正在加载中，请稍候")
                  }, false);
                  updateProject(project)
                }
              },
              {
                key: "tool-bg-rem",
                label: "移除背景",
                onClick: () => {
                  project.background = null
                  updateProject(project)
                }
              }
            ]
          },
          {
            key: "tool-excel",
            label: '批量生成',
            disabled: role < 1,
            onClick: () => {
              setBatchModalVisible(true)
            }
          },
          {
            key: "tool-cloud",
            label: '云端数据',
            disabled: role < 1,
            onClick: async () => {
              setCloudDataVisible(true)
            }
          },
          {
            key: "tool-output",
            label: '导出配置',
            disabled: role < 1,
            onClick: async () => {
              setOutputNameConfigVisible(true)
            }
          },
          {
            key: "tool-anti-shake",
            label: '防抖时间',
            disabled: role < 1,
            onClick: async () => {
              setAntiShakeVisible(true)
            }
          }
        ],
      },
      {
        key: "account",
        label: '账  户',
        icon: <UserOutlined/>,
        disabled: !isLogin,
        children: [
          {
            key: 'account-role',
            label: '权限管理',
            onClick: () => {
              setRoleManageVisible(true)
            }
          }
        ]
      }
    ];


    useEffect(() => {
      if (localStorage.getItem("accessToken")) {
        setIsLogin(true)
        console.log("setup - isLogin")
      }
      let r = localStorage.getItem("role")
      if (r) {
        setRole(parseInt(r))
        console.log("setup - set role", r)
      }
    }, [setIsLogin, setRole])


    return (
      <div>
        {/*添加一个全局的文件上传器，不用在每个地方都重新写*/}
        <input type="file" id="upload-block-real-input" style={{display: 'none'}}
               accept="image/gif,image/jpeg,image/jpg,image/png"/>
        <div className="g-page">
          <div className="m-hide-in-mobile" style={{position: "relative"}}>
            <Menu mode="horizontal" items={items}/>
            {
              isLogin ?
                <div className="m-app-menu-login-btn">
                  <span>{localStorage.getItem("username")} &nbsp;</span>
                  <Button onClick={() => {
                    localStorage.removeItem("username")
                    localStorage.removeItem("accessToken")
                    localStorage.removeItem("role")
                    setIsLogin(false)
                    setRole(0)
                  }}>
                    退出
                  </Button>
                </div> :
                <Button className="m-app-menu-login-btn" onClick={() => setLoginModalVisible(true)}>
                  登录
                </Button>
            }
          </div>
          <div className="m-head-btn" id='headBtn' onClick={
            async () => {
              setProjectList(await ProjectStore.getAll())
              setOpenProjectVisible(true)
            }
          }>
            点击选择项目
          </div>
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
                       canEdit={role > 1}
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
              <ProjectForm ref={pf} project={project} role={role}/>
            </div>
          </div>
        </div>

        {batchModalVisible && <BatchLoadFromExcel project={project} close={() => setBatchModalVisible(false)}/>}

        {cloudDataVisible && <CloudData project={project} close={() => setCloudDataVisible(false)}/>}

        {loginModalVisible && <Login onLogin={successLogin} close={() => setLoginModalVisible(false)}/>}

        {roleManageVisible && <RoleManage close={() => setRoleManageVisible(false)} role={role}/>}

        {outputNameConfigVisible &&
        <FormulaEditor project={project}
                       defaultValue={project.outputNamePattern}
                       title="配置导出文件名"
                       containsData={true}
                       onSuccess={tmp => {
                         project.outputNamePattern = tmp
                         updateProject(project, true)
                         setOutputNameConfigVisible(false)
                       }}
                       close={() => setOutputNameConfigVisible(false)}/>
        }

        {antiShakeVisible &&
        <AntiShakeSetter defaultValue={project.antiShakeTime}
                         close={()=>setAntiShakeVisible(false)}
                         onSuccess={(time)=>{
                           project.antiShakeTime = time
                           updateProject(project, true)
                           setAntiShakeVisible(false)
                         }}/>
        }

        <Modal title="打开项目"
               visible={openProjectVisible}
               onCancel={() => setOpenProjectVisible(false)}
               footer={null}
               width={600}
        >
          {
            projectList.map(p =>
              p.role <= role &&
              <div className="m-app-pl-line" key={p.id}>
                <div className="m-app-pl-line-name">
                  {p.name}
                </div>
                <div className="m-app-pl-line-btns">
                  <Button size="small" onClick={() => openProjectById(p.id)}>
                    打开
                  </Button>
                  {
                    role >= 2 &&
                    <Button size="small" className="m-hide-in-mobile"
                            onClick={() => {
                              if (!isLogin) {
                                message.error("请先登录！")
                                return
                              }
                              Modal.confirm({
                                title: `删除项目`,
                                content: `确认删除 ${p.name} 吗`,
                                icon: <ExclamationCircleOutlined/>,
                                okText: '确认',
                                cancelText: '取消',
                                onOk: async () => {
                                  let resp = await ProjectStore.delete(p.id)
                                  if (resp) {
                                    message.success("删除成功")
                                    if (project.id === p.id) {
                                      setTimeout(() => updateProject(null), 0)
                                    }
                                    setProjectList(await ProjectStore.getAll())
                                  } else {
                                    message.error("删除失败")
                                  }
                                }
                              })
                            }}>
                      删除
                    </Button>
                  }
                  {
                    role >= 2 &&
                    <Popover placement="top" content={<>
                      <Select defaultValue={p.role} style={{width: 150}}
                              onChange={async r => {
                                let projectMetadata = ProjectMetadata.fromObj(JSON.parse(p.content));
                                projectMetadata.role = r;
                                let resp = await ProjectStore.save(projectMetadata)
                                if (!resp.s) {
                                  message.error(resp.m)
                                  return
                                }
                                message.success("修改项目可见性成功")
                                p.role = r
                              }}>
                        <Option value={0}>所有人可见</Option>
                        <Option value={1}>教师可见</Option>
                        <Option value={2}>管理员可见</Option>
                        {
                          role >= 3 && <Option value={3}>测试内部可见</Option>
                        }
                      </Select>
                    </>}>
                      <Button size="small" className="m-hide-in-mobile">
                        可见性
                      </Button>
                    </Popover>
                  }
                </div>
              </div>
            )
          }
        </Modal>

      </div>

    );
  }
;

export default App;
