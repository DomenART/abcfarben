import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'
import Page from './Page'

const AUTH_QUERY = gql`
  query authQuery {
    isAuthenticated @client
  }
`

export default graphql(AUTH_QUERY)(Page)