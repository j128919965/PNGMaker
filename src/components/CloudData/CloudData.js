import {Button, Empty, Form, message, Modal, Select} from "antd";
import {CheckOutlined, EditOutlined, ExclamationOutlined, LoadingOutlined} from "@ant-design/icons";
import {EditorHeight, EditorWidth} from "../../data/constants";
import ImageRenderer from "../ImageRenderer/ImageRenderer";
import React, {useEffect, useState} from "react";
import InputDataStore from "../../data/InputDataStore";

import './index.css'
import EdiText from "react-editext";

const {Option} = Select

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

const getDataDiv = (result, project) => {
  let map = {}
  project.points.forEach(point => map[point.id] = point)
  let r = result.data
    .filter(data => map[data.pointId] != null)
    .filter(data => data?.data?.length >= 1)
    .map(data => {
      /**
       * @type {RedPoint}
       */
      let point = map[data.pointId];
      return <div>
        <div className="m-cd-data-div-title">
          {point.label?.length >= 1 ? point.label : '未命名输入'}
        </div>
        {
          point.type === 1 &&
          <div className="m-cd-data-div-word">
            <EdiText saveButtonClassName="m-menu-proj-name-btn"
                     saveButtonContent="✓"
                     cancelButtonClassName="m-menu-proj-name-btn"
                     cancelButtonContent="✕"
                     editButtonClassName="m-menu-proj-name-btn"
                     editButtonContent={<EditOutlined/>}
                     value={data.data} onSave={v => {
              console.log(data.data)
            }}/>
          </div>
        }
        {
          point.type === 2 &&
          <img src={data.data} width={150} height={150} alt={point.label}/>
        }
      </div>
    })
  return <>
    {r.map(e => <div>
      {e}</div>)}
  </>
}

const dataFormRewrite = (res, proj) => {
  let map = {}
  proj.points.forEach(point => map[point.id] = point)
  let r = res.data
    .filter(data => map[data.pointId] != null)
    .filter(data => data?.data?.length >= 1)
    .map(data => {
      /**
       * @type {RedPoint}
       */
      let point = map[data.pointId];
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
  return <Form>
    {r.map(e => <div>{e}</div>)}
  </Form>

}

export const CloudData = (props) => {
  const {project, close} = props

  const [batchLoadResults, setBatchLoadResults] = useState(null)

  const [loading, setLoading] = useState(false)

  const [previewVisible, setPreviewVisible] = useState(false)

  const [dataVisible, setDataVisible] = useState(false)

  const [rewriteVisible, setRewriteVisible] = useState(false)

  const [currentResult, setCurrentResult] = useState(null)

  const [showRendered, setShowRendered] = useState(false)

  const init = async () => {
    console.log("cloud data init")
    setLoading(true)
    let results = await InputDataStore.getAllByProject(project.id, showRendered)
    setBatchLoadResults(results)
    setLoading(false)
  }

  const removeResult = async (res) => {
    let deleted = await InputDataStore.remove(res.id)
    if (deleted) {
      message.success("删除成功")
      await init()
    } else {
      message.error("删除失败，请检查")
    }
  }

  const render = async (result, id) => {
    let blImageRenderer = new ImageRenderer()
    blImageRenderer.load(project)
    await blImageRenderer.download(result, id)
    await InputDataStore.setRendered(result.id)
    init()
  }

  const drawPreView = async () => {
    const previewCanvas = document.getElementById("m-cd-preview")
    previewCanvas.getContext('2d').clearRect(0, 0, previewCanvas.width, previewCanvas.height)
    let blImageRenderer = new ImageRenderer()
    blImageRenderer.load(project)
    await blImageRenderer.showPreview(previewCanvas, currentResult)
  }

  useEffect(() => {
      if (previewVisible) {
        drawPreView().then(() => console.log("draw preview success :", project.name))
      }
    }, [previewVisible]
  )

  useEffect(() => {
    init()
  }, [showRendered])

  return (
    <>
      <Modal
        title={
          <div className="m-bl-modal-title">
            <div className="m-bl-mt-word">云端数据</div>
            {
              batchLoadResults &&
              <Button type="primary"
                      size="small"
                      onClick={
                        async () => {
                          let results = batchLoadResults.filter(res => res.success)
                          for (let i in results) {
                            await render(results[i], parseInt(i) + 1)
                            await InputDataStore.setRendered(results[i].id)
                          }
                          await init()
                        }
                      }
              >
                <span style={{fontSize: "small"}}>下载全部</span>
              </Button>
            }
            {
              batchLoadResults &&
              <Select defaultValue={1} size={"small"} onChange={v => {
                setShowRendered(v === 2)
              }}>
                <Option value={1}>最新数据</Option>
                <Option value={2}>历史数据</Option>
              </Select>
            }
          </div>
        }
        visible={!previewVisible && !dataVisible}
        onCancel={close}
        onOk={close}
        width={800}
        footer={null}
      >
        {
          loading &&
          <div style={{width: '100%', textAlign: 'center', fontSize: 50}}>
            <LoadingOutlined/>
            <div style={{fontSize: 20}}>正在加载云端数据，请稍等</div>
          </div>
        }
        {
          batchLoadResults?.length >= 1 &&
          batchLoadResults.map(
            /**
             * @param index {number}
             * @param result {InputDataLoadResult}
             */
            (result, index) => (
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
                        setDataVisible(true)
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
            ))
        }
        {
          !(batchLoadResults?.length >= 1) &&
          <div className="m-main-hint">
            <Empty description=""/>
            暂无符合要求的云端数据
          </div>
        }
      </Modal>

      <Modal title='图片预览'
             width={EditorWidth * 0.8 + 100}
             visible={previewVisible}
             footer={null}
             onCancel={() => setPreviewVisible(false)}
      >
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
                  onClick={() => render(currentResult, null)}
          >
            导出图片
          </Button>
        </div>
      </Modal>

      <Modal title='数据展示'
             width={EditorWidth * 0.8 + 100}
             visible={dataVisible}
             footer={null}
             onCancel={() => setDataVisible(false)}
      >
        {
          dataVisible &&
          <div>
            <Button onClick={()=>setRewriteVisible(true)}>全部修改</Button>
            {/*//单个修改*/}
            {getDataDiv(currentResult, project)}
          </div>
        }
      </Modal>

      <Modal title='数据修改'
             width={EditorWidth * 0.8 + 100}
             visible={rewriteVisible}
             footer={null}
             onCancel={() => setRewriteVisible(false)}
      >
        {
          dataVisible &&
            <div>
              {//整体修改
              dataFormRewrite(currentResult, project)}
              <Button>保存数据</Button>
            </div>
        }
      </Modal>
    </>
  )
}

