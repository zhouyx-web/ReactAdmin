/* 
自定义redux库
redux库主要向外暴露3个函数
    1.createStore(),接受reducer函数作为参数，返回一个store对象
    2.combineReducers(),接受一个对象，对象属性为reducer函数名，返回一个总的reducer函数
    3.applyMiddleware(),接受中间件对象作为参数,可以为多个，暂不实现
store对象主要使用3个方法
    1.getState() 获取store对象中维护的state
    2.dispatch(actionCreator) 分发action对象，触发reducer,修改state
    3.subscribe(callback[,fn...]) 添加订阅，state改变就会触发callback执行，
*/

// 1.createStore(),接受reducer函数作为参数，返回一个store对象
export const createStore = reducer => {

    // 初始化state
    let state = reducer(undefined, '@@mini-redux-init~')
    // 绑定的回调函数队列
    const callbacks = []

    // 1.getState() 获取store对象中维护的state
    function getState () {
        return state
    }

    // 2.dispatch(action) 分发action对象，触发reducer,修改state
    function dispatch (action) {
        let newState
        // action是函数
        if(action instanceof Function){
            newState = reducer(state, action())
        } else {
            newState = reducer(state, action)
        }
        state = newState
        callbacks.forEach(callback => callback())
    }

    // 3.subscribe(callback[,fn...]) 添加订阅
    function subscribe (callback) {
        callbacks.push(callback)
    }

    return({
        getState,
        dispatch,
        subscribe,
    })
}

// 2.combineReducers(),接受一个对象，对象属性为reducer函数名，返回一个总的reducer函数
export const combineReducers = reducers => {
    return (state, action) => {
        // 取出所有的reducer函数，一次调用产生state,合并成新的state
        let newState = Object.keys(reducers).reduce((totalState, key) => {
            totalState[key] = reducers[key](state, action)
            return totalState
        }, {})
        return newState
    }
} 

// 3.applyMiddleware(),接受中间件对象作为参数,可以为多个，暂不实现