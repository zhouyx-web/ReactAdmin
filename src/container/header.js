import {connect} from 'react-redux'

import Header from '../components/header'

export default connect(
    state => ({headerTitle:state.headerTitle}),
    {}
)(Header)