import './Login.css'
import {Button, Input, message, Modal} from "antd";
import {useState} from "react";
import httpx2 from "../../utils/httpx2";
import urls from "../../data/urls";

export const Login = (props) => {
  const {onLogin, close} = props

  const [err, setErr] = useState(null)
  const [mode, setMode] = useState(1)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')

  const doLogin = async () => {
    if (username?.length < 8) {
      setErr('用户名不能短于8位')
      return
    }
    if (password?.length < 8) {
      setErr('密码不能短于8位')
      return;
    }
    setErr(null)
    console.log({
      username, password
    })
    let resp = await httpx2.post(urls.users.login, {username, password})
    if (!resp.s) {
      message.error(resp.m)
      return
    }
    successLogin(resp.d)
  }

  const doRegister = async () => {
    if (username?.length < 8) {
      setErr('用户名不能短于8位')
      return
    }
    if (password?.length < 8) {
      setErr('密码不能短于8位')
      return;
    }
    if (password !== password2) {
      setErr('两次输入的密码不相同')
      return;
    }
    setErr(null)
    let resp = await httpx2.post(urls.users.register, {username, password})
    if (!resp.s) {
      message.error(resp.m)
      return
    }
    successLogin(resp.d)
  }

  const successLogin = async (tokenObject) => {
    localStorage.setItem("accessToken", tokenObject.accessToken)
    localStorage.setItem("username", username)
    let resp = await httpx2.get(urls.users.role)
    let role = resp.d
    if (!resp.s) {
      message.error("获取用户权限失败")
      role = 0
    }
    localStorage.setItem("role", role.toString())
    onLogin(role)
  }


  return <>
    <Modal title={mode === 1 ? '登录' : '注册'}
           onCancel={close}
           footer={null}
           visible={true}>
      <form className="login-form">
        <div className="margin-top">
          <div>用户名</div>
          <Input type="text" placeholder="请输入用户名"
                 onChange={(e) => setUsername(e.target.value)}/>
        </div>
        <div className="margin-top">
          <div>密码</div>
          <Input type="password" maxLength="20" placeholder="请输入密码"
                 onChange={(e) => setPassword(e.target.value)}/>
        </div>
        <div className="margin-top" style={{display: mode === 2 ? 'block' : 'none'}}>
          <div>确认密码</div>
          <Input type="password" maxLength="20" placeholder="请再次输入密码"
                 onChange={(e) => setPassword2(e.target.value)}/>
        </div>

        <div className="margin-top">
          {
            err != null &&
            <div style={{color: "red", fontSize: "13px"}}>
              {err}
            </div>
          }
          {
            mode === 1 ?
              <Button type="primary" className="m-login-btn margin-top"
                      onClick={doLogin}>
                登录
              </Button> :
              <Button type="primary" className="m-login-btn margin-top"
                      onClick={doRegister}>
                注册
              </Button>
          }
        </div>
      </form>
      <div className="login-tips margin-top">
        <div></div>
        {
          mode === 1 ?
            <Button onClick={() => setMode(2)}>注册新账号</Button> :
            <Button onClick={() => setMode(1)}>登录已有账号</Button>
        }
      </div>
    </Modal>
  </>
}