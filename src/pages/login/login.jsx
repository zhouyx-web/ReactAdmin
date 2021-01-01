// 登录界面的路由组件
import React, {Component} from 'react'
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'

import logo from '../../assets/images/logo.png'
import './login.less'
import { reqLogin } from '../../api'
import memeoryUtils from '../../utils/memeoryUtils'
import storageUtils from '../../utils/storageUtils'

export default class Login extends Component {

    static propTypes = {
        user:PropTypes.object.isRequired,
        userLogin:PropTypes.func.isRequired,
    }
    
    /* 
        antd中定义包含了From表单组件的组件为表单组件，这里的Login组件就是一个表单组件，需要对Login进行包装
        然后才会传入一个表单数据收集与验证的关键属性form，不进行包装则不会传入该属性。

        任务：前台表单验证
        1.表单验证
        2.数据收集
        3.提交
    */
    /* 
        antd表单的onFinish事件传入的参数不是event，而是表单项值的对象，不同于antd3,onFinish会在校验成功之后触发执行
        所以不用像antd3的onSubmit事件一样，在提交时需要再次进行校验，校验成功才可以发送请求，这一步非常重要。

        1.输入时校验是为了提示用户输错了
        2.提交时校验是为了向服务器提交正确的数据，如果不进行提交校验，可能会提交错误的数据到服务器
        3.onFinish事件为我们省去了提交时检验这一步骤，定义校验成功才会触发onFinish
    */
    handleFinish = async (values) =>{ 
        /* 
            优化：
            1.使用async,await来取代promise的then与catch的使用
        */
        const {username, password} = values
        this.props.userLogin(username, password)
        // 登录请求
        /* reqLogin(username, password).then(
            // 请求成功，读取数据
            response => {
                console.log(response.data)
                if(response.data.status === 0){
                    message.success('登录成功！')
                } else {
                    message.error(response.data.msg)
                }
                
            }
        ) */
        /* const result = await reqLogin(username, password)
        if(result.status === 0){
            message.success('登录成功！')
            // 将用户保存到内存，loaclstorage
            memeoryUtils.user = result.data
            storageUtils.setUser(result.data)
            // 重定向到管理界面
            this.props.history.replace('/')        
        } else {
            message.error(result.msg)
        } */
        // 不用处理请求失败，因为封装axios的时候已经处理了。即使添加失败的回调也不会触发 
    }

    /* 
        自定义验证规则，用于两个输入框共同使用，antd4版本的validator需要返回Promise对象，失败的Promise对象
        失败的信息会被当做错误信息提示输出到界面
    */
    validator = (rule, value) => {
        // 传入的参数分别是：验证规则、输入框的值、默认传入回调函数
        const length = value && value.length
        const pwdReg = /^[a-zA-Z0-9_]+$/
        // 开始对value值进行检验
        if(!value){
            return Promise.reject("密码不能为空！")
        }else if(length < 4){
            return Promise.reject("密码长度不足4位！")
        }else if(length > 12){
            return Promise.reject("密码长度超过12位！")
        }else if(!pwdReg.test(value)){
            return Promise.reject("只能由字母、数字、下划线组成！")
        }else{
            return Promise.resolve()
        }
    }
    render() {
        /* 检查是否存在用户登录，若存在，重定向到管理路由界面 / */
        const user = this.props.user
        // 如果内存中存在用户，重定向到管理界面
        if(user && user._id){
            return <Redirect to="/"></Redirect>
        }
        return (
            <div className='login'>
                <div className='login-header'>
                    {/* Jsx中不能直接写图片的路径，需要将图片引入 */}
                    <img src={logo} alt="尚硅谷"/>
                    <h1>React项目:后台管理系统</h1>
                </div>
                <div className='login-content'>
                    <h2>用户登录</h2>
                    <Form className="login-form" onFinish={this.handleFinish}>
                        <Form.Item
                            name="username"
                            initialValue="admin"
                            validateFirst="true"
                            // 声明式验证
                            rules={[
                                {
                                    required: true,
                                    message: '用户名不能为空 !',
                                },
                                {
                                    min: 4,
                                    message: '用户名最小长度为4 !'
                                },
                                {
                                    max: 12,
                                    message: '用户名最大长度为12 !'
                                },
                                {
                                    pattern: /^[a-zA-Z0-9_]+$/,
                                    message: '只能由字母、数字、下划线组成 !'
                                }
                            ]}>
                            {/* prefix是在输入框之前添加一个图标,UserOutlined就是一个图标组件*/}
                            <Input 
                                prefix={<UserOutlined className="site-form-item-icon" />} 
                                placeholder="用户名" 
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            validateFirst="true"
                            rules={[
                                {
                                    validator:this.validator
                                },
                            ]}    
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="密码"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                className="login-form-button">登录                               
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        )
    }
}
