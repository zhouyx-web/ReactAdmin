import React, {Component} from 'react'
import { Form, Input } from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item

export default class UpdateForm extends Component {

    static propTypes = {
        targetCategory:PropTypes.object,
        getUpdateForm:PropTypes.func.isRequired,
    }

    formRef = React.createRef()

    componentDidUpdate() {
        // antd的表单初始值只能指定一次，所以需要这个函数将表单状态重置为初始值
        this.formRef.current.resetFields()
        console.log('didupdate()','执行了')
    }

    componentDidMount() {
        // 组件挂载时，将表单对象传递给父组件，以获取输入的值
        const getUpdateForm = this.props.getUpdateForm
        getUpdateForm(this.formRef.current)
    }
    
    render() {
        const targetCategory = this.props.targetCategory || {}
        // console.log('updateForm()', targetCategory)
        return(
            <Form name="update-input" ref={this.formRef}>
                <Item
                    name="categoryName"
                    initialValue={targetCategory.name}
                    rules={[{required:true, message:"此项必填！"}, {whitespace:true, message:"不能只包含空格！"}]}
                >
                    <Input placeholder="" /> 
                </Item>
            </Form>
        )
    }
    
} 