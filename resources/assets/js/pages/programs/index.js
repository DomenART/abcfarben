import { connect } from 'react-redux'
import Page from './Page'

const mapStateToProps = store => ({
    user: store.Auth.user
})

export default connect(mapStateToProps)(Page)