import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'
import Page from './Page'

const AUTH_QUERY = gql`
query authQuery {
  currentUser {
    id
  }
}
`

export default compose(
  graphql(AUTH_QUERY, {
    options: {
      fetchPolicy: "network-only"
    }
  })
)(Page)