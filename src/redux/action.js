/* 
    actionCreators 产生action函数的模块
*/



import {SET_HEADER_TITLE} from './action-types'
// 同步产生修改标题的action
export const setHeaderTitle = title => ({type:SET_HEADER_TITLE, title})