import React from 'react'
import { Route, Redirect } from 'react-router'
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'

const PrivateRoute = ({ component: Component, roles, data, ...rest }) => (
  <Route {...rest} render={props => {
    if (!data.isAuthenticated) {
      return (
        <Redirect to={{
          pathname: '/login',
          state: {from: props.location}
        }} />
      )
    }

      // if (roles && roles.length) {
      //     if (!roles.filter(role => user.roles.filter(({ slug }) => slug === role).length).length) {
      //         return (
      //             <Redirect to={{ pathname: '/' }} />
      //         )
      //     }
      // }

    return <Component {...props}/>
  }}/>
)

const AUTH_QUERY = gql`
  query authQuery {
    isAuthenticated @client
    token @client
  }
`

export default graphql(AUTH_QUERY)(PrivateRoute)