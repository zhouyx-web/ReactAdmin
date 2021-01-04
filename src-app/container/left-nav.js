import {connect} from 'react-redux'

import LeftNav from '../components/left-nav'
import {setHeaderTitle} from '../redux/action'

export default connect(
    state => ({user:state.user}),
    {setHeaderTitle}
)(LeftNav)