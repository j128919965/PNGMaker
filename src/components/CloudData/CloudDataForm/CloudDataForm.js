import {Button, Form, Input, message} from "antd";
import React, {useEffect, useState} from "react";
import {EditorWidth} from "../../../data/constants";
import Modal from "antd/es/modal/Modal";
import {InputDataLoadResult} from "../../../data/InputData";
import InputDataStore from "../../../data/InputDataStore";

export const CloudDataForm = (props) => {

  const {close,onSuccess} = props

  const {currentResult, project} = props

  const [isEditing, setIsEditing] = useState(false);

  const [dataInForm, setDataInForm] = useState(null);

  const [dataInDiv, setDataInDiv] = useState(null);

  const [currentData, setCurrentData] = useState(null);


  useEffect(() => {
    initData()
  }, [])

  //存放小红点{id, label, type}
  const pointsMap = {}
  project.points.forEach(point => pointsMap[point.id] = point)


  const initData = (value) => {

    let curData = currentResult.data
      .filter(data => pointsMap[data.pointId] != null)

    setCurrentData(curData)

    //根据数据生成展示数据的DOM数组
    setDataInDiv(curData.map(data => {
      /**
       * @type {RedPoint}
       */
      let point = pointsMap[data.pointId]
      if (point == null) {
        return null
      }
      if (point.type === 1) {
        return [data.pointId, point.label?.length >= 1 ? point.label : '未命名输入',
          <div>{data.data}</div>]
      } else {
        return [data.pointId, point.label?.length >= 1 ? point.label : '未命名输入',
          <img src={data.data} width={150} height={150} alt={point.label}/>]
      }
    }).filter(x => x != null))
  }

  const renderEditor = () => {
    setDataInForm(currentData.map(data => {
      /**
       * @type {RedPoint}
       */
      let point = pointsMap[data.pointId];
      if (point.type === 1) {
        return [data.pointId, point.label?.length >= 1 ? point.label : '未命名输入',
          <Input/>]
      } else {
        return [data.pointId, point.label?.length >= 1 ? point.label : '未命名输入',
          <img src={data.data} width={150} height={150} alt={point.label}/>]
      }
    }))
  }

  const getInitFormValues = () => {
    let curData = currentResult.data
      .filter(data => pointsMap[data.pointId] != null)
    let initData = {}
    curData.forEach(e => {
      initData[e.pointId] = e.data
    })
    return initData
  }

  return (
    <Modal title={
      <div>
        {

          !isEditing &&
          <>
            <span>数据展示</span>
            <Button style={{marginLeft: '30px'}} size="small" onClick={async () => {
              await renderEditor()
              setIsEditing(true)
            }}>修改</Button>
          </>
        }
        {
          isEditing &&
          <span>
            <span>数据编辑</span>
            <Button style={{marginLeft: '30px'}} size="small" onClick={() => {
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
      <Form initialValues={getInitFormValues()} onFinish={async (values) => {
        let inputDataLoadResult = InputDataLoadResult.fromMap(values, project);
        inputDataLoadResult.id = currentResult.id
        let resp = await InputDataStore.update(inputDataLoadResult)
        if (!resp.s) {
          message.error(resp.m)
          return
        }
        message.success("修改成功")
        onSuccess()
      }}>
        {!isEditing &&
          (dataInDiv || []).map(e => <Form.Item key={e[0]} name={e[0]} label={e[1]}>{e[2]}</Form.Item>)
        }
        {isEditing &&
          (dataInForm || []).map(e => <Form.Item key={e[0]} name={e[0]} label={e[1]}>{e[2]}</Form.Item>)
        }
        {
          isEditing &&

          <Button type="primary" htmlType="submit" size="small">保存</Button>
        }
      </Form>
    </Modal>)

}