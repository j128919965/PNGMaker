import axios from "axios";

export const get = async function (url, data = {},ignoreLogin = false) {
    return new Promise((resolve, reject) => {
            axios.get(url, {params: data})
                .then(resp =>{
                    resolve(resp.data)
                })
                .catch(e =>{
                    console.error(e)
                    resolve({success:false,message:"网络错误"})
                })
        }
    )
}


export const post = async function (url, data = {},ignoreLogin = false) {
    return new Promise((resolve, reject) => {
            axios.post(url, data)
                .then(resp =>{
                    resolve(resp.data)
                })
                .catch(e =>{
                    console.error(e)
                    resolve({success:false,message:"网络错误"})
                })
        }
    )
}


export const put = async function (url, data = {},ignoreLogin = false) {
    return new Promise((resolve, reject) => {
            axios.put(url, data)
                .then(resp =>{
                    resolve(resp.data)
                })
                .catch(e =>{
                    console.error(e)
                    resolve({success:false,message:"网络错误"})
                })
        }
    )
}

export const del = async function (url, data = {},ignoreLogin = false) {
    return new Promise((resolve, reject) => {
            axios.delete(url, {params: data})
                .then(resp =>{
                    resolve(resp.data)
                })
                .catch(e =>{
                    console.error(e)
                    resolve({success:false,message:"网络错误"})
                })
        }
    )
}
