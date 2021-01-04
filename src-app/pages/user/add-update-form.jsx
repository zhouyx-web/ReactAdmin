import React, { Component } from 'react'
import {
    Form,
    Select,
    Input,
} from 'antd'
import PropTypes from 'prop-types'


const { Option } = Select

export default class AddUpdateForm extends Component {

    static propTypes = {
        // 是否是更新用户
        isUpdateUser:PropTypes.bool.isRequired,
        // 当前点击的用户对象，用于初始化显示
        user:PropTypes.object,
        // 角色列表
        roles:PropTypes.array
    }

    formRef = React.createRef()

    getFormObj = () => this.formRef.current

    componentDidUpdate() {
        const {resetFields} = this.formRef.current
        resetFields()
        // console.log('componentDidUpdate()', this.formRef.current)
    }
    /* componentDidMount(){
        console.log('componentDidMount()', this.formRef.current)
    } */
    
    render() {
        // console.log('render()') // 每点击一次添加用户按钮，render函数都会执行一次
        const layout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 16 },
        }
        const {isUpdateUser, user, roles} = this.props
        return (
            <Form
                {...layout}
                name="addUpdateForm"
                ref={this.formRef}
                initialValues={
                    !isUpdateUser ? null : {
                        username: user.username,
                        phone: user.phone,
                        email: user.email,
                        role_id: user.role_id,
                    }
                }
            >
                <Form.Item
                    label="用户名"
                    name="username"
                    rules={[
                        { required: true, message: 'Please input your username!' },
                        {whitespace:true, message: "username cannot be blank!"}
                    ]}
                >
                    <Input placeholder='请输入用户名' />
                </Form.Item>

                { isUpdateUser ? null :
                (<>
                    <Form.Item
                        label="密码"
                        name="password"
                        rules={[
                            { required: true, message: 'Please input your password!' },
                            {whitespace:true, message: "password cannot be blank!"}
                        ]}
                    >
                        <Input.Password placeholder='请输入密码'/>
                    </Form.Item>

                    <Form.Item
                        label="确认密码"
                        name="confirm"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Please confirm your password!' },
                            ({ getFieldValue }) => ({
                                validator(rule, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject('Two passwords do not match!');
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder='请确认您的密码'/>
                    </Form.Item>
                </>)
                }

                <Form.Item
                    label="手机号"
                    name="phone"
                >
                    <Input placeholder='请输入手机号'/>
                </Form.Item>

                <Form.Item
                    label="邮箱"
                    name="email"
                    rules={[ { type: 'email', message: 'The input is not valid E-mail!', }, ]}
                >
                    <Input placeholder='请输入电子邮箱'/>
                </Form.Item>

                <Form.Item
                    label="角色"
                    name="role_id"
                    rules={[{ required: true, message: 'Please select your role!' }]}
                >
                    <Select placeholder='请选择角色'>
                        {
                            roles.map(role => {
                                return <Option value={role._id} key={role._id}>{role.name}</Option>
                            })
                        }
                    </Select>
                </Form.Item>
            </Form>
        )
    }
}