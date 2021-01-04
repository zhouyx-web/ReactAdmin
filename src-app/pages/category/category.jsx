import React, { Component } from 'react'
import { Card, Button, Table, Modal } from 'antd'

import LinkButton from '../../components/link-button/link-button'
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { reqCategorys, reqAddCategory, reqUpdateCategory } from '../../api'
import UpdateForm from './updateForm'
import AddForm from './addForm'

export default class Category extends Component {

  constructor(props) {
    super(props)
    // 初始化数据
    this.state = {
      parentId: '0', // 正在获取的品类列表的父类id,为0表示获取一级分类列表
      parentName: '', // 正在显示的品类列表的父类名
      isLoading: false, // 是否正在加载列表 
      firstCategorys: [], // 一级商品分类
      secCategorys: [], // 二级商品分类
      visibleStatus: 0 // 修改品类与增加品类的显示控制，为0表示一个都不显示，为1显示修改，为2表示增加
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
              <LinkButton onClick={() => this.showUpdateModal(tableCell)}>修改分类</LinkButton>
              {this.state.parentId === '0' ? <LinkButton onClick={() => this.showSecCategorys(tableCell)}>查看子分类</LinkButton> : null}
            </div>
          )
        }
      }
    ]
    // 初始化card右上角按钮组件
    this.extra = (
      <Button type="primary" onClick={this.showAddModal}>
        <PlusOutlined />添加
      </Button>
    )
  }

  // 更新分类的响应函数
  updateCategory = () => {
    // 表单验证
    this.updateForm.validateFields().then(async values => {
      const categoryId = this.targetCategory._id
      const {categoryName} = values
      // 发送请求，更新分类名称
      const result = await reqUpdateCategory({categoryId, categoryName})
      if(result.status === 0){
        // 重新获取当前分类列表，更新状态并显示
        this.getCategorys()
        // 隐藏更新对话框
        this.cancelModal()
      }
    }).catch(err => {})
  }

  // 获取更新组件的form对象
  getUpdateForm = updateForm => {
    this.updateForm = updateForm
  }

  // 展示更新对话框
  showUpdateModal = tableCell => {
    this.setState({ visibleStatus: 1 })
    // 将即将被修改的数据添加到this中
    this.targetCategory = tableCell
  }

  // 添加分类的响应函数
  addCategory = () => {
    // 先进行表单验证
    this.addForm.validateFields().then(
      async values => {
        const {parentId, categoryName} = values
        // 发送请求，添加分类
        const result = await reqAddCategory(parentId, categoryName)
        if(result.status === 0){
          // 当正在显示的列表parentId与添加分类的id一致时，需要重新获取列表
          if(this.state.parentId === parentId) {
            // 重新获取分类列表
            this.getCategorys()
          } else if(parentId === "0"){ // 当添加一个一级列表时，需要重新获取一级列表的数据
            this.getCategorys(parentId)
          } 
          // 隐藏添加Modal
          this.cancelModal()
        }
        
      }
    ).catch(error => {})
    
  }

  // 展示添加对话框
  showAddModal = () => {
    this.setState({ visibleStatus: 2 })
  }

  // 获得添加组件的form对象
  getAddForm = addForm => {
    this.addForm = addForm
  }

  // 隐藏更新、添加对话框
  cancelModal = () => {
    this.setState({ visibleStatus:0 })
  }

  // 点击一级列表按钮执行的函数，需要再次发送请求，获取一级列表
  showParentCategorys = () => {
    this.setState({
      parentId: '0',
      parentName: '',
    })
  }

  // 获取二级商品列表
  showSecCategorys = tableCell => {
    // alert('点击二级分类')
    // 点击查看子分类列表后，就将组件parendId设置为表格项的_id属性
    // 是否将一级分类列表置为空数组有待考虑
    this.setState({
      parentId: tableCell._id,
      parentName: tableCell.name,
      // firstCategorys: [],
    }, () => {
      this.getCategorys()
    })
  }

  // 获取商品分类列表
  getCategorys = async id => {
    const parentId = id || this.state.parentId
    // 修改isLoading为true
    this.setState({ isLoading: true })
    // 发送请求，获取品类列表
    const categorys = await reqCategorys(parentId)
    // 判断正在获取的是几级分类列表
    if (parentId === '0') {
      // 得到数据，更新状态
      // 一级
      const firstCategorys = categorys.data
      this.setState({ firstCategorys, isLoading: false })
    } else {
      // 二级
      const secCategorys = categorys.data
      this.setState({ secCategorys, isLoading: false })
    }
  }

  componentDidMount() {
    // 获取商品分类列表
    this.getCategorys()
  }

  render() {
    const { columns, extra, targetCategory } = this
    const { firstCategorys, secCategorys, isLoading, parentId, parentName, visibleStatus } = this.state
    const title = parentId === '0' ? '一级分类列表' :
      (
        <div>
          <LinkButton onClick={this.showParentCategorys}>一级分类列表</LinkButton>
          <ArrowRightOutlined />
          <span style={{ marginLeft: 5 }}>{parentName}</span>
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
          pagination={{ pageSize: 5, showQuickJumper: true }}
        />

        <Modal
        title="更新分类"
        visible={visibleStatus === 1 ? true : false}
        onOk={this.updateCategory}
        onCancel={this.cancelModal}
        okText="确认"
        cancelText="取消"
        >
          <UpdateForm targetCategory={targetCategory} getUpdateForm={this.getUpdateForm}></UpdateForm>
        </Modal>

        <Modal
          title="添加分类"
          visible={visibleStatus === 2 ? true : false}
          onOk={this.addCategory}
          onCancel={this.cancelModal}
          okText="确认"
          cancelText="取消"
        >
          <AddForm firstCategorys={firstCategorys} getAddForm={this.getAddForm} parentId={parentId}></AddForm>
        </Modal>
      </Card>
    )
  }
}