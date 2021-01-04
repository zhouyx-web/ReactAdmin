import {connect} from 'react-redux'

import Role from '../pages/role/role'

export default connect(
    state => ({user:state.user}),
    {}
)(Role)