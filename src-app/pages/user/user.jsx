import React, { Component } from 'react'
import {
    Card,
    Button,
    Table,
    Modal,
    message,
} from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

import LinkButton from '../../components/link-button/link-button'
import { PAGE_SIZE } from '../../utils/constants'
import dateUtils from '../../utils/dateUtils'
import { reqUsers, reqDeleteUser, reqAdduser, reqUpdateUser } from '../../api'
import AddUpdateForm from './add-update-form'

const { confirm } = Modal

export default class User extends Component {
    state = {
        users: [],
        loading: false,
        modalVisible: false, // 添加/更新用户modal可见性
        isUpdateUser: false, // 判断当前是添加/更新用户
    }

    formRef = React.createRef()

    deleteUser = async (user) => {
        // 发送请求，删除用户
        const result = await reqDeleteUser(user._id)
        // 判断结果，若删除成功，则修改状态
        if (result.status === 0) {
            message.success('删除用户成功')
            const users = this.state.users.slice()
            users.forEach((item, index) => {
                if (item._id === user._id) users.splice(index, 1)
            })
            this.setState({ users })
        } else {
            message.error('删除用户失败')
        }
    }

    showDeleteConfirm = user => {
        confirm({
            title: `你想删除${user.username}用户吗？`,
            icon: <ExclamationCircleOutlined />,
            content: '永久删除用户',
            onOk: () => {
                // console.log('showDeleteConfirm()', this)
                this.deleteUser(user)
            }
        })
    }

    columns = [
        {
            title: '用户名',
            dataIndex: 'username',
        },
        {
            title: '邮箱',
            dataIndex: 'email',
        },
        {
            title: '电话',
            dataIndex: 'phone',
        },
        {
            title: '注册时间',
            dataIndex: 'create_time',
            render: date => dateUtils(date)
        },
        {
            title: '所属角色',
            dataIndex: 'role_id',
            render: role_id => {
                const role = this.roles.find(role => role._id === role_id)
                return role && role.name
            }
        },
        {
            title: '操作',
            render: user => (
                <>
                    <LinkButton onClick={() => {
                        this.user = user
                        this.setState({modalVisible: true, isUpdateUser: true})
                    }}>修改</LinkButton>
                    <LinkButton onClick={() => this.showDeleteConfirm(user)}>删除</LinkButton>
                </>
            )
        },
    ]

    addUser = async newUserData => {
        // 添加用户
        const addResult = await reqAdduser(newUserData)
        if(addResult.status === 0){
            message.success('添加用户成功')
            // 更新组件状态
            this.setState(state => ({
                users:[...state.users, addResult.data],
                modalVisible: false
            }))
        } else {
            message.error(addResult.msg)
        }
    }

    updateUser = async newUserData => {
        // 更新用户
        const updateResult = await reqUpdateUser(newUserData)
        const {user} = this
        if(updateResult.status === 0){
            message.success('更新用户成功')
            // 更新组件状态
            const users = this.state.users.map(item => item._id === user._id ? updateResult.data : item)
            this.setState({ users, modalVisible: false })
        } else {
            message.error(updateResult.msg)
        }
    }

    // 添加或更新用户的回调函数
    addOrUpdateUser = async () => {
        // 获取表单容器组件AddUpdateForm内部表单的form对象
        this.addUpdateFormObj = this.formRef.current.getFormObj()
        const {addUpdateFormObj, user} = this
        // console.log('addOrUpdateUser()', addUpdateFormObj.getFieldsValue())

        try {
            console.log('addOrUpdateUser()1', '添加用户')
            // 表单验证，如果通过，才进行后续处理
            const validateResult = await addUpdateFormObj.validateFields()
            console.log('addOrUpdateUser()2', '添加用户')
            // debugger
            // 收集数据
            const {username, password, phone, email, role_id} = validateResult
            const _id = user && user._id
            console.log('addOrUpdateUser()3', '添加用户')
            // 发送请求
            if(this.state.isUpdateUser){
                this.updateUser({_id, username, phone, email, role_id})
                
            } else {
                this.addUser({username, password, phone, email, role_id})
                
            }
        } catch(e) {}
    }

    hideModal = () => {
        this.setState({modalVisible: false})
    }

    initUsers = async () => {
        this.setState({ loading: true })
        // 发送请求，获取用户列表
        const result = await reqUsers()
        if (result.status === 0) {
            const users = result.data.users
            // 保存角色列表 要先保存角色数据再进行渲染，因为columns中需要使用roles，放到后面会读取到undefined的错误
            this.roles = result.data.roles
            // 更新状态，显示用户列表
            this.setState({ users, loading: false })
        }
    }

    componentDidMount() {
        this.initUsers()
        // 获取表单的form对象
        // this.addUpdateFormObj = this.formRef.current.getFormObj()
        // 无法获取到表单容器组件的ref，原因未知
        // console.log('componentDidMount()', this.formRef.current)
    }

    render() {
        const { users, loading, modalVisible, isUpdateUser } = this.state
        const { columns, user, roles } = this
        return (
            <>
                <Card title={
                    <Button 
                        type="primary" 
                        onClick={() => this.setState({
                            modalVisible:true, 
                            isUpdateUser: false
                        })}
                    >
                        创建用户
                    </Button>
                }>
                    <Table
                        dataSource={users}
                        columns={columns}
                        bordered
                        rowKey='_id'
                        loading={loading}
                        pagination={{
                            pageSize: PAGE_SIZE
                        }}
                    />
                </Card>
                <Modal
                    title={isUpdateUser ? '更新用户' : '添加用户'}
                    visible={modalVisible}
                    onOk={this.addOrUpdateUser}
                    onCancel={this.hideModal}
                    okText="确认"
                    cancelText="取消"
                >
                    <AddUpdateForm isUpdateUser={isUpdateUser} user={user} roles={roles} ref={this.formRef}/>
                </Modal>
            </>
        )
    }
}