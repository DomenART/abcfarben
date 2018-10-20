import React from 'react'
// import { connect } from 'react-redux'
import Header from '../components/Header'
// import { bindActionCreators } from 'redux'
// import * as curatorActions from '../store/actions/curator'
// import * as authActions from '../store/actions/auth'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

// class HeaderContainer extends Component {
//   componentDidMount() {
    // if (this.isCurator()) {
    //   this.props.curatorActions.loadStats()
    // }

    // this.props.authActions.loadNotifications()
//   }

  // isCurator() {
  //   const { user } = this.props

  //   return Boolean(user.roles.filter(({ slug }) => slug === 'curator').length)
  // }

//   render() {
//     const { user, curator, notifications } = this.props

//     return (
//       <Header
//         user={user}
        // curator={curator}
        // notifications={notifications}
        // isCurator={this.isCurator()}
        // deleteNotification={authActions.deleteNotification}
//       />
//     )
//   }
// }

// const mapStateToProps = state => ({
//   user: state.Auth.user,
//   notifications: state.Auth.notifications,
//   curator: state.curator
// })

// const mapDispatchToProps = dispatch => ({
  // curatorActions: bindActionCreators(curatorActions, dispatch),
  // authActions: bindActionCreators(authActions, dispatch)
// })

// export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer)
// import Page from './Page'

// export default graphql(query)(HeaderContainer)

const HeaderContainer = ({data: {loading, error, currentUser}}) => {
    if (loading)
      return <div className="preloader" />

    if (error)
      return <div className="uk-alert-danger" data-uk-alert dangerouslySetInnerHTML={{__html:error.message}} />

    return <Header user={currentUser} />
}


const query = gql`
  query {
    currentUser {
      id
      firstname
      secondname
      avatar
    }
  }
`

export default graphql(query)(HeaderContainer)