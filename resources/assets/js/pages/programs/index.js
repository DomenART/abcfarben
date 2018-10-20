import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import Page from './Page'

const query = gql`
query {
  currentUser {
    id
    firstname
    secondname
    avatar
  }
  programs {
    id
    name
    status
    image
    completed_time
    be_completed_time
    passing_time
    annotation
  }
}
`
const mutation = gql`
mutation StartProgram($program_id: Int!) {
  startProgram(program_id: $program_id) {
    id
    status
    completed_time
    be_completed_time
    passing_time
  }
}
`

export default compose(
  graphql(query),
  graphql(mutation, { name: 'startProgram' })
)(Page)