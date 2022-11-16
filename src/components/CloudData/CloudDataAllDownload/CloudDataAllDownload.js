import {Button} from "antd";
import InputDataStore from "../../../data/InputDataStore";
import React from "react";

export const CloudDataAllDownload = (props) => {

  const {batchLoadResults, render, reload} = props

  return (
    <Button type="primary"
            size="small"
            onClick={
              async () => {
                let results = batchLoadResults.filter(res => res.success)
                for (let i in results) {
                  await render(results[i], parseInt(i) + 1)
                  await InputDataStore.setRendered(results[i].id)
                }
                await reload()
              }
            }
    >
      <span style={{fontSize: "small"}}>导出本页全部</span>
    </Button>)
}
