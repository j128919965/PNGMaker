import {forwardRef, useImperativeHandle, useState} from "react";
import {
  BlockOutlined,
  CheckOutlined,
  CloseCircleOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  FontColorsOutlined
} from "@ant-design/icons";
import {Button, Input, Menu, message, Modal, Select, Switch} from "antd";

import {FontPattern, PicturePattern, RedPoint} from "../../../data/ProjectMetadata";

import './RedPointEditor.css'
import {FormulaEditor} from "../../FomulaEditor/FormulaEditor";

const {Option} = Select

function getItem(label, key, icon, children, onClick) {
  return {
    key,
    icon,
    children,
    label,
    onClick,
  };
}

const RedPointEditor = forwardRef((props, ref) => {
  const [redPoint, setRedPoint] = useState(RedPoint.default(-1))
  const [isWord, setIsWord] = useState(redPoint.type === 1)

  useImperativeHandle(ref, () => ({
    setRedPoint: (p) => {
      setRedPoint(p);
      setIsWord(p.type === 1)
    }
  }))

  const updatePoint = () => {
    setRedPoint(redPoint)
    props.onUpdate(redPoint)
  }

  const items = [
    getItem('格式', 'pe-sub1', <FontColorsOutlined/>, undefined, () => {

      if (redPoint.type === 1) {
        // 这个地方要进行一次深copy，否则会污染
        setTempFont(redPoint.pattern.clone())
        setIsFontModalVisible(true)
      } else {
        // 这个地方要进行一次深copy，否则会污染
        setTempPicture(redPoint.pattern.clone())
        setIsPictureModalVisible(true)
      }
      setTempVisible(redPoint.visible)
      setTempDefaultValue(redPoint.defaultValue)
      setTempNecessity(redPoint.isNecessary)
    }),

    {
      label: '类别',
      key: 'pe-sub2',
      icon: <BlockOutlined/>,
      children: [
        {
          key: 'pe-sub2-1',
          icon: <CheckOutlined style={{display: isWord ? 'inline' : "none"}}/>,
          label: `文字`,
          onClick: () => setPointType(1),
        },
        {
          key: 'pe-sub2-2',
          icon: <CheckOutlined style={{display: !isWord ? 'inline' : "none"}}/>,
          label: `图片`,
          onClick: () => setPointType(2),
        }
      ]

    },
    getItem('备注', 'pe-sub3', <EditOutlined/>, undefined, () => {
      setTempLabel(redPoint.label)
      setIsLabelModalVisible(true)
    }),
    getItem('删除', 'pe-sub4', <CloseCircleOutlined/>, undefined, async () => {
      Modal.confirm({
        title: `删除项目`,
        content: <>确认删除 {redPoint.id} 吗？<br/>注意，已保存的云端数据可能会解析出错。</>,
        icon: <ExclamationCircleOutlined/>,
        okText: '确认',
        cancelText: '取消',
        onOk: () => props.onDelete(redPoint.id)
      })
    })
  ]

  /**
   *
   * @param type {number}
   */
  const setPointType = (type) => {
    Modal.confirm({
      title: `修改输入类型`,
      content:
        <div>确认将输入类型修改为 {type === 1 ? '文字' : '图片'} 吗？<br/> 已设置过的 {type === 2 ? '文字' : '图片'} 格式将会丢失！<br/>同时，已保存的云端数据将解析出错。
        </div>,
      icon: <ExclamationCircleOutlined/>,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        setIsWord(type === 1)
        redPoint.type = type
        if (type === 1) {
          redPoint.pattern = FontPattern.fromObj({align: redPoint.pattern.align})
        } else {
          redPoint.pattern = PicturePattern.fromObj({align: redPoint.pattern.align})
        }
        updatePoint()
      }
    })
  }

  const [tempLabel, setTempLabel] = useState(redPoint.label);

  const [tempVisible, setTempVisible] = useState(redPoint.visible);

  const [tempNecessity, setTempNecessity] = useState(redPoint.isNecessary)

  const [tempDefaultValue, setTempDefaultValue] = useState(redPoint.defaultValue)

  const [isLabelModalVisible, setIsLabelModalVisible] = useState(false);

  const [isDefaultModalVisible, setIsDefaultModalVisible] = useState(false);

  const [tempFont, setTempFont] = useState(FontPattern.default())

  const [isFontModalVisible, setIsFontModalVisible] = useState(false)

  const [tempPicture, setTempPicture] = useState(PicturePattern.default())

  const [isPictureModalVisible, setIsPictureModalVisible] = useState(false)

  return (
    <>
      <div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
        <div style={{background: '#fff', paddingLeft: 20, fontSize: 24}}>第 {redPoint.id} 项输入</div>
        <Menu
          style={{
            width: 256,
            height: '100%'
          }}
          mode="vertical"
          items={items}
        />
      </div>


      <Modal title="修改备注"
             visible={isLabelModalVisible}
             onOk={() => {
               redPoint.label = tempLabel
               updatePoint()
               setIsLabelModalVisible(false)
             }}
             onCancel={() => setIsLabelModalVisible(false)}
             okText="确定"
             cancelText="取消"
      >
        <Input placeholder="输入备注" value={tempLabel} onChange={(v) => {
          setTempLabel(v.target.value)
        }}/>
      </Modal>


      {
        isDefaultModalVisible &&
        <FormulaEditor project={props.project}
                       redPoint={redPoint}
                       defaultValue={tempDefaultValue}
                       onSuccess={tmp => {
                         setTempDefaultValue(tmp)
                         setIsDefaultModalVisible(false)
                       }}
                       close={() => {
                         setIsDefaultModalVisible(false)
                       }}
        />

      }

      <Modal title="设置文字红点格式"
             visible={isFontModalVisible}
             onOk={() => {
               redPoint.isNecessary = tempNecessity
               redPoint.visible = tempVisible
               redPoint.defaultValue = tempDefaultValue
               redPoint.pattern = tempFont
               updatePoint()
               setIsFontModalVisible(false)
             }}
             onCancel={() => {
               setIsFontModalVisible(false)
             }}
             okText="确定"
             cancelText="取消"
             destroyOnClose={true}
      >
        <div className="m-re-pt-container">
          <div className="m-re-pt-block">
            字体类型
            <Select defaultValue={tempFont.fontType} style={{width: 120}} onChange={(v) => {
              tempFont.fontType = v;
              setTempFont(tempFont)
            }}>
              <Option value="宋体">宋体</Option>
              <Option value="楷体">楷体</Option>
              <Option value="黑体">黑体</Option>
              <Option value="华文新魏">华文新魏</Option>
            </Select>
          </div>
          <div className="m-re-pt-block">
            字体大小
            <Input type="number"
                   defaultValue={tempFont.fontSize}
                   style={{width: 120}}
                   onChange={(v) => {
                     tempFont.fontSize = v.target.value
                     setTempFont(tempFont)
                   }}
            />
          </div>
          <div className="m-re-pt-block small">
            加粗
            <Switch defaultChecked={tempFont.bold}
                    style={{width: 40}}
                    onChange={(checked) => {
                      tempFont.bold = checked
                      setTempFont(tempFont)
                    }}/>
          </div>
          <div className="m-re-pt-block small">
            斜体
            <Switch defaultChecked={tempFont.italic}
                    style={{width: 40}}
                    onChange={(checked) => {
                      tempFont.italic = checked
                      setTempFont(tempFont)
                    }}/>
          </div>
          <div className="m-re-pt-block small">
            字体颜色
            <Input type='color' defaultValue={tempFont.color} style={{width: "42px"}}
                   onChange={v => tempFont.color = v.target.value}/>
          </div>
          <div className="m-re-pt-block" style={{width: '100%'}}>
            对齐方式
            <Select defaultValue={tempFont.align} style={{width: 300}} onChange={(v) => {
              tempFont.align = v;
              setTempFont(tempFont)
            }}>
              <Option value={1}>以小红点左上角为输入左上角</Option>
              <Option value={2}>以小红点中心为输入左上角</Option>
              <Option value={3}>以小红点中心为输入中心</Option>
              <Option value={4}>以小红点右下角为输入右下角</Option>
              <Option value={5}>以小红点中心为输入右下角</Option>
            </Select>
          </div>
          <div className="m-re-pt-block medium">
            可见性
            <Switch checked={tempVisible}
                    style={{width: 56}}
                    checkedChildren="可见"
                    unCheckedChildren="隐藏"
                    onChange={v => {
                      if (!v) {
                        setTempNecessity(false)
                      }
                      setTempVisible(v)
                    }}/>
          </div>
          <div className="m-re-pt-block medium">
            是否必填
            <Switch checked={tempNecessity}
                    style={{width: 56}}
                    checkedChildren="必填"
                    unCheckedChildren="可空"
                    onChange={v => {
                      if (v) {
                        setTempVisible(true)
                        setTempDefaultValue("")
                      }
                      setTempNecessity(v)
                    }}/>
          </div>
          <div className="m-re-pt-block large">
            默认值
            <div style={{fontSize: 12}}>
              当前默认值为：{tempDefaultValue?.trim()?.length < 1 ? "无默认值" : tempDefaultValue}
            </div>
            <Button style={{width: 120}}
                    disabled={tempNecessity}
                    onClick={() => {
                      if (tempNecessity) {
                        message.error(`必填项不可设置默认值`)
                      } else {
                        setIsDefaultModalVisible(true)
                      }
                    }}>设置默认值</Button>
          </div>
        </div>
      </Modal>

      <Modal title="设置图片红点格式"
             visible={isPictureModalVisible}
             onOk={() => {
               redPoint.isNecessary = tempNecessity
               redPoint.visible = tempVisible
               redPoint.defaultValue = tempDefaultValue
               redPoint.pattern = tempPicture
               updatePoint()
               setIsPictureModalVisible(false)
             }}
             onCancel={() => {
               setIsPictureModalVisible(false)
             }}
             okText="确定"
             cancelText="取消"
             destroyOnClose={true}
      >
        <div className="m-re-pt-container">
          <div className="m-re-pt-block">
            高度（像素）
            <Input type="number"
                   defaultValue={tempPicture.height}
                   style={{width: 120}}
                   onChange={(v) => {
                     tempPicture.height = v.target.value
                     setTempPicture(tempPicture)
                   }}
            />
          </div>
          <div className="m-re-pt-block">
            宽度（像素）
            <Input type="number"
                   defaultValue={tempPicture.width}
                   style={{width: 120}}
                   onChange={(v) => {
                     tempPicture.width = v.target.value
                     setTempPicture(tempPicture)
                   }}
            />
          </div>
          <div className="m-re-pt-block" style={{width: '100%'}}>
            对齐方式
            <Select defaultValue={tempPicture.align} style={{width: 300}} onChange={(v) => {
              tempPicture.align = v;
              setTempPicture(tempPicture)
            }}>
              <Option value={1}>以小红点左上角为输入左上角</Option>
              <Option value={2}>以小红点中心为输入左上角</Option>
              <Option value={3}>以小红点中心为输入中心</Option>
              <Option value={4}>以小红点右下角为输入右下角</Option>
              <Option value={5}>以小红点中心为输入右下角</Option>
            </Select>
          </div>
          <div className="m-re-pt-block medium">
            可见性
            <Switch checked={tempVisible}
                    style={{width: 56}}
                    checkedChildren="可见"
                    unCheckedChildren="隐藏"
                    onChange={v => {
                      if (!v) {
                        setTempNecessity(false)
                      }
                      setTempVisible(v)
                    }}/>
          </div>
          <div className="m-re-pt-block medium">
            是否必填
            <Switch checked={tempNecessity}
                    style={{width: 56}}
                    checkedChildren="必填"
                    unCheckedChildren="可空"
                    onChange={v => {
                      if (v) {
                        setTempVisible(true)
                        setTempDefaultValue("")
                      }
                      setTempNecessity(v)
                    }}/>
          </div>
          <div className="m-re-pt-block large">
            默认值
            <div style={{fontSize: 12}}>
              当前默认值为：{tempDefaultValue?.trim()?.length < 1 ? "无默认值" : tempDefaultValue}
            </div>
            <Button style={{width: 120}}
                    disabled={tempNecessity}
                    onClick={() => {
                      if (tempNecessity) {
                        message.error(`必填项不可设置默认值`)
                      } else {
                        setIsDefaultModalVisible(true)
                      }
                    }}>设置默认值</Button>
          </div>
        </div>
      </Modal>
    </>
  )
})

export default RedPointEditor
