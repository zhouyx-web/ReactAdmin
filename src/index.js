/*
入口js
 */
import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'

// import App from './containers/App'
import App from './components/Counter'
import store from './redux/store'

/* ReactDOM.render((
  <Provider store={store}>
    <App/>
  </Provider>
), document.getElementById('root')) */

ReactDOM.render((
    <App store={store}/>
), document.getElementById('root'))

store.subscribe(() => {
  ReactDOM.render((
    <App store={store}/>
  ), document.getElementById('root'))
  console.log('listener execute')
})