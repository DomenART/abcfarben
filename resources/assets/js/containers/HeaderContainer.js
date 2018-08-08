import React, {Component} from 'react'
import { connect } from 'react-redux'
import Header from '../components/Header'
import { bindActionCreators } from 'redux'
import * as curatorActions from '../store/actions/curator'


class HeaderContainer extends Component {
    componentDidMount() {
        if (this.isCurator()) {
            this.props.curatorActions.loadStats()
        }
    }

    isCurator() {
        const { user } = this.props

        return Boolean(user.roles.filter(({ slug }) => slug === 'curator').length)
    }

    render() {
        const { user, curator } = this.props

        return (
            <Header
                user={user}
                curator={curator}
                isCurator={this.isCurator()}
            />
        )
    }
}

const mapStateToProps = state => ({
    user: state.Auth.user,
    curator: state.curator
})

const mapDispatchToProps = dispatch => ({
    curatorActions: bindActionCreators(curatorActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer)