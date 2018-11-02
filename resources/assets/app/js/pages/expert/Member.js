import React, { Component, Fragment } from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import HeaderContainer from '../../containers/HeaderContainer'
import Dialog from '../../components/Dialog'

class PageWrap extends Component {
  render() {
    const {
      data: { loading, error, members }
    } = this.props

    if (loading)
      return <div className="preloader" />

    if (error)
      return <div className="uk-alert-danger" data-uk-alert dangerouslySetInnerHTML={{__html:error.message}} />

    if (!members.length)
      return <div className="uk-alert-danger" data-uk-alert>Запись не найдена</div>

    const member = members[0]

    return (
      <main className="page">
        <HeaderContainer />

        <header className="program-header">
          <div className="program-header__leftside">
            <div className="program-header__title">
              <img className="program-header__title-pic" src="/img/course.svg" alt="" />
              <div
                className="program-header__title-text"
                dangerouslySetInnerHTML={{__html:member.program.name}}
              />
            </div>
            <div
              className="program-header__addition"
              dangerouslySetInnerHTML={{__html:member.program.annotation}}
            />
          </div>
        </header>

        <div className="uk-container uk-container-center">
          <div className="container">
            <Dialog
              title={(
                <Fragment>
                  Участник: <strong>{member.student.name}</strong>
                </Fragment>
              )}
              thread={member.program.expert_thread_id}
            />
          </div>
        </div>
      </main>
    )
  }
}

const query = gql`
query Members(
  $member_id: Int!
) {
  members(
    scope: "expert",
    id: $member_id
  ) {
    id
    student {
      id
      name
    }
    program {
      id
      name
      annotation
      expert_thread_id(member_id: $member_id)
    }
  }
}
`
export default compose(
  graphql(query, {
    options: ({ match: { params } }) => ({
      fetchPolicy: "network-only",
      variables: {
        member_id: params.member
      }
    })
  }),
)(PageWrap)