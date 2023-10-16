import {message} from "antd";

/**
 *
 * @param content string
 * @param fn {()=>Promise<T>}
 * @returns {Promise<T>}
 */
const load = async (content, fn) => {
  message.loading({
    content: content,
    duration: 0,
    key: "loading_key"
  })
  let result = await fn();
  message.destroy("loading_key")
  return result
}

export default {
  load
}