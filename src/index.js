// react应用入口js文件

import ReactDOM from 'react-dom'
// 引入Provider组件，用于作为redux与components之间的桥梁
import {Provider} from 'react-redux'

import App from './app.js'
import memeoryUtils from './utils/memeoryUtils'
import storageUtils from './utils/storageUtils'
import store from './redux/store'

const user = storageUtils.getUser()
memeoryUtils.user = user

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'))