/* 
左侧导航栏组件
*/
import React, { Component } from 'react'
import { Menu } from 'antd'
import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

import logo from '../../assets/images/logo.png'
import './index.less'
import menuConfig from '../../config/menuConfig'
import memeoryUtils from '../../utils/memeoryUtils'

const { SubMenu } = Menu

class LeftNav extends Component {

    static propTypes = {
        // 用于更改redux状态的函数
        setHeaderTitle:PropTypes.func.isRequired
    }

    constructor(props) {
        super(props)
        this.menuNodes = this.generateMenuByReduce(menuConfig)
    }

    // 判断是否应该渲染当前菜单项item
    shouldRender = item => {
        // 取出当前登录的用户的用户名及权限列表
        const {username} = memeoryUtils.user
        const permissionList = memeoryUtils.user.role.menus
        // 取出当前item对应的路由路径，路由路径对应着权限列表的值
        const permission = item.path
        // console.log('shouldRender()', permissionList, permission, username)
        /* 
            1.当用户名为admin时，直接返回true
            2.所有用户都至少都能看到首页的权限，不论权限列表中是否包含首页
            3.如果当前路径存在于permissionList，返回true
            4.如果存在子菜单，需要将子菜单中的路径与权限列表进行比对，如果存在就返回true
        */
        if(username === 'admin' || item.isPublic || permissionList.indexOf(permission) !== -1){
            return true
        } else if (item.children) {
            return !! item.children.find(cMenu => permissionList.indexOf(cMenu.path) !== -1)
        }

        return false
    }

    generateMenuByReduce = menuConfig => {
        return menuConfig.reduce((initVal, menuItem) => {
            // 判断当前菜单项或者子菜单是否存在于当前用户的权限列表
            if (this.shouldRender(menuItem)) {
                if (!menuItem.children) {
                    initVal.push((
                        <Menu.Item key={menuItem.path} icon={menuItem.icon}>
                            <Link to={menuItem.path} onClick={() => this.props.setHeaderTitle(menuItem.title)}>{menuItem.title}</Link>
                        </Menu.Item>
                    ))
                } else {
                    const path = this.props.location.pathname
                    // menuItem.children是一个数组，查看这个数组中是否有对象的path值与当前的pathname相等
                    if (menuItem.children.find(subItem => path.indexOf(subItem.path) === 0)) {
                        this.openKey = menuItem.path
                    }

                    initVal.push((
                        <SubMenu key={menuItem.path} icon={menuItem.icon} title={menuItem.title}>
                            {this.generateMenuByReduce(menuItem.children)}
                        </SubMenu>
                    ))
                }
            }

            /* reduce的传入的回调函数需要将保存结果的变量返回，就是回调函数的第一个参数 */
            return initVal
        }, [])
    }
    generateMenuByMap = menuConfig => {
        // menuConfig是一个数组，调用map或者reduce对单个数组元素进行处理
        // 返回值是一个数组，元素是React组件，无需拆分，React可以直接渲染
        return menuConfig.map(menuItem => {
            if (!menuItem.children) {
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
        if (path.indexOf('/product') === 0) {
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