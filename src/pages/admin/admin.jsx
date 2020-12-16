// 管理界面的路由组件

import React, {Component} from 'react'
import { Redirect } from 'react-router-dom'

import memeoryUtils from '../../utils/memeoryUtils'
// import storageUtils from '../../utils/storageUtils'

export default class Admin extends Component {
    render() {
        // 取出用户
        // 在这里使用原生语法读取localStorage会有跨域问题
        // const user = storageUtils.getUser()
        const user = memeoryUtils.user
        // 如果内存中不存在用户，重定向到登录界面
        if(!user || !user._id){
            return <Redirect to="/login"></Redirect>
        }
        // 如果存在用户,输出问候语
        return (
            <div>{`Hello ${user.username}`}</div>
        )
    }
}