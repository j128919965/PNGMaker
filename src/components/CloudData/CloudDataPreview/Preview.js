import {EditorHeight, EditorWidth} from "../../../data/constants";
import {Button} from "antd";
import React from "react";

export const Preview = (props) => {

  const {render, currentResult, onSuccess} = props

  return (
    <div className='m-pf-preview-container' style={{width: '100%', display: 'flex',}}>
      <canvas
        width={EditorWidth * 0.8}
        height={EditorHeight * 0.8}
        id='m-cd-preview' style={{border: '1px solid black'}}>
        请更换浏览器！推荐使用Google Chrome
      </canvas>
      <Button className='u-pf-btn'
              type={"primary"}
              style={{marginTop: 20}}
              onClick={async () => {
                await render(currentResult, null)
                onSuccess()
              }}
      >
        导出图片
      </Button>
    </div>
  )

}