/**
 * 本系统后端使用的通用响应数据结构
 */
import axios from "axios";

class WebResponse {
    /**
     * code
     * @type {number}
     */
    c
    /**
     * success
     * @type {boolean}
     */
    s
    /**
     * data
     * @type {Object}
     */
    d
    /**
     * message
     * @type {string}
     */
    m
}

const defaultFailWebResponse = new WebResponse();
defaultFailWebResponse.c = -1;
defaultFailWebResponse.s = false;
defaultFailWebResponse.m = '网络错误'

/**
 *
 * 将请求封装为promise
 *
 * @param url {string}
 * @param data {object}
 * @param header {{string:string}}
 * @param method {"OPTIONS" | "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "TRACE" | "CONNECT"}
 * @returns {Promise<WebResponse>}
 */
const doRequest = (url, data, method, header) => {
    return new Promise(resolve => {
        axios({
            method: method,
            url: url,
            data: data,
            headers: header
        }).then(resp => {
            resolve(resp.data)
        }).catch(e => {
            console.error(e)
            resolve(defaultFailWebResponse)
        })
    })
}

/**
 * 纯粹的get请求
 * @param url
 * @param data
 * @param header
 * @returns {Promise<WebResponse>}
 */
const doGet = (url, data, header) => doRequest(url, data, "GET", header)

/**
 * 纯粹的post请求
 * @param url
 * @param data
 * @param header
 * @returns {Promise<WebResponse>}
 */
const doPost = (url, data, header) => doRequest(url, data, "POST", {
    ...header,
    'content-type': 'application/json'
})

/**
 * 纯粹的put请求
 * @param url
 * @param data
 * @param header
 * @returns {Promise<WebResponse>}
 */
const doPut = (url, data, header) => doRequest(url, data, "PUT", {
    ...header,
    'content-type': 'application/json'
})

/**
 * 纯粹的delete请求
 * @param url
 * @param data
 * @param header
 * @returns {Promise<WebResponse>}
 */
const doDelete = (url, data, header) => doRequest(url, data, "DELETE", {
    ...header,
    'content-type': 'application/json'
})

/**
 *
 * @param action {()=>Promise<WebResponse>}
 * @returns {Promise<WebResponse>}
 */
const checkAndGetResp = async (action) => {
    let firstResp = await action()

    if (firstResp?.s) {
        return firstResp
    }
    if (!isAuthError(firstResp)) {
        return firstResp
    }

    localStorage.removeItem("accessToken")
    return firstResp
}

/*
一对过期的token：
"tokenObject": {
    "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjb3VudCI6MCwiaWQiOjEsImV4cCI6MTY2MTU4ODUzNn0.Foqb01tU5nhPOAvWp3tRLVhQ79k6P8KkvBlAmI6SibA",
    "refreshToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjb3VudCI6MCwiaWQiOjEsImV4cCI6MTY2MTU5MjEzNn0.0nM2JypMPcPmXXytTjHdoob4hfEp6_timNMf9Jo63Ls"
}
 */

const getAccessTokenHeaders = () => {
    return {
        "x-que-token": localStorage.getItem("accessToken")
    }
}

/**
 *
 * @param resp {WebResponse}
 * @returns {boolean} 401xxx 是后端定义的有关权限错误的错误码集合
 */
const isAuthError = (resp) => resp?.c > 401000 && resp?.c < 402000

const getRefreshAble = (url, data) => checkAndGetResp(() => doGet(url, data, getAccessTokenHeaders()))
const postRefreshAble = (url, data) => checkAndGetResp(() => doPost(url, data, getAccessTokenHeaders()))
const putRefreshAble = (url, data) => checkAndGetResp(() => doPut(url, data, getAccessTokenHeaders()))
const delRefreshAble = (url, data) => checkAndGetResp(() => doDelete(url, data, getAccessTokenHeaders()))

export default {
    get: getRefreshAble, post: postRefreshAble, put: putRefreshAble, del: delRefreshAble
}
