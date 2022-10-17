import {Button, Empty, message, Modal, Select} from "antd";
import {ProjectMetadata} from "../../data/ProjectMetadata";
import ProjectStore from "../../data/ProjectStore";
import React, {useEffect, useState} from "react";
import httpx2 from "../../utils/httpx2";
import urls from "../../data/urls";
import {CheckOutlined, ExclamationOutlined} from "@ant-design/icons";

const {Option} = Select

const getRoleName = role => {
  if (role === 0) return '学生'
  if (role === 1) return '教师'
  if (role === 2) return '管理员'
  if (role === 3) return '开发者'
}

export const RoleManage = props => {
  const {close, role} = props
  const [newRole, setNewRole] = useState(role)
  const [reqs, setReqs] = useState([])

  const load = async () => {
    let resp = await httpx2.get(urls.roleAsks.getAllNotHandled)
    if (resp.s) {
      setReqs(resp.d)
    }
  }
  useEffect(() => {
    load()
  }, [setReqs])

  const handle = async (id, status) => {
    let resp = await httpx2.post(urls.roleAsks.handle, {id, status})
    if (!resp.s) {
      message.error(resp.m)
      return
    }
    message.success(status === 1 ? '通过成功，请通知员工重新登录系统' : '拒绝成功')
    load()
  }

  return <>
    <Modal
      title={<>权限管理&nbsp;&nbsp;&nbsp;&nbsp;<span style={{fontSize: '13px'}}>当前权限：{getRoleName(role)}</span></>}
      visible={true}
      footer={null}
      width={role >= 2 ? 800 : 300}
      onCancel={close}
    >
      {
        role < 2 &&
        <div>
          <h2>申请权限</h2>
          <div>
            <Select className="margin-top" defaultValue={role} style={{width: 150}} onChange={v => setNewRole(v)}>
              <Option disabled={role >= 0} value={0}>学生</Option>
              <Option disabled={role >= 1} value={1}>教师</Option>
              <Option value={2}>管理员</Option>
            </Select>
          </div>
          <Button className="margin-top" disabled={newRole === role} onClick={
            async () => {
              let resp = await httpx2.post(urls.roleAsks.create + `?role=${newRole}`)
              if (!resp.s) {
                message.error(resp.m)
                return
              }
              message.success("申请成功，请等待管理员审核")
              close()
            }
          }>确认申请</Button>
        </div>
      }

      {
        role >= 2 &&
        <div>
          <div className="m-bl-line">
            <div className="m-bl-line-word percent40">
              用户名
            </div>
            <div className="m-bl-line-word percent25">
              申请权限
            </div>
            <div className="m-bl-line-btns percent15">
              <div>操作</div>
            </div>
          </div>
          {
            reqs.map(req => <>
              <div className="m-bl-line">
                <div className="m-bl-line-word percent40">
                  {req.username}
                </div>
                <div className="m-bl-line-word percent25">
                  {getRoleName(req.role)}
                </div>
                <div className="m-bl-line-btns percent15">
                  <Button size={"small"} onClick={() => handle(req.id, 2)}>
                    <span style={{fontSize: "small"}}>拒绝</span>
                  </Button>
                  <Button type={"primary"} size={"small"} onClick={() => handle(req.id, 1)}>
                    <span style={{fontSize: "small"}}>通过</span>
                  </Button>
                </div>

              </div>
            </>)
          }
          {
            reqs?.length < 1 &&
            <div className="m-main-hint">
              <Empty description=""/>
              暂无新的权限申请
            </div>
          }
        </div>
      }
    </Modal>
  </>
}