import {CheckOutlined, ExclamationOutlined} from "@ant-design/icons";
import {Button} from "antd";
import React from "react";

/**
 *
 * @param result {InputDataLoadResult}
 * @param project {ProjectMetadata}
 */
const getDataLine = (result, project) => {
  let map = {}
  project.points.forEach(point => map[point.id] = point)
  return result.data
    .filter(data => map[data.pointId] != null)
    .filter(data => map[data.pointId].type === 1)
    .filter(data => data?.data?.length >= 1)
    .map(data => {
      /**
       * @type {RedPoint}
       */
      let point = map[data.pointId];
      return `${point.label?.length >= 1 ? point.label : '未命名输入'} : ${data.data}`
    }).join("，")
}

export const CloudDataInLine=(props)=>{

  const {index, result, project} = props

  const {setCurrentResult,setPreviewVisible, setCloudDataFormVisible, render, removeResult,reload} = props

  return (
    <div className="m-bl-line" key={index}>
      <div className={`m-bl-line-icon ${result.success ? 'u-success' : 'u-warning'}`}>
        {result.success ? <CheckOutlined/> : <ExclamationOutlined/>}
      </div>
      <div className="m-bl-line-word">
        {
          !result.success &&
          `第 ${index + 1} 行 '解析错误：' + ${result.message}`
        }
        {
          result.success &&
          <div title={getDataLine(result, project)}
               className="m-cd-data-line">{getDataLine(result, project)}</div>
        }
      </div>
      <div className="m-cd-line-btns">
        {
          result.success &&
          <>
            <Button size={"small"} onClick={() => {
              setCurrentResult(result)
              setCloudDataFormVisible(true)
            }}>
              <span style={{fontSize: "small"}}>查看数据</span>
            </Button>

            <Button size={"small"} onClick={() => {
              setCurrentResult(result)
              setPreviewVisible(true)
            }}>
              <span style={{fontSize: "small"}}>查看预览</span>
            </Button>
            <Button size={"small"} onClick={ async () => {
              await render(result, index + 1)
              reload()
            }}>
              <span style={{fontSize: "small"}}>导出图片</span>
            </Button>
          </>
        }
        <Button size={"small"} onClick={() => {
          removeResult(result)
        }}>
          <span style={{fontSize: "small"}}>删除数据</span>
        </Button>
      </div>
    </div>
  )
}