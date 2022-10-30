import {Button, Empty, message, Modal, Select} from "antd";
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

const pageSize = 7;

export const CloudData = (props) => {

  const {project, close} = props

  const [loadResultList, setLoadResultList] = useState(null)

  const [loading, setLoading] = useState(false)

  const [previewVisible, setPreviewVisible] = useState(false)

  const [cloudDataFormVisible, setCloudDataFormVisible] = useState(false)

  const [currentResult, setCurrentResult] = useState(null)

  const [showRendered, setShowRendered] = useState(false)

  const [currentPage, setCurrentPage] = useState(0)

  const [total, setTotal] = useState(0)


  const getNumberList = () => {
    let dom = []
    let size = Math.ceil(total / pageSize);
    for (let i = 0; i < size; i++) {
      dom.push(<Button key={i} style={{margin: "0 5px"}} type={currentPage === i ? 'primary' : "default"} size="small"
                       onClick={() => setCurrentPage(i)}>{i + 1}</Button>)
    }
    return <div style={{display: "flex"}}>
      <span style={{userSelect: 'none'}}>第</span>
        {dom}
      <span style={{userSelect: 'none'}}>页</span>
    </div>
  }


  const reloadResults = async () => {
    console.log("cloud data init")
    setLoading(true)
    // let results = await InputDataStore.getAllByProject(project.id, showRendered)
    let page = await InputDataStore.getPage(project.id, showRendered, currentPage * pageSize, pageSize)
    let results = page.data
    let total = page.total
    setTotal(total)
    setLoadResultList(results)
    setLoading(false)
  }

  const removeResult = async (res) => {
    let deleted = await InputDataStore.remove(res.id)
    if (deleted) {
      message.success("删除成功")
      await reloadResults()
    } else {
      message.error("删除失败，请检查")
    }
  }

  const render = async (result, id) => {
    let blImageRenderer = new ImageRenderer()
    blImageRenderer.load(project)
    await blImageRenderer.download(result, id,project)
    await InputDataStore.setRendered(result.id)
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
    reloadResults()
  }, [showRendered, currentPage])

  return (
    <>
      <Modal
        title={
          <div className="m-bl-modal-title">
            <div className="m-bl-mt-word">云端数据</div>
            {
              loadResultList &&
              <CloudDataAllDownload batchLoadResults={loadResultList} render={render} reload={reloadResults}/>
            }
            {
              loadResultList &&
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
          <div style={{width: '100%', textAlign: 'center', fontSize: 50, position: "absolute"}}>
            <LoadingOutlined/>
            <div style={{fontSize: 20}}>正在加载云端数据，请稍等</div>
          </div>
        }
        {
          loadResultList?.length >= 1 &&
          <>
            {loadResultList.map(
              (result, index) => (
                <CloudDataInLine result={result} index={index} project={project}
                                 setCurrentResult={setCurrentResult}
                                 setPreviewVisible={setPreviewVisible}
                                 setCloudDataFormVisible={setCloudDataFormVisible}
                                 render={render}
                                 removeResult={removeResult}
                                 reload={() => reloadResults()}
                                 key={index}
                />
              ))}
            {getNumberList()}
          </>
        }
        {
          !(loadResultList?.length >= 1) &&
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
        <Preview render={render} currentResult={currentResult} onSuccess={() => reloadResults()}/>
      </Modal>
      {cloudDataFormVisible && <CloudDataForm currentResult={currentResult} project={project}
                                              close={() => setCloudDataFormVisible(false)}
                                              onSuccess={() => {
                                                setCloudDataFormVisible(false)
                                                reloadResults()
                                              }}
      />}
    </>
  )
}

