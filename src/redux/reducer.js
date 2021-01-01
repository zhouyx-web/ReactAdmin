// 引入combineReducers函数合并reducer
import {combineReducers} from 'redux'

// 引入读取localStorage信息管理模块
import storageUtils from '../utils/storageUtils'
import {SET_HEADER_TITLE, USER_LOGIN} from './action-types'


// 管理user的reducer函数
const initUser = storageUtils.getUser()
function user (state = initUser, action) {
    switch(action.type){
        case USER_LOGIN:
            return action.user
        default:
            return state
    }
}


// 管理headerTitle的reducer函数
const initHeaderTitle = '首页'
function headerTitle (state = initHeaderTitle, action) {
    switch(action.type){
        case SET_HEADER_TITLE:
            return action.title
        default:
            return state
    }
}



/* 
    combineReducers函数接受一个对象，对象属性是多个管理state的reducer函数
    返回值是一个整合所有reducer的函数，这个总的reducer函数管理一个总的状态state
    state = {
        headerTitle,
        user
    }
    状态的属性名就是传入的reducer函数名，值就是各自reducer管理的state属性名
*/
export default combineReducers({
    user,
    headerTitle,
})