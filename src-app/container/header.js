import {connect} from 'react-redux'

import Header from '../components/header'
import {logout} from '../redux/action'

export default connect(
    state => ({headerTitle:state.headerTitle, user:state.user}),
    {logout}
)(Header)