// 封装axios函数，便于外部调用
import axios from 'axios'
import {message} from 'antd'

/* 
    传入请求地址，请求数据，请求方法

    优化：
    1.统一处理失败请求
    2.请求成功，将响应的数据response.data传递下去，而不是传递response，外部就可以直接获取
    响应数据，不用再读取一次
*/
export default function ajax (url, data={}, method='GET'){
    return new Promise(resolve => {
        let promise
        // 发送请求
        // const loading = message.loading("登录中...")
        if(method === 'GET'){
            promise = axios.get(url, { params: data })
        } else {
            promise = axios.post(url, data)
        }

        // 请求成功，就把请求成功的数据体data响应传递下去
        promise.then(response => {
            // message.destroy(loading)
            resolve(response.data)
        })
        // 请求失败，提前处理失败请求的处理，就不用在调用时处理，减少重复代码
        .catch(error => {
            // message.destroy(loading)
            message.error(error.message)
        })
        
    })
}