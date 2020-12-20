/* 
    右侧头部组件
*/
import React, {Component} from 'react'
import { Modal, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { withRouter } from 'react-router-dom'

import './index.less'
import {reqWeather} from '../../api'
import memeoryUtils from '../../utils/memeoryUtils'
import storageUtils from '../../utils/storageUtils'
import menuConfig from '../../config/menuConfig'
import dateUtils from '../../utils/dateUtils'
import LinkButton from '../link-button/link-button'

const { confirm } = Modal

class Header extends Component{

    state = {
        currentTime:dateUtils(Date.now()),
        getWeather:false,
        weather:{
            country:'',
            city:'',
            name:'',
            text:''
        }
    }

    // 获取选中菜单的标题
    getTitle = menuConfig => {
        // 获取当前地址栏的路径
        const path = this.props.location.pathname
        let title
        // 与配置文件进行比对，获取对应的菜单title
        menuConfig.forEach(menuItem => {
            if(menuItem.path === path){
                title = menuItem.title
            } else if (menuItem.children) {
                const cItem = menuItem.children.find(cItem => path === cItem.path)
                if(cItem) {
                    title = cItem.title
                }
            }
        })
        return title
    }

    handleClick = () => {
        const user = memeoryUtils.user.username
        confirm({
            title: `用户:${user}是否退出登录?`,
            icon: <ExclamationCircleOutlined />,
            onOk:() => {
                // 删除localStorage与内存中的用户数据，重定向到登录界面
                storageUtils.remove()
                memeoryUtils.user = {}
                this.props.history.replace('/login')
                message.success('退出成功！')
            },
            onCancel() {
                message.info('用户取消了操作')
            }
        })
    }

    componentDidMount(){
        // 更新时间 启动定时器，每隔一秒获取一次时间，将时间转化成标准字符串
        this.interValId = setInterval(() => {
            this.setState({currentTime:dateUtils(Date.now())})
        }, 1000)
        // 获取天气情况
        const locationCode = "510703"
        reqWeather(locationCode).then(
            response => {
                const {country, city, name} = response.location
                const {text} = response.now
                this.setState({
                    getWeather:true,
                    weather:{country, city, name, text}
                })
            }
        )
    }

    componentWillUnmount() {
        clearInterval(this.interValId)
    }

    render (){
        const {country, city, name, text} = this.state.weather
        const {getWeather, currentTime} = this.state
        const username = memeoryUtils.user.username
        const title = this.getTitle(menuConfig)
        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎，{username}</span>
                    <LinkButton onClick={this.handleClick}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span className="time">{currentTime}</span>
                        {
                            getWeather ? <span className="weather">{country + city+ ' '+name +' ' + text}</span> : <span>天气加载中...</span>
                        }
                    </div>

                </div>
            </div>
        )
    }
}

export default withRouter(Header)
// export default Headers