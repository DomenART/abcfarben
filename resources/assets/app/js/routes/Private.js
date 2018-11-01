import React from 'react'
import { Route, Redirect } from 'react-router'
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'

const PrivateRoute = ({
  component: Component, roles = [],
  data: { isAuthenticated, loading, error, currentUser: user },
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
        if (!user.roles || !roles.filter(role => !!user.roles.filter(({ slug }) => slug === role).length).length) {
          return (
            <Redirect to={{ pathname: '/' }} />
          )
        }
      }

      return <Component {...props}/>
    }} />
  )
}

const query = gql`
  query authQuery {
    isAuthenticated @client
    currentUser {
      id
      roles {
        slug
      }
    }
  }
`

export default graphql(query)(PrivateRoute)