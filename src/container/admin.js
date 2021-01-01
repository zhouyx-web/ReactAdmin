import {connect} from 'react-redux'

import Admin from '../pages/admin/admin'

export default connect(
    state => ({user:state.user}),
    {}
)(Admin)