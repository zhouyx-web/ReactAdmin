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
// 添加/修改商品
export const reqAddOrUpdateProduct = product => ajax(`/manage/product/${product._id ? 'update' : 'add'}`, product,'POST')
// 获取角色列表
export const reqRoleList = () => ajax('/manage/role/list')
// 添加角色
export const reqAddRole = roleName => ajax('/manage/role/add', {roleName}, 'POST')
// 更新角色
export const reqUpdateRole = roleInfo => ajax('/manage/role/update', roleInfo, 'POST')
// 获取用户列表
export const reqUsers = () => ajax('/manage/user/list')
// 更新用户
export const reqUpdateUser = user => ajax('/manage/user/update', user, 'POST')
// 删除用户
export const reqDeleteUser = userId => ajax('/manage/user/delete', {userId}, 'POST')