/* 
    包装接口，便于外部调用
*/
import {message} from 'antd'

import ajax from './ajax'

// 登录请求
export const reqLogin = (username, password) => ajax('/login', {username, password}, 'POST')
// 添加用户
export const reqAdduser = data => ajax('/manage/user/add', data, 'POST')
// 查询天气
export const reqWeather = id => {
    const params = {
            "district_id": id,
            "ak": "mLgcl1vaoEqLfpBjpgtknRrqG0iGClCf",
            "output": "json",
            "data_type": "now"
        }
    return ajax("/weather/v1/", params).then(response => response.result)
}