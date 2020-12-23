import React, { Component } from 'react'
import {
    Card,
    Table,
    Button,
    Modal,
    message
} from 'antd'

import { reqRoleList } from '../../api'
import { PAGE_SIZE } from '../../utils/constants'
import AddRoleForm from './add-role-form'
import AuthForm from './auth-form'
import {reqAddRole} from '../../api'

export default class Role extends Component {
    // 角色列表
    state = {
        roleList: [], // 角色列表
        loading: false, // 加载状态
        selectedRowKeys: [], // 选中项
        showAddRoleForm:false, 
        showAuthForm:false,
    }
    // 表格列属性
    columns = [
        {
            title: '角色名称',
            dataIndex: 'name',
        },
        {
            title: '创建时间',
            dataIndex: 'create_time',
        },
        {
            title: '授权时间',
            dataIndex: 'auth_time',
        },
        {
            title: '授权人',
            dataIndex: 'auth_name',
        },
    ]

    getAddRoleForm = form => {
        this.addRoleForm = form
    }

    /* 设置角色权限 */
    setRolePermission = () => {
        // console.log('setRolePermission()')
        this.setState({showAuthForm:true})
    }

    /* 创建角色 */
    createRole = () => {
        // console.log('createRole()')
        this.setState({showAddRoleForm:true})
    }

    initRoleList = async () => {
        // 发送请求获取角色列表
        this.setState({ loading: true })
        const result = await reqRoleList()
        this.setState({ loading: false })
        if (result.status === 0) {
            const roleList = result.data
            this.setState({ roleList })
        }
    }

    hideAddModal = () => {
        this.setState({showAddRoleForm:false})
    }

    /* 添加角色确认按钮响应函数 */
    addRole = async () => {
        const {addRoleForm} = this
        try{
            // 表单验证
            const values = await addRoleForm.validateFields()
            const {roleName} = values
            // console.log('addRole()', roleName)
            // 发送请求
            const result = await reqAddRole(roleName)
            // 读取请求状态
            if(result.status === 0){
                message.success("角色添加成功")
                // 更新State刷新界面
                this.setState(state => {
                    return {roleList:[...state.roleList, result.data], showAddRoleForm:false}
                })
            }
        } catch(e) {
            message.error("角色添加失败")
        }
    }

    hideAuthModal = () => {
        this.setState({showAuthForm:false})
    }

    componentDidMount() {
        // 初始化角色列表数据
        this.initRoleList()
    }

    render() {
        const { columns } = this
        const { roleList, loading, selectedRowKeys, showAddRoleForm, showAuthForm } = this.state
        // 卡片标题
        const cardTitle = (
            <>
                <Button
                    type="primary"
                    style={{ marginRight: 10 }}
                    onClick={this.createRole}
                >
                    创建角色
                </Button>
                <Button
                    type="primary"
                    disabled={this.state.selectedRowKeys.length > 0 ? false : true}
                    onClick={this.setRolePermission}
                >
                    设置角色权限
                </Button>
            </>
        )
        return (
            <Card title={cardTitle}>
                <Table
                    loading={loading}
                    dataSource={roleList}
                    columns={columns}
                    bordered
                    rowKey="_id"
                    pagination={{ pageSize: PAGE_SIZE }}
                    rowSelection={{
                        type: "radio",
                        selectedRowKeys,
                    }}
                    onRow={role => ({ onClick: () => this.setState({ selectedRowKeys: [role._id] }) })}
                />
                <Modal
                    title="添加角色"
                    visible={showAddRoleForm}
                    onOk={this.addRole}
                    onCancel={this.hideAddModal}
                    okText="确认"
                    cancelText="取消"
                >
                    <AddRoleForm getAddRoleForm={this.getAddRoleForm}/>
                </Modal>
                <Modal
                    title="设置角色权限"
                    visible={showAuthForm}
                    onOk={this.hideAuthModal}
                    onCancel={this.hideAuthModal}
                    okText="确认"
                    cancelText="取消"
                >
                    <AuthForm/>
                </Modal>
            </Card>
        )
    }
}