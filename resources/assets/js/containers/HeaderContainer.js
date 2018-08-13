import React, {Component} from 'react'
import { connect } from 'react-redux'
import Header from '../components/Header'
import { bindActionCreators } from 'redux'
import * as curatorActions from '../store/actions/curator'
import * as authActions from '../store/actions/auth'

class HeaderContainer extends Component {
    componentDidMount() {
        if (this.isCurator()) {
            this.props.curatorActions.loadStats()
        }

        this.props.authActions.loadNotifications()
    }

    isCurator() {
        const { user } = this.props

        return Boolean(user.roles.filter(({ slug }) => slug === 'curator').length)
    }

    render() {
        const { user, curator, notifications, authActions } = this.props

        return (
            <Header
                user={user}
                curator={curator}
                notifications={notifications}
                isCurator={this.isCurator()}
                deleteNotification={authActions.deleteNotification}
            />
        )
    }
}

const mapStateToProps = state => ({
    user: state.Auth.user,
    notifications: state.Auth.notifications,
    curator: state.curator
})

const mapDispatchToProps = dispatch => ({
    curatorActions: bindActionCreators(curatorActions, dispatch),
    authActions: bindActionCreators(authActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer)