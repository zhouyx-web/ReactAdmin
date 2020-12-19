import React, {Component} from 'react'
import { Card, Button, Table } from 'antd'

import LinkButton from '../../components/link-button/link-button'
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons'
import {reqCategorys, reqAddCategory, reqUpdateCategory} from '../../api'

export default class Category extends Component {

  constructor(props){
    super(props)
    // 初始化数据
    this.state = {
      parentId:'0', // 正在获取的品类列表的父类id,为0表示获取一级分类列表
      parentName:'', // 正在显示的品类列表的父类名
      isLoading:false, // 是否正在加载列表 
      firstCategorys:[], // 一级商品分类
      secCategorys:[] // 二级商品分类
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
        render: (tableCell) => {
            return (
            <div>
              <LinkButton>修改分类</LinkButton>
              {this.state.parentId === '0' ? <LinkButton onClick={() => this.showSecCategorys(tableCell)}>查看子分类</LinkButton> : null}
            </div>
            )
        }
      }
    ]
    // 初始化card右上角按钮组件
    this.extra = (
          <Button type="primary">
              <PlusOutlined />添加
          </Button>
      )
  }

  // 点击一级列表按钮执行的函数，需要再次发送请求，获取一级列表
  showParentCategorys = () => {
    this.setState({
      parentId:'0',
      parentName:'',
    },() => {this.getCategorys()}) 
  }

  // 获取二级商品列表
  showSecCategorys = (tableCell) => {
    // alert('点击二级分类')
    // 点击查看子分类列表后，就将组件parendId设置为表格项的_id属性
    // 是否将一级分类列表置为空数组有待考虑
    this.setState({
      parentId:tableCell._id, 
      parentName:tableCell.name,
      firstCategorys:[],
      },() => {
      this.getCategorys()
    })
  }

  // 获取商品分类列表
  getCategorys = async () => {
    const {parentId} = this.state
    // 修改isLoading为true
    this.setState({isLoading:true})
    // 发送请求，获取品类列表
    const categorys = await reqCategorys(parentId)
    // 判断正在获取的是几级分类列表
    if(parentId === '0'){
      // 得到数据，更新状态
      // 一级
      const firstCategorys = categorys.data
      this.setState({firstCategorys, isLoading:false})
    } else {
      // 二级
      const secCategorys = categorys.data
      this.setState({secCategorys, isLoading:false})
    }
  }

  componentDidMount(){
    // 获取商品分类列表
    this.getCategorys()
  }

  render (){
      const {columns, extra} = this
      const {firstCategorys, secCategorys , isLoading, parentId, parentName} = this.state
      const title = parentId === '0' ? '一级分类列表' : 
        (
          <div>
            <LinkButton onClick={this.showParentCategorys}>一级分类列表</LinkButton>
            <ArrowRightOutlined />
            <span style={{marginLeft:5}}>{parentName}</span>
          </div>
        )
          
      return (
          <Card title={title} extra={extra} >
              <Table 
                columns={columns}
                loading={isLoading}
                dataSource={parentId === '0' ? firstCategorys : secCategorys} 
                // 指定key值的方式真坑
                rowKey='_id'
                bordered
                pagination={{pageSize:5, showQuickJumper:true}}
              />
          </Card>
      )
    }
}