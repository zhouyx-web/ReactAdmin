/*
redux最核心的管理对象: store
 */
import {createStore} from '../lib/redux/redux'
// import {composeWithDevTools} from 'redux-devtools-extension'

import reducer from './reducer'
// 创建store对象内部会第一次调用reducer()得到初始状态值
export default createStore(reducer) 