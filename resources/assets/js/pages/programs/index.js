import { connect } from 'react-redux'
import Page from './Page'
import {bindActionCreators} from "redux"
import * as authActions from "../../store/actions/auth"

const mapStateToProps = store => ({
    user: store.Auth.user,
    notifications: store.Auth.notifications
})

const mapDispatchToProps = dispatch => ({
    authActions: bindActionCreators(authActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Page)