import {Input, Modal} from "antd";
import {useState} from "react";

export const AntiShakeSetter = (props) => {

  const {defaultValue, close, onSuccess} = props

  const [shakeTime, setShakeTime] = useState(defaultValue)

  return (
    <Modal title="上传冷却"
           visible={true}
           onCancel={close}
           onOk={() => {
             onSuccess(shakeTime)
           }}
           okText="确定"
           cancelText="取消"
    >
      <div>
        上传冷却（秒）
        <Input type="number" defaultValue={defaultValue} placeholder="请输入云端数据上传冷却时间" min="0" onChange={v => {
          setShakeTime(v.target.value)
        }}/>
      </div>
    </Modal>
  )

}