import {Button, Form, Input} from "antd";
import React, {useEffect, useState} from "react";
import urls from "../../../data/urls";
import {EditorWidth} from "../../../data/constants";
import Modal from "antd/es/modal/Modal";

export const CloudDataForm = (props) => {

  const {close} = props

  const {currentResult, project} = props

  const [isEditing, setIsEditing] = useState(false);

  const [dataInForm, setDataInForm] = useState(null);

  const [dataInDiv, setDataInDiv] = useState(null);

  const [currentData, setCurrentData] = useState(null);

  const [newData, setNewData] = useState(null);

  //存放小红点{id, label, type}
  let pointsMap = {}
  project.points.forEach(point => pointsMap[point.id] = point)

  const initData = (value) => {

    let curData = currentResult.data
      .filter(data => pointsMap[data.pointId] != null)
      .filter(data => data?.data?.length >= 1)
    //初始化数据
    console.log(curData)
    setCurrentData(curData)

    //根据数据生成展示数据的DOM数组
    setDataInDiv(curData.map(data => {
      /**
       * @type {RedPoint}
       */
      let point = pointsMap[data.pointId]
      if (point.type === 1){
        return [data.pointId, point.label?.length >= 1 ? point.label : '未命名输入',
          <div>{data.data}</div>]
      }else if (point.type ===2){
        return [data.pointId, point.label?.length >= 1 ? point.label : '未命名输入',
          <img src={data.data} width={150} height={150} alt={point.label}/>]
      }
    }))
  }

  const save = () => {
    urls.input.update(newData)
  }

  const renderEditor = () => {
    setDataInForm(currentData.map(data => {
      /**
       * @type {RedPoint}
       */
      let point = pointsMap[data.pointId];

      if (point.type === 1){
        return [data.pointId, point.label?.length >= 1 ? point.label : '未命名输入',
          <Input defaultValue={data.data}/>]
      }else if (point.type ===2){
        return [data.pointId, point.label?.length >= 1 ? point.label : '未命名输入',
          <img src={data.data} width={150} height={150} alt={point.label}/>]
      }
    }))
  }

  useEffect(()=>{
    initData()
  }, [])

  return (
    <Modal title={
      <div>
        <span>数据展示</span>
        {
          !isEditing &&
          <Button onClick={() => {
            renderEditor()
            setIsEditing(true)
          }}>全部修改</Button>
        }
        {
          isEditing &&
          <span>
            <Button type="primary" htmlType="submit">保存</Button>
            <Button onClick={() => {
              setIsEditing(false)
              initData()
            }}>取消</Button>
          </span>
        }
      </div>}
           width={EditorWidth * 0.8 + 100}
           visible={true}
           footer={null}
           onCancel={close}
    >
      <Form onFinish={(values)=>{console.log(values)}}>
        {!isEditing &&
        (dataInDiv || []).map(e => <Form.Item name={e[0]} label={e[1]}>{e[2]}</Form.Item>)
        }
        {isEditing &&
        (dataInForm || []).map(e => <Form.Item name={e[0]} label={e[1]}>{e[2]}</Form.Item>)
        }
      </Form>
    </Modal>)

}