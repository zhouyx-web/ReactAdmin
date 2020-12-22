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

// 请求商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax('/manage/product/list', {pageNum, pageSize})
// 根据名称/描述搜索商品列表
export const reqProductsByKey = (pageNum, pageSize, searchKey, keyType) => ajax('/manage/product/search',{pageNum, pageSize, [keyType]:searchKey})
// 根据分类id获取分类名
export const reqCategoryName = categoryId => ajax('/manage/category/info', {categoryId})
// 修改商品的状态
export const reqChangeProductStatus = (productId, status) => ajax('/manage/product/updateStatus', {productId, status}, 'POST')
// 删除图片
export const reqDeletePic = name => ajax('/manage/img/delete', {name} , 'POST')