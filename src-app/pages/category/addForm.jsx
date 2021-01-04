import React, {Component} from 'react'
import { Form, Input, Select } from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item
const {Option} = Select
export default class AddForm extends Component {

    static propTypes = {
        firstCategorys:PropTypes.array.isRequired,
        getAddForm:PropTypes.func.isRequired,
        parentId:PropTypes.string.isRequired
    }

    formRef = React.createRef()

    // 表单输入自定义验证
    validator = (rule, value) => {
        /*
            1.不允许为空，不允许出现空格
            2.必须输入
        */
        const reg = /[\s]/
        if(!value){
            return Promise.reject('此项必填!')
        }else if(reg.test(value)){
            return Promise.reject('不能包含空格!')
        } else {
            return Promise.resolve()
        }
        
    }
    
    // 动态生成select标签的option选项
    getOptions = firstCategorys => {
        // 练习reduce的使用，所以使用reduce函数，注意数组元素的key值
        return firstCategorys.reduce((result, item) => {
            result.push((
                <Option value={item._id} key={item._id}>{item.name}</Option>
            ))
            return result
        }, [])
    }

    componentDidMount() {
        const getAddForm = this.props.getAddForm
        getAddForm(this.formRef.current)
        // console.log('addFormDidMount()',this.formRef.current.getFieldValue("parentId"))
    }

    componentDidUpdate() {
        this.formRef.current.resetFields()
    }

    render() {
        const {firstCategorys, parentId} = this.props
        return(
        <Form ref={this.formRef}>
            <Item name="parentId" initialValue={parentId} label="选择父类：">
                <Select>
                    <Option value="0">一级分类</Option>
                    {
                        this.getOptions(firstCategorys)
                    }
                </Select>
            </Item>
            <Item 
                name="categoryName" 
                rules={[{validator:this.validator}]}
                validateFirst={true}
                label="分类名称："
            >
                <Input placeholder="请输入分类名称"></Input>
            </Item>
        </Form>
        )
    }

} 