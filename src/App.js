// react根组件App
import React, {Component} from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'

import Login from './pages/login/login'
import Admin from './pages/admin/admin'
/* 
    分为两种路由器
    BrowserRouter url上不会带#号
        http://localhost:3000/
        http://localhost:3000/login
    HashRouter url后会带#号
        http://localhost:3000/#/
        http://localhost:3000/#/login

    Route path路径的第一个/是必须的，否则不会生效
    若输入的是错误的路由路径，则显示的是默认的路由组件。
        http://localhost:3000/login1
        http://localhost:3000/#/login2
        这两个都是显示的默认的Admin组件
*/

export default class App extends Component {
    
    render(){
        return (
            <BrowserRouter>
                <Switch>
                    <Route path='/' component={Login}></Route>
                    {/* 不使用重定向路由组件就能直接定位到下面这个组件，因为这个路由路径是空的 */}
                    <Route path='/admin' component={Admin}></Route>
                    {/* <Redirect to='/login'></Redirect> */}
                </Switch>
            </BrowserRouter>
        )
    }
}