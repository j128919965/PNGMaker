import {Button, Input, Modal, Tooltip} from "antd";
import {useState} from "react";
import formula from "../../utils/formula";

export const FormulaEditor = props => {
  const {close, onSuccess, defaultValue, redPoint, project, title, containsData} = props

  const [tempDefault, setTempDefault] = useState(defaultValue)

  const calcFormula = () => {
    const resp = formula.exec(tempDefault, redPoint, project)
    if (resp.s) {
      return <span>{resp.d}</span>
    }
    return <span style={{color: "red"}}>{resp.m}</span>
  }

  return <>
    <Modal title={<>
      {title == null ? '修改默认值' : title}
      <Tooltip placement="topRight" title={() => calcFormula()} mouseLeaveDelay={10}>
        <Button size={"small"} style={{marginLeft:'10px'}}>预览</Button>
      </Tooltip>

    </>}
           visible={true}
           onOk={() => onSuccess(tempDefault)}
           onCancel={close}
           okText="确定"
           cancelText="取消"
           width={800}
    >
      <div style={{display: "flex", flexWrap: "nowrap"}}>
        <Input.TextArea placeholder="输入默认值（公式）" value={tempDefault} onChange={(v) => {
          setTempDefault(v.target.value)
        }}/>

      </div>
      <div style={{marginTop: '20px', marginLeft: '20px'}}>
        <h3>可用的功能：</h3>
        <h4>变量</h4>
        <ul>
          <li>{'${now.year}'} ：当前年</li>
          <li>{'${now.month}'} ：当前月</li>
          <li>{'${now.day}'} ：当前日</li>
          {
            redPoint != null && <li>{'${point.label}'} ：当前输入项的备注</li>
          }

          <li>{'${project.name}'} ：当前项目名</li>
          <li>{'${project.id}'} ：当前项目ID</li>
          {
            containsData &&
            <>
              <li>{'${points[n].label}'} : 序号为 n 的输入项的备注</li>
              <li>{'${points[n].value}'} : 序号为 n 的输入项的值</li>
            </>
          }
        </ul>
        <h4>函数</h4>
        <ul>
          <li>{'${uuid(n)}'} ：长度为n的随机字符串</li>
        </ul>
        <h3>示例</h3>
        <ul>
          <li>输入公式为：{'今天是${now.year}年，${now.month}月，${now.day}日。随机编号为${uuid(5)}'}</li>
          <li>得到的示例结果为：今天是2022年，10月，25日。随机编号为I31ZA</li>
        </ul>
        <ul>
          <li>如果输入项类型为图片，默认值请输入图片链接</li>
        </ul>
      </div>
    </Modal>

  </>

}
