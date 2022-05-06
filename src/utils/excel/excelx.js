import {InputData, InputDataLoadResult} from "../../data/InputData";

import files from "../files";

const Exceljs = require("exceljs")

const Workbook = new Exceljs.Workbook();

/**
 * 打开并解析excel文件
 * @param project {ProjectMetadata}
 * @param onSubmitOpen {function} 当确定打开文件时调用
 * @return {Promise<InputDataLoadResult[]>}
 */
const openFile = (project , onSubmitOpen) => {
  const fileInput = document.getElementById("xlxs-reader")
  /**
   * @type {HTMLFormElement}
   */
  const fileInputForm = document.getElementById("xlxs-reader-form")
  fileInputForm.reset()

  return new Promise(resolve => {
    fileInput.onchange = () => {
      if (onSubmitOpen){
        onSubmitOpen()
      }
      let file = fileInput.files[0]
      let reader = new FileReader();
      reader.onload = async (e) => {
        let workbook = await Workbook.xlsx.load(e.target.result);
        resolve(onGetWorkBook(workbook, project))
      };
      reader.readAsArrayBuffer(file);
    }
    fileInput.click()
  })

}

/**
 *
 * @param workbook {Workbook}
 * @param project {ProjectMetadata}
 */
const onGetWorkBook = async (workbook, project) => {
  let worksheet = workbook.worksheets[0];
  const imageMap = {}
  worksheet.getImages().forEach(img => putImage(imageMap, img))

  /**
   *
   * @type {InputDataLoadResult[]}
   */
  const ret = []

  for (let rowNumber = 1; rowNumber <= worksheet.rowCount; rowNumber++) {
    let data = []
    let row = worksheet.getRow(rowNumber);
    try {
      for (let i = 0; i < project.points.length; i++) {
        let point = project.points[i]
        if (project.points[i].type === 1) {
          let cell = row.getCell(i + 1)
          if (cell.type === Exceljs.ValueType.String) {
            data.push(new InputData(point.id, cell.value))
          } else {
            throw new Error(`第${rowNumber}行 第${i + 1}列 输入类型不是字符串，或输入为空！！`)
          }
        } else {
          if (imageMap[rowNumber][i + 1]) {
            data.push(new InputData(point.id, await getImageData(workbook,imageMap[rowNumber][i + 1])))
          } else {
            throw new Error(`第${rowNumber}行 第${i + 1}列 图片不存在！` )
          }
        }
      }
      ret.push(InputDataLoadResult.success(data))
    } catch (e) {
      ret.push(InputDataLoadResult.failure(e.message))
    }
  }

  return ret
}

/**
 *
 * @param workBook {Workbook}
 * @param image
 * @returns {Promise<String>}
 */
const getImageData = async (workBook , image) => {
  let img = workBook.getImage(image.imageId);
  let file = new File([img.buffer],img.name + img.extension, {type: 'image/jpeg', lastModified: Date.now()})
  let resp = await files.uploadImage(file)
  return resp.url
}

const putImage = (map, img) => {
  let r = img.range.tl.nativeRow + 1
  let c = img.range.tl.nativeCol + 1
  if (!map[r]) {
    map[r] = {}
  }
  map[r][c] = img
}

const excelx = {
  openFile
}

export default excelx
