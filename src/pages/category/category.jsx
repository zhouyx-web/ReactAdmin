import React, {Component} from 'react'
import { Card, Button, Table } from 'antd'

import LinkButton from '../../components/link-button/link-button'
import { PlusOutlined } from '@ant-design/icons'
import {reqCategorys, reqAddCategory, reqUpdateCategory} from '../../api'

export default class Category extends Component {

  constructor(props){
    super(props)
    // 初始化数据
    this.state = {
      isLoading:false, // 是否正在加载列表 
      firstCategorys:[] // 一级商品分类
    }
    // 初始化表格表头数据
    this.columns = [
      {
        title: '分类名称',
        dataIndex: 'name',
      },
      {
        title: '操作',
        width: 300,
        render: () => (<div><LinkButton>修改分类</LinkButton><LinkButton>查看子分类</LinkButton></div>),
      }
    ]
    // 初始化card右上角按钮组件
    this.extra = (
          <Button type="primary">
              <PlusOutlined />添加
          </Button>
      )
  }

  // 获取商品分类列表
  getCategorys = async () => {
    // 修改isLoading为true
    this.setState({isLoading:true})
    // 发送请求，获取品类列表
    const categorys = await reqCategorys('0')
    // 得到数据，更新状态
    const firstCategorys = categorys.data
    console.log(firstCategorys)
    this.setState({firstCategorys, isLoading:false})
  }

  componentDidMount(){
    // 获取商品分类列表
    this.getCategorys()
  }

  render (){
      const {columns, extra} = this
      const {firstCategorys, isLoading} = this.state
      return (
          <Card title="一级分类列表" extra={extra} >
              <Table 
                columns={columns} 
                loading={isLoading}
                dataSource={firstCategorys} 
                // 指定key值的方式真坑
                rowKey='_id'
                bordered
                pagination={{pageSize:5, showQuickJumper:true}}
              />
          </Card>
      )
    }
}