import {connect} from 'react-redux'

import Login from '../pages/login/login'
import {userLogin} from '../redux/action'

export default connect(
    state => ({user:state.user}),
    {userLogin}
)(Login)