/* 商品主页路由组件 */
import React, { Component } from 'react'
import {
    Card,
    Button,
    Input,
    Select,
    Table,
    message
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import LinkButton from '../../components/link-button/link-button'
import {reqProducts, reqProductsByKey, reqChangeProductStatus} from '../../api'
import {PAGE_SIZE} from '../../utils/constants'

const Option = Select.Option

export default class Home extends Component {

    state = {
        products:[], // 商品列表
        total:0, // 商品总数 
        loading: false,
        keyType: 'productName', // 下拉框默认选择的值
        searchKey: '', // 搜索框的值
        searching:false, // 是否处于搜索状态
        currentPage:1, // 显示的页码
    }

    // 初始化卡片标题
    /* cardTitle = (
        <div>
            <Select 
                defaultValue="productName" 
                style={{ width: 150 }} 
                value={this.state.keyType}
                onChange={keyType => this.setState({keyType})}
            >
                <Option value="productName">按名称搜索</Option>
                <Option value="productDesc">按描述搜索</Option>
            </Select>
            <Input 
                placeholder="关键字" 
                style={{ width: 150, margin: "0 15px" }} 
                value={this.state.searchKey}
                onChange={e => this.setState({searchKey:e.target.value})}
            />
            <Button type="primary" onClick={this.handleSearch} style={{marginRight:15}} >搜索</Button>
            <Button type="primary" onClick={() => {this.setState({searchKey:'', searching:false})}} >重置搜索</Button>
        </div>
    )
 */
    /* 初始化卡片新增按钮 */
    cardExtra =  (
        <Button type="primary" onClick={() => this.props.history.push('/product/addupdate')}>
            <PlusOutlined />添加商品
        </Button>
    )

    /* 初始化表格标题 */
    columns =  [
        {
            title: '商品名称',
            dataIndex: 'name',
            align: 'center',
        },
        {
            title: '商品描述',
            dataIndex: 'desc',
            align: 'center',
        },
        {
            title: '价格',
            dataIndex: 'price',
            render: (price) => '￥' + price,
            align: 'center',
        },
        {
            title: '状态',
            render: product => (
                <span>
                    <span>{product.status === 1 ? '在售' : '已下架'}</span>
                    <Button type="primary" size="small" style={{ marginLeft: 10 }} onClick={() => this.changeProdStatus(product)}>{product.status === 1 ? '下架' : '上架'}</Button>
                </span>
            ),
            align: 'center',
        },
        {
            title: '操作',
            render: product => (
                <span>
                    <LinkButton onClick={() => this.props.history.push('/product/detail', product)}>详情</LinkButton>
                    <LinkButton onClick={() => this.props.history.push('/product/addupdate', product)}>修改</LinkButton>
                </span>
            ),
            align: 'center',
        },
    ]

    changeProdStatus = async product => {
        // alert('changeProdStatus()触发了')
        // 发送请求修改商品状态
        const status = product.status === 1 ? 2 : 1
        const result = await reqChangeProductStatus(product._id, status)
        // 修改成功就发送请求获取当前页码的商品列表
        if (result.status === 0){
            message.success(status === 1 ? '商品上架成功' : '商品下架成功')
            this.getProducts(this.state.currentPage)
        }
    }

    /* 获取指定页码的商品列表 */
    getProducts = async pageNum => {
        this.setState({loading:true})
        // 根据searching的值来判断是否发送检索的商品列表请求
        const {searching, searchKey, keyType} = this.state
        let result
        if(searching) {
            result = await reqProductsByKey(pageNum, PAGE_SIZE, searchKey, keyType)
        } else {
            result = await reqProducts(pageNum, PAGE_SIZE)
        }
        // console.log('getProducts()', result)
        if(result.status === 0){
            const {total, list} = result.data
            this.setState({
                total,
                products:list,
                loading:false
            })
        } else {
            this.setState({loading:false})
            message.error("获取商品列表失败，请稍后重试")
        }
    }

    componentDidMount() {
        // 获取第一页商品列表
        this.getProducts(1)
    }

    render() {
        const { cardExtra, columns } = this
        const { total, products, loading } = this.state
        const cardTitle = (
            <div>
                <Select 
                    defaultValue="productName" 
                    style={{ width: 150 }} 
                    value={this.state.keyType}
                    onChange={keyType => this.setState({keyType})}
                >
                    <Option value="productName">按名称搜索</Option>
                    <Option value="productDesc">按描述搜索</Option>
                </Select>
                <Input 
                    placeholder="关键字" 
                    style={{ width: 150, margin: "0 15px" }} 
                    value={this.state.searchKey}
                    onChange={e => this.setState({searchKey:e.target.value})}
                />
                <Button 
                    type="primary" onClick={() => {
                        this.setState({searching:true, currentPage:1}, () => this.getProducts(1))
                    }} 
                    style={{marginRight:15}} 
                >   
                    搜索
                </Button>
                <Button 
                    type="primary" 
                    onClick={() => {
                        // 将组件重置为初始状态
                        this.setState({searchKey:'', searching:false, keyType: 'productName', currentPage:1}, () => this.getProducts(1))
                    }} 
                >
                    重置搜索
                </Button>
            </div>
        )
        // console.log("home render()", columns)
        return (
            <Card title={cardTitle} extra={cardExtra} >
                <Table
                    bordered
                    columns={columns}
                    dataSource={products}
                    rowKey="_id"
                    loading={loading}
                    pagination={{
                        defaultPageSize:PAGE_SIZE,
                        total,
                        onChange: pageNum => {
                            this.setState({currentPage:pageNum})
                            this.getProducts(pageNum)
                        },
                        current:this.state.currentPage
                    }}  
                />
            </Card>
        )
    }
}
