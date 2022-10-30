import {Empty, message, Modal, Select} from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import {EditorWidth} from "../../data/constants";
import ImageRenderer from "../ImageRenderer/ImageRenderer";
import React, {useEffect, useState} from "react";
import InputDataStore from "../../data/InputDataStore";

import './index.css'
import {CloudDataForm} from "./CloudDataForm/CloudDataForm";
import {CloudDataAllDownload} from "./CloudDataAllDownload/CloudDataAllDownload";
import {CloudDataInLine} from "./CloudDataInLine/CloudDataInLine";
import {Preview} from "./CloudDataPreview/Preview";

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


export const CloudData = (props) => {

  const {project, close} = props

  const [batchLoadResults, setBatchLoadResults] = useState(null)

  const [loading, setLoading] = useState(false)

  const [previewVisible, setPreviewVisible] = useState(false)

  const [cloudDataFormVisible, setCloudDataFormVisible] = useState(false)

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
  }, [previewVisible])

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
              <CloudDataAllDownload batchLoadResults={batchLoadResults} render={render} init={init}/>
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
        visible={!previewVisible && !cloudDataFormVisible}
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
              <CloudDataInLine result={result} index={index} project={project}
                               setCurrentResult={setCurrentResult}
                               setPreviewVisible={setPreviewVisible}
                               cloudDataFormVisible={cloudDataFormVisible}
                               previewVisible={previewVisible}
                               setCloudDataFormVisible={setCloudDataFormVisible}
                               getDataLine={getDataLine}
                               render={render}
                               removeResult={removeResult}/>
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
        <Preview render={render} currentResult={currentResult}/>
      </Modal>
      {cloudDataFormVisible && <CloudDataForm currentResult={currentResult} project={project}
                                              close={() => setCloudDataFormVisible(false)}/>}
    </>
  )
}

