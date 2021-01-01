import React, { Component } from 'react'
import {
    Form,
    Input,
    Tree
} from 'antd'
import PropTypes from 'prop-types'

import menuConfig from '../../config/menuConfig'

const { Item } = Form

export default class AuthForm extends Component {
    static propTypes = {
        selectRow: PropTypes.object
    }

    state = {
        selectRow: {},
        checkedKeys:[]
    }

    /* 动态生成树控件数据 */
    initTreeData = menuConfig => {
        return menuConfig.map(item => {
            return {
                title:item.title,
                key:item.path,
                children:(item.children ? this.initTreeData(item.children) : null)
            }
        })
    }

    /* 初始化树控件数据 */
    treeData = [
        {
            title:'平台权限',
            key:'all',
            children:this.initTreeData(menuConfig)
        }
    ]

    form = React.createRef()

    /* 获取勾选的权限keys数组，供外部函数调用 */
    getSelectKeys = () => {
        return this.state.checkedKeys
    }

    /* (取消)选中触发执行的函数 */
    onCheck = (checkedKeys) => {
        console.log('onCheck', checkedKeys)
        this.setState({ checkedKeys })
    }

    componentDidUpdate() {
        // 重置输入框的初始值
        this.form.current.resetFields()
    }

    /* 此声明周期函数唯一的作用就是传入新的props时更新state */
    static getDerivedStateFromProps(props, state){
        /* 此树控件使用受控模式，所以selectkeys需要从state中获取，所以初始化更新state的最好位置就是
        这个声明周期函数；当然，改为非受控模式，解决初始化的问题就会变得非常简单，执行render()时，直接修改
        选中的值就行。 */
        if(state.selectRow && (state.selectRow._id !== props.selectRow._id)){
            return {
                selectRow:props.selectRow,
                checkedKeys:props.selectRow.menus
            }
        }
        return null
    }

    render() {
        const { selectRow } = this.props
        const {checkedKeys} = this.state
        const {treeData} = this

        // console.log('render()', this.props.selectRow.menus)

        return (
            <Form name="authForm" ref={this.form} >
                <Item
                    name="_id"
                    rules={[{ required: true }]}
                    label="角色名称："
                    initialValue={selectRow.name}
                >
                    <Input disabled />
                </Item>

                <Tree
                    checkable
                    onCheck={this.onCheck}
                    checkedKeys={checkedKeys}
                    treeData={treeData}
                    defaultExpandAll
                />
            </Form>
        )
    }
}