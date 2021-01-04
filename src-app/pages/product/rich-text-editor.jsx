import React, { Component } from 'react'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import PropTypes from 'prop-types'

import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

export default class RichTextEditor extends Component {

    static propTypes = {
        detail: PropTypes.string
    }

    constructor(props) {
        super(props)
        // 初始化编辑器状态
        const { detail } = this.props
        if (detail) {
            // 将初始带html标签的字符串转换成draft
            const contentBlock = htmlToDraft(detail)
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
                const editorState = EditorState.createWithContent(contentState)
                this.state = {
                    editorState,
                }
            }
        } else {
            this.state = {
                editorState: EditorState.createEmpty(),
            }
        }
    }

    // 点击提交按钮时，父组件调用此函数获取html格式的文本字符串
    getHtmlFromEditorState = () => {
        return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    }

    uploadImageCallBack = file => {
        return new Promise(
            (resolve, reject) => {
              const xhr = new XMLHttpRequest()
              xhr.open('POST', '/manage/img/upload')
              const data = new FormData()
              data.append('image', file)
              xhr.send(data)
              xhr.addEventListener('load', () => {
                const response = JSON.parse(xhr.responseText)
                const url = response.data.url
                resolve({data: {link: url}})
              })
              xhr.addEventListener('error', () => {
                const error = JSON.parse(xhr.responseText)
                reject(error)
              })
            }
          )
    }

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        })
    }

    render() {
        const { editorState } = this.state
        return (
            <Editor
                editorState={editorState}
                toolbar={{
                    image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
                }}
                wrapperStyle={{ width: 900 }}
                editorStyle={{ border: '1px black solid', minHeight: 250, padding: '0 10px' }}
                onEditorStateChange={this.onEditorStateChange}
            />
        )
    }
}