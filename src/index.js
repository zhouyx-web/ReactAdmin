// react应用入口js文件

import ReactDOM from 'react-dom'

import App from './App.js'
import memeoryUtils from './utils/memeoryUtils'
import storageUtils from './utils/storageUtils'

const user = storageUtils.getUser()
memeoryUtils.user = user

ReactDOM.render(<App />, document.getElementById('root'))