import React, {Component} from 'react'
import {
    Form,
    Input,
} from 'antd'
import PropTypes from 'prop-types'

const {Item} = Form

export default class AddRoleForm extends Component {

    addFormRef = React.createRef()

    static propTypes = {
        getAddRoleForm:PropTypes.func.isRequired
    }

    componentDidMount() {
        const {getAddRoleForm} = this.props
        /* 将表单组件对象传递到父组件中 */
        getAddRoleForm(this.addFormRef.current)
    }

    render() {
        return (
            <Form name="addRole" ref={this.addFormRef}>
                <Item 
                    name="roleName"
                    label="角色名称"
                    rules={[
                        {required:true, message:"角色名不能为空"},
                        {whitespace:true, message:"角色名不能全部为空格"}
                    ]}
                >
                    <Input placeholder="请输入角色名称"/>
                </Item>
            </Form>
        )
    }
}