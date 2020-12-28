/* 返回一个类超链接组件 */

import React from 'react'

import './link-button.less'

export default function LinkButton (props) {
    // LinkButton内部的值会作为children属性传递到组件中
    return <button {...props} className="link-button">{props.children}</button>
}