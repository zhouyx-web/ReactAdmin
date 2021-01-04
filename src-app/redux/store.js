// 引入redux进行状态管理
import {createStore, applyMiddleware} from 'redux'
// 引入thunk中间件进行异步更改状态，redux不支持异步更新state
import thunk from 'redux-thunk'
// 引入使用redux谷歌插件的依赖
import {composeWithDevTools} from 'redux-devtools-extension'

// 引入reducer函数，进行状态初始化
import reducer from './reducer'

export default createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))
// export default createStore(reducer, applyMiddleware(thunk))