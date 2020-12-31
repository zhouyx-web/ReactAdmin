import {connect} from 'react-redux'

import Login from '../pages/login/login'

export default connect(
    state => ({user:state.user}),
    {}
)(Login)