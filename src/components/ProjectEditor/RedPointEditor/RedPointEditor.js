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
import {PicturePatternEditor} from "./PicturePatternEditor/PicturePatternEditor";
import {WordPatternEditor} from "./WordPatternEditor/WordPatternEditor";

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

  const updatePoint = (p) => {
    setRedPoint(p ?? redPoint)
    props.onUpdate(p ?? redPoint)
  }

  const items = [
    getItem('格式', 'pe-sub1', <FontColorsOutlined/>, undefined, () => {

      if (redPoint.type === 1) {
        setIsFontModalVisible(true)
      } else {
        setIsPictureModalVisible(true)
      }
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

  const [isLabelModalVisible, setIsLabelModalVisible] = useState(false);

  const [isFontModalVisible, setIsFontModalVisible] = useState(false)

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
          isFontModalVisible &&
          <WordPatternEditor project={props.project}
                                redPoint={redPoint}
                                close={() => setIsFontModalVisible(false)}
                                onSuccess={(p) => {
                                  updatePoint(p)
                                  setIsFontModalVisible(false)
                                }}
          />
      }

      {
        isPictureModalVisible &&
        <PicturePatternEditor project={props.project}
                              redPoint={redPoint}
                              close={() => setIsPictureModalVisible(false)}
                              onSuccess={(p) => {
                                updatePoint(p)
                                setIsPictureModalVisible(false)
                              }}
        />
      }

    </>
  )
})

export default RedPointEditor
