/* 添加商品，修改商品路由界面 */
import React, {Component} from 'react'
import {
    Card,
    Input,
    Button,
    Form,
    Cascader,
} from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

import LinkButton from '../../components/link-button/link-button'
import {reqCategorys} from '../../api'
import PictureWall from './picture-wall'

const {Item} = Form
const {TextArea } = Input

export default class AddUpdate extends Component{
    constructor(props){
        super(props)
        // 判断当前是否是更新界面
        this.product = this.props.location.state || {}
        this.isUpdate = !! this.props.location.state
        // 创建ref保存PictureWall组件对象
        this.picWallRef = React.createRef()
    }

    state = {
        optionLists:[], // 级联列表的初始数据
    }
    
    // 动态加载数据的回调，传入的参数就是点击的菜单项，是一个选择的数组，级联菜单可以选择多个菜单项
    loadData = async selectedOptions => {
        // selectedOptions就是this.state.optionLists的某一项或者多项构成的数组
        const targetOption = selectedOptions[selectedOptions.length - 1]
        // 正在加载的标志
        targetOption.loading = true;
    
        // 发送请求获取被点击菜单项对应的分类列表
        const categorys = await this.getCategorys(targetOption.value)
        targetOption.loading = false
        if(categorys && categorys.length > 0){
            targetOption.children = categorys.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: true,
        }))
        } else {
            targetOption.isLeaf = true
        }
        this.setState({optionLists:[...this.state.optionLists]})
    }

    // 初始化级联列表数据
    initOptionLists = async categorys => {
        // 收集列表的id
        const optionLists = categorys.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false,
        }))
        
        // 获取商品的父分类id
        const {product, isUpdate} = this
        // 如果父分类id存在，说明当前是商品修改界面
        // 如果父分类id不为0，说明商品是二级分类下的一个商品
        if(isUpdate && product.pCategoryId !== '0'){
            const categorys = await this.getCategorys(product.pCategoryId)
            const children = categorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true,
            }))
            // 子列表已经获取到，需要添加到状态optionLists的某一个对象上
            const targetOption = optionLists.find(c => c.value === product.pCategoryId)
            targetOption.children = children
        }  
        // 更新状态
        this.setState({optionLists})      
    }

    getCategorys = async categoryId => {
        // 发送请求获取商品列表
        const results = await reqCategorys(categoryId)
        // 判断是否获取成功,是否是请求的一级列表
        if(results.status === 0){
            if(categoryId === '0'){
                this.initOptionLists(results.data)
            } else {
                // 如果不是请求的一级列表，将结果返回
                return results.data
            } 
        } 
    }

    onFinish = values => {
        // console.log(this.picWallRef.current)
        values.imgs = this.picWallRef.current.getFileListsName()
        console.log("收集表单数据并发送", values)
    }

    componentDidMount() {
        // 组件挂载时获取商品一级分类列表用于级联列表初始显示
        this.getCategorys('0')
    }

    render() {
        /* 卡片标题 */
        const cardTitle = (
            <>
                <LinkButton onClick={() => this.props.history.goBack()}>
                    <ArrowLeftOutlined style={{fontSize:20, marginRight:10}}/>
                </LinkButton>添加商品
            </>
        )
        /* 表单项布局 */
        const layout = {
            // 列标签宽度
            labelCol: { span: 2 },
            // 列包含宽度
            wrapperCol: { span: 8 },
        }   
        const {isUpdate, product} = this
        const {optionLists} = this.state
        const categoryIds = []
        /* 取出可能传递的商品描述信息，用于页面初始化显示 */
        const {name, desc, price, categoryId, pCategoryId, imgs, detail} = product
        if(isUpdate){
            if(pCategoryId !== '0') categoryIds.push(pCategoryId)
            categoryIds.push(categoryId)
        }
        // console.log('render()', this.isUpdate)
        

        return (
            <Card title={cardTitle}>
                <Form
                    {...layout}
                    name="addUpdateDetail"
                    onFinish={this.onFinish}
                    initialValues={{name, desc, price, categoryIds, imgs, detail}}
                >
                    <Item 
                        name="name" 
                        label="商品名称：" 
                        rules={[
                            {required: true, message: '商品名称必须输入'},
                            {whitespace: true, message: '不能全部为空格'}
                        ]}
                    >
                        <Input placeholder="请输入商品名称" />
                    </Item>
                    <Item 
                        name="desc" 
                        label="商品描述："
                        rules={[
                            {required: true, message: '商品描述必须输入'},
                            {whitespace: true, message: '不能全部为空格'}
                        ]}
                    >
                        <TextArea placeholder="请输入商品描述" />
                    </Item>
                    <Item 
                        name="price" 
                        label="商品价格："
                        rules={[
                            {required: true, message: '商品价格必须输入'},
                            {validator: (rule, value) => {
                                if(value * 1 <= 0){
                                    return Promise.reject("商品价格必须大于0")
                                } else {
                                    return Promise.resolve()
                                }
                            }}
                        ]}
                    >
                        <Input type="number" placeholder="请输入商品价格" addonAfter="元" />
                    </Item>
                    <Item 
                        name="categoryIds" 
                        label="商品分类：" 
                        rules={[{required: true, message: '商品分类必须输入'}]}
                    >
                        <Cascader 
                            options={optionLists} 
                            loadData={this.loadData} 
                            placeholder="请输入商品分类"
                        />
                    </Item>
                    <Item name="imgs" label="商品图片：">
                        <PictureWall ref={this.picWallRef} imgs={isUpdate ? imgs : null}/>
                    </Item>
                    <Item name="detail" label="商品详情：">
                        <div>商品详情</div>
                    </Item>
                    <Item>
                    <Button type="primary" htmlType="submit">
                        提交
                    </Button>
                    </Item>

                </Form>
            </Card>
        )
    }
}
    