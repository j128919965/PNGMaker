import {Button, message, Modal, Collapse} from "antd";
import {CheckOutlined, ExclamationOutlined, LoadingOutlined} from "@ant-design/icons";
import {EditorHeight, EditorWidth} from "../../data/constants";
import ImageRenderer from "../ImageRenderer/ImageRenderer";
import {useEffect, useState} from "react";
import InputDataStore from "../../data/InputDataStore";
import {click} from "@testing-library/user-event/dist/click";

export const CloudData = (props) => {
  const {project, close} = props

  const [batchLoadResults, setBatchLoadResults] = useState(null)

  const [loading, setLoading] = useState(false)

  const [previewVisible, setPreviewVisible] = useState(false)

  const [currentResult, setCurrentResult] = useState(null)

  const {Panel} = Collapse

  const init = async () => {
    setLoading(true)
    let results = await InputDataStore.getNotRenderedByProject(project.id)
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
  }, [])

  const creatBtn = (result, title) => {

    return (
        <Button size={"small"} onClick={(event) => {
          setCurrentResult(result)
          setPreviewVisible(true)
          event.stopPropagation()
        }}>
          <span style={{fontSize: "small"}}>{title}</span>
        </Button>
    )
  }

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
          </div>
        }
        visible={!previewVisible}
        onCancel={close}
        onOk={close}
        width={800}
        footer={null}
      >
        <Collapse>
          {
            loading &&
            <div style={{width: '100%', textAlign: 'center', fontSize: 50}}>
              <LoadingOutlined/>
              <div style={{fontSize: 20}}>正在解析文件，请稍等</div>
            </div>
          }
          {batchLoadResults &&
          batchLoadResults.map(
            /**
             * @param index {number}
             * @param result {InputDataLoadResult}
             */
            (result, index) => (
              <Panel header={"this is panel header" + (index+1)} key={index} extra={creatBtn(result, "查看预览")}>
                <div className="m-bl-line" key={index}>
                  <div className={`m-bl-line-icon ${result.success ? 'u-success' : 'u-warning'}`}>
                    {result.success ? <CheckOutlined/> : <ExclamationOutlined/>}
                  </div>
                  <div className="m-bl-line-word">
                    第 {index + 1} 行 {result.success ? '解析成功' : '解析错误：' + result.message}
                  </div>
                  <div className="m-bl-line-btns">
                    {
                      result.success &&
                      <>
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
              </Panel>
            ))
          }
        </Collapse>
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
    </>
  )
}