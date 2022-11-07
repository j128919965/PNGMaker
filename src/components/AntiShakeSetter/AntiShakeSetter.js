import {Form, Input, Modal} from "antd";
import {useState} from "react";

export const AntiShakeSetter = (props) => {

  const {defaultValue, close, onSuccess} = props

  const [shakeTime, setShakeTime] = useState(defaultValue)

  return (
    <Modal title="防抖时间"
           visible={true}
           onCancel={close}
           onOk={() => {
             onSuccess(shakeTime)
           }}
           okText="确定"
           cancelText="取消"
    >
      <div>
        当前项目防抖时间为:{defaultValue}（单位：秒）
        <Input type="number" placeholder="请输入项目防抖时间" min="0" onChange={v => {
          setShakeTime(v.target.value)
        }}/>
      </div>
    </Modal>
  )

}