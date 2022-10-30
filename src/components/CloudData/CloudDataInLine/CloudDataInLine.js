import {CheckOutlined, ExclamationOutlined} from "@ant-design/icons";
import {Button} from "antd";
import React from "react";

export const CloudDataInLine=(props)=>{

  const {index, result, cloudDataFormVisible, project, previewVisible} = props

  const {setCurrentResult,setPreviewVisible, setCloudDataFormVisible, getDataLine, render, removeResult} = props

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
            <Button size={"small"} onClick={() => {
              render(result, index + 1)
            }}>
              <span style={{fontSize: "small"}}>导出图片</span>
            </Button>
          </>
        }
        <Button size={"small"} onClick={() => removeResult(result)}>
          <span style={{fontSize: "small"}}>删除数据</span>
        </Button>
      </div>
    </div>
  )
}