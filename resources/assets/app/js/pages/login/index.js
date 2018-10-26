import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'
import Page from './Page'

const AUTH_TOKEN = gql`
  mutation authToken($token: String!) {
    assignAuthToken(token: $token) @client
  }
`

const AUTH_QUERY = gql`
  query authQuery {
    isAuthenticated @client
  }
`

export default compose(
  graphql(AUTH_TOKEN, { name: 'assignAuthToken' }),
  graphql(AUTH_QUERY),
)(Page)