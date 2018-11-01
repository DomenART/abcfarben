import React from 'react'
import Header from '../components/Header'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

const HeaderContainer = ({data: {loading, error, currentUser}}) => {
    if (loading)
      return <div className="preloader" />

    if (error)
      return <div className="uk-alert-danger" data-uk-alert dangerouslySetInnerHTML={{__html:error.message}} />

    return <Header user={currentUser} />
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
export default graphql(query)(HeaderContainer)