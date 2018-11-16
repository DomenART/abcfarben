import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import Page from './Page'

const query = gql`
query User($id: Int!) {
  users(id: $id) {
    id
    name
    email
    firstname
    secondname
    avatar
    city
    country
    subdivision
    sphere
    about
    email_public
    phone
    phone_public
    skype
    skype_public
  }
  currentUser {
    id
  }
}
`

const PageWrap = props =>
  <Query
    query={query}
    variables={{
      id: props.match.params.user
    }}
  >
    {({ client, loading, error, data: { users, currentUser }}) => {
      if (loading)
        return <div className="preloader" />

      if (error)
        return <div className="uk-alert-danger" data-uk-alert dangerouslySetInnerHTML={{__html:error.message}} />

      if (users.length === 0)
        return <div className="uk-alert-danger" data-uk-alert>Пользователь не найден</div>

      return (
        <Page
          user={users[0]}
          current={currentUser.id === users[0]['id']}
          logout={() => {
            localStorage.setItem('token', '')
            client.resetStore()
          }}
        />
      )
    }}
  </Query>

export default PageWrap