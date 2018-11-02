import React from 'react'
import { Route, Redirect } from 'react-router'
import gql from 'graphql-tag'
import { graphql, Query } from 'react-apollo'

const queryCurrentUser = gql`
query {
  currentUser {
    id
    roles {
      slug
    }
  }
}
`

const PrivateRoute = ({
  component: Component, roles = [],
  data: { isAuthenticated, loading, error },
  ...rest
}) => {
  if (loading)
    return <div className="preloader preloader_absolute" />

  if (error)
    return <div className="uk-alert-danger" data-uk-alert>{error.message}</div>

  return (
    <Route {...rest} render={props => {
      if (!isAuthenticated) {
        return (
          <Redirect to={{
            pathname: '/login',
            state: {from: props.location}
          }} />
        )
      }

      if (!!roles.length) {
        return(
          <Query query={queryCurrentUser}>
            {({ loading, error, data: { currentUser } }) => {
              if (loading)
                return <div className="preloader" />

              if (error)
                return <div className="uk-alert-danger" data-uk-alert>{error.message}</div>

              if (!currentUser.roles || !roles.filter(role => !!currentUser.roles.filter(({ slug }) => slug === role).length).length) {
                return <Redirect to={{ pathname: '/' }} />
              } else {
                return <Component {...props}/>
              }
            }}
          </Query>
        )
      } else {
        return <Component {...props}/>
      }
    }} />
  )
}

const query = gql`
query authQuery {
  isAuthenticated @client
}
`
export default graphql(query)(PrivateRoute)