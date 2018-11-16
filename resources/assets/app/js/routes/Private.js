import React from 'react'
import { Route, Redirect } from 'react-router'
import gql from 'graphql-tag'
import { graphql, Query } from 'react-apollo'

const queryCurrentUser = gql`
query authQuery {
  currentUser {
    id
    roles {
      slug
    }
  }
}
`

const PrivateRoute = ({ component: Component, roles = [], ...rest }) =>
  <Route {...rest} render={props => {
    return (
      <Query
        query={queryCurrentUser}
        fetchPolicy="network-only"
      >
        {({ client, loading, error, data }) => {
          if (loading)
            return <div className="preloader" />

          if (!!error) {
            localStorage.setItem('token', '')
            client.resetStore()
            return (
              <Redirect to={{
                pathname: '/login',
                state: {from: props.location}
              }} />
            )
          }

          if (!!roles.length) {
            if (!data.currentUser.roles || !roles.filter(role => !!data.currentUser.roles.filter(({ slug }) => slug === role).length).length) {
              return <Redirect to={{ pathname: '/' }} />
            } else {
              return <Component {...props}/>
            }
          } else {
            return <Component {...props}/>
          }
        }}
      </Query>
    )
  }} />

export default PrivateRoute