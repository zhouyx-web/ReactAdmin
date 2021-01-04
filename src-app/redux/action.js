/* 
    actionCreators 产生action函数的模块
    同步action返回一个对象
    异步action返回一个函数，函数的参数是store对象的dispatch函数
*/

import { message } from 'antd'

import { SET_HEADER_TITLE, USER_LOGIN, USER_LOGOUT } from './action-types'
import { reqLogin } from '../api'
import storageUtils from '../utils/storageUtils'

// 同步产生修改标题的action
export const setHeaderTitle = title => ({ type: SET_HEADER_TITLE, title })
// 同步产生用户登录成功的action
export const loginSuccess = user => ({ type: USER_LOGIN, user })
// 同步产生用户登出的action
export const logout = () => ({type:USER_LOGOUT})

// 异步产生登录请求的action
export const userLogin = (username, password) => {
    return async dispatch => {
        // 发送用户登录请求
        const result = await reqLogin(username, password)
        // 登录成功，同步产生一个用户登录的action
        if(result.status === 0){
            const user = result.data
            dispatch(loginSuccess(user))
            // 将用户保存到localstorage
            storageUtils.setUser(user)
            message.success('登录成功')
        } else {
            // 登录失败，给出用户提示
            message.error(result.msg)
        }
    }
}