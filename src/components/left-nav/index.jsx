/* 
左侧导航栏组件
*/
import React, { Component } from 'react'
import { Menu } from 'antd'
import { Link, withRouter } from 'react-router-dom'

import logo from '../../assets/images/logo.png'
import './index.less'
import menuConfig from '../../config/menuConfig'

const { SubMenu } = Menu

class LeftNav extends Component {
    constructor(props){
        super(props)
        this.menuNodes = this.generateMenuByReduce(menuConfig)
    }
    generateMenuByReduce = menuConfig => {
        return menuConfig.reduce((initVal, menuItem) => {
            if(!menuItem.children){
                initVal.push((
                    <Menu.Item key={menuItem.path} icon={menuItem.icon}>
                        <Link to={menuItem.path}>{menuItem.title}</Link> 
                    </Menu.Item>
                ))  
            } else {
                const path = this.props.location.pathname
                // menuItem.children是一个数组，查看这个数组中是否有对象的path值与当前的pathname相等
                if(menuItem.children.find(subItem => path.indexOf(subItem.path) === 0)){
                    this.openKey = menuItem.path
                }

                initVal.push((
                    <SubMenu key={menuItem.path} icon={menuItem.icon} title={menuItem.title}>
                        {this.generateMenuByReduce(menuItem.children)}
                    </SubMenu>
                ))
            }
            /* reduce的传入的回调函数需要将保存结果的变量返回，就是回调函数的第一个参数 */
            return initVal
        }, [])
    }
    generateMenuByMap = menuConfig => {
        // menuConfig是一个数组，调用map或者reduce对单个数组元素进行处理
        // 返回值是一个数组，元素是React组件，无需拆分，React可以直接渲染
        return menuConfig.map(menuItem => {
            if(!menuItem.children){
                return (
                    <Menu.Item key={menuItem.path} icon={menuItem.icon}>
                        <Link to={menuItem.path}>{menuItem.title}</Link> 
                    </Menu.Item>
                )
            } else {
                return (
                    <SubMenu key={menuItem.path} icon={menuItem.icon} title={menuItem.title}>
                        {this.generateMenuByConfig(menuItem.children)}
                    </SubMenu>
                )
            }
        })
    }
    render() {
        /* 获取地址栏的pathname和需要打开的子菜单key */
        let path = this.props.location.pathname
        if(path.indexOf('/product') === 0){
            path = '/product'
        }
        const openKey = this.openKey
        // console.log('leftBar',path)
        return (
            <div className="left-nav">
                <Link to="/home">
                    <div className="left-nav-header">
                        <img src={logo} alt="尚硅谷" />
                        <h1>商城后台</h1>
                    </div>
                </Link>
                
                <Menu
                    // 默认选中的菜单项
                    selectedKeys={[path]}
                    // 默认打开的子菜单
                    defaultOpenKeys={[openKey]}
                    mode="inline"
                    theme="dark"
                >
                {/* 根据菜单配置文件动态生成菜单 */}
                {
                    this.menuNodes
                }
                </Menu>
            </div>
        )
    }
}

/* 
    withRouter是一个高阶组件，将非路由组件包装成路由组件，这样就会给被包装的非路由组件传入
    history,location,match三个参数
*/
export default withRouter(LeftNav)