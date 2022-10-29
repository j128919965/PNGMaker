import {Button, Form, Input} from "antd";
import React, {useState} from "react";
import {post} from "../../../utils/httpx";
import urls from "../../../data/urls";

const initForm = (data)=>{
  let map = {}

  let showData = data
    .map(data => {
      /**
       * @type {RedPoint}
       */
      let point = map[data.pointId]
      return <Form.Item label={point.label?.length >= 1 ? point.label : '未命名输入'}>
        {
          point.type === 1 &&
          <div>
            {data.data}
          </div>
        }
        {
          point.type === 2 &&
          <img src={data.data} width={150} height={150} alt={point.label}/>
        }
      </Form.Item>
    })

  return showData
}

const rewriteData = (res)=>{

}


export const CloudDataForm = (res, proj) => {

  const {isEditing, setIsEditing} = useState(false);

  let newData = {}

  let map = {}

  proj.points.forEach(point => map[point.id] = point)

  let dataResult = res.data
    .filter(data => map[data.pointId] != null)
    .filter(data => data?.data?.length >= 1)

  let showData = initForm(dataResult)

  const save = ()=>{
    urls.input.update(newData)
  }

  let formData = dataResult
    .map(data => {
      /**
       * @type {RedPoint}
       */
      let point = map[data.pointId];
      return <Form.Item label={point.label?.length >= 1 ? point.label : '未命名输入'}>
        {
          point.type === 1 &&
          <Input defaultValue={data.data}/>
        }
        {
          point.type === 2 &&
          <img src={data.data} width={150} height={150} alt={point.label}/>
        }
      </Form.Item>
    })

  return <Form>
    <Button onClick={()=>{setIsEditing(true)}}>全部修改</Button>

    {!isEditing&&
      showData.map(e => <div>{e}</div>)
    }
    {
      isEditing&&
      <div>
        <Button htmlType="submit" onClick={()=>{
          save()
        }}>保存</Button>
        {formData.map(e=><div>{e}</div>)}
      </div>
    }
  </Form>

}