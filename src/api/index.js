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
            "data_type": "now",
            // "time":Date.now()
        }
    return ajax("/weather/v1/", params).then(response => response.result)
}

// 查询商品分类列表
export const reqCategorys = parentId => ajax('/manage/category/list', {parentId})
// 添加商品分类
export const reqAddCategory = (parentId, categoryName) => ajax('/manage/category/add', {parentId, categoryName}, 'POST')
// 更新商品分类
export const reqUpdateCategory = ({categoryId, categoryName}) => ajax('/manage/category/update', {categoryId, categoryName}, 'POST')