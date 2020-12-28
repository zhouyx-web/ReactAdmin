/* 照片墙组件 */
import React, { Component } from 'react'
import { Upload, Modal, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import PropTypes from 'prop-types'

import {IMG_BASE_URL, IMG_UPLOAD_PARAMS} from '../../utils/constants'
import {reqDeletePic} from '../../api'

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export default class PicturesWall extends Component {

    static propTypes = {
        imgs:PropTypes.array
    }
    
    constructor(props){
        super(props)
        // 根据props初始化图片列表
        const {imgs} = this.props
        let fileList = []
        if(imgs && imgs.length > 0){
            fileList = imgs.map((c, index) => ({
                uid:-index,
                name:c,
                status:"done",
                url:IMG_BASE_URL + c
            }))
        }
        this.state = {
            previewVisible: false,
            previewImage: '',
            previewTitle: '',
            /* {
                    uid: '-1',
                    name: 'image.png',
                    status: 'done',
                    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
                } */
            fileList
        }
    }

    

    getFileListsName = () => {
        return this.state.fileList.map(cFile => cFile.name)
    }

    /* 取消查看预览图 */
    handleCancel = () => this.setState({ previewVisible: false });

    /* 点击预览按钮 */
    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    };

    /* 图片上传过程触发的函数 */
    handleChange = async ({ file, fileList}) => {
        console.log('handleChange()1', file, fileList)
        // 图片上传完成后，修改状态中文件列表的name,url属性
        if(file.status === 'done'){
            // 取出响应结果
            const result = file.response
            if(result.status === 0){
                message.success("图片上传成功")
                // 新创建一个简单的文件状态
                const newFile = {
                    uid:file.uid,
                    name:result.data.name,
                    status:file.status,
                    url:result.data.url
                }
                // 删除fileList最后一个元素，也就是刚上传完毕的图片
                fileList.pop()
                fileList.push(newFile)
                console.log(newFile)
            } else {
                message.error("图片上传失败")
            }
            
        } else if (file.status === 'removed'){
            // 发送请求删除图片
            const result = await reqDeletePic(file.name)
            if(result.status === 0){
                message.success("图片删除成功")
            }
        }
        this.setState({ fileList })
    }

    render() {
        const { previewVisible, previewImage, fileList, previewTitle } = this.state
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div style={{ marginTop: 4 }}>Upload</div>
            </div>
        )
        return (
            <>
                <Upload
                    // 图片上传的地址
                    action="/manage/img/upload"
                    // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    accept="image/*"
                    name={IMG_UPLOAD_PARAMS}
                    // 图片显示样式，取值：picture-card picture text
                    listType="picture-card"
                    // 已经上传的图片列表，从状态中读取
                    fileList={fileList}
                    // 点击预览的响应函数
                    onPreview={this.handlePreview}
                    // 上传中、完成、失败都会调用这个函数。
                    onChange={this.handleChange}
                >
                    {/* 控制最大上传的图片张数 */}
                    {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                {/* 预览图 */}
                <Modal
                    // 可见性
                    visible={previewVisible}
                    // 标题
                    title={previewTitle}
                    // 去掉对话框的底部，删除确认与取消按钮
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </>
        );
    }
}