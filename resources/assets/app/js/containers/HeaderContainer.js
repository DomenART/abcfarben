import React from 'react'
import Header from '../components/Header'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

const HeaderContainer = ({ data: { loading, error, currentUser } }) => {
    if (loading)
      return <div className="preloader preloader_absolute" />

    if (error)
      return <div className="uk-alert-danger" data-uk-alert>{error.message}</div>

    return (
      <Header {...currentUser} />
    )
}

const query = gql`
  query {
    currentUser {
      id
      firstname
      secondname
      avatar
      roles {
        slug
      }
    }
  }
`
export default graphql(query, {
  options: {
    fetchPolicy: "network-only"
  }
})(HeaderContainer)