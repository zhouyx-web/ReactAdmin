/* 商品详情界面 */
import React, { Component } from 'react'
import { Card, List, Typography } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

import LinkButton from '../../components/link-button/link-button'
import {IMG_BASE_URL} from '../../utils/constants'
import {reqCategoryName} from '../../api'

export default class Detail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cName1:'', // 一级分类名称
            cName2:'', // 二级分类名称
        }
        this.cardTitle = (
            <React.Fragment>
                <LinkButton style={{ marginRight: 15 }} onClick={() => this.props.history.goBack()} >
                    <ArrowLeftOutlined style={{ fontSize: 20 }} />
                </LinkButton>
                <span>商品详情</span>
            </React.Fragment>
        )
    }

    getCategoryName= async () => {
        const {pCategoryId, categoryId} = this.props.location.state
        // 如果pCategoryId=0，说明这个商品只存在一个分类，如果不等于0，说明存在两个分类名要获取
        if(pCategoryId === '0'){
            // 只获取一级分类
            const result = await reqCategoryName(categoryId)
            if(result.status === 0){
                this.setState({cName1:result.data.name})
            }
        } else {
            // 需要获取两个分类，同步发送请求，效率更高
            const results = await Promise.all([reqCategoryName(pCategoryId), reqCategoryName(categoryId)])
            // 两个请求成功的时机不确定，但确定的是成功的数据位置
            if(results[0].status === 0 && results[1].status === 0){
                this.setState({cName1:results[0].data.name, cName2:results[1].data.name})
            }
        }
    }

    componentDidMount() {
        // 根据商品的分类id获取分类名
        this.getCategoryName()
    }

    render() {
        const { cardTitle } = this
        const data = [this.props.location.state]
        const {cName1, cName2} = this.state
        return (
            <Card title={cardTitle} >
                <List
                    dataSource={data}
                    renderItem={item => (
                        <>
                            <List.Item>
                                <Typography.Text className="left">商品名称：</Typography.Text> {item.name}
                            </List.Item>
                            <List.Item>
                                <Typography.Text className="left">商品描述：</Typography.Text> {item.desc}
                            </List.Item>
                            <List.Item>
                                <Typography.Text className="left">商品价格：</Typography.Text> {item.price+'元'}
                            </List.Item>
                            <List.Item>
                                <Typography.Text className="left">所属分类：</Typography.Text> {cName1 + (cName2 === '' ? '' : ' --> ' + cName2)}
                            </List.Item>
                            <List.Item className="img-container">
                                <Typography.Text className="left">商品图片：</Typography.Text> 
                                {
                                    item.imgs.map((path, index) => <img src={IMG_BASE_URL + path} key={index} alt="productImg" className="imgStyle"/>)
                                }
                            </List.Item>
                            <List.Item>
                                <Typography.Text className="left">商品详情：</Typography.Text> 
                                <span dangerouslySetInnerHTML={{__html:item.detail}}></span>
                            </List.Item>
                        </>
                        
                    )}
                />
            </Card>
        )
    }
}
