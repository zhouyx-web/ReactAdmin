// 管理界面的路由组件

import React, { Component } from 'react'
import { Redirect,Route, Switch } from 'react-router-dom'
import { Layout } from 'antd'

import memeoryUtils from '../../utils/memeoryUtils'
import LeftNav from '../../components/left-nav'
import Header from '../../components/header'
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import User from '../user/user'
import Role from '../role/role'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'
// import storageUtils from '../../utils/storageUtils'

const { Footer, Sider, Content } = Layout

export default class Admin extends Component {
    render() {
        // 取出用户
        // 在这里使用原生语法读取localStorage会有跨域问题
        // const user = storageUtils.getUser()
        const user = memeoryUtils.user
        // 如果内存中不存在用户，重定向到登录界面
        if (!user || !user._id) {
            return <Redirect to="/login"></Redirect>
        }
        // 如果存在用户,输出问候语
        return (
            <div style={{height:"100%"}}>
                <Layout style={{height:"100%"}}>
                    <Sider>
                        <LeftNav></LeftNav>
                    </Sider>
                    <Layout>
                        <Header>Header</Header>
                        <Content style={{margin: "20px", backgroundColor:"#fff"}}>
                            <Switch>
                                <Route path={'/home'} component={Home}></Route>
                                <Route path={'/category'} component={Category}></Route>
                                <Route path={'/product'} component={Product}></Route>
                                <Route path={'/user'} component={User}></Route>
                                <Route path={'/role'} component={Role}></Route>
                                <Route path={'/charts/bar'} component={Bar}></Route>
                                <Route path={'/charts/line'} component={Line}></Route>
                                <Route path={'/charts/pie'} component={Pie}></Route>
                                <Redirect to="/home"></Redirect>
                            </Switch>
                        </Content>
                        <Footer>Footer</Footer>
                    </Layout>
                </Layout>
            </div>
        )
    }
}