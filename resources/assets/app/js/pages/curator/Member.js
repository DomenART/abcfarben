import React, { Component, Fragment } from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { Route } from 'react-router'
import { Switch, NavLink as Link } from 'react-router-dom'
import SvgIcon from '../../components/UI/SvgIcon'
import romanize from "romanize"
import classNames from "classnames"
import MemberMain from './MemberMain'
import MemberTask from './MemberTask'
import MemberDialog from './MemberDialog'
import HeaderContainer from '../../containers/HeaderContainer'

class PageWrap extends Component {
  state = {
    active: null
  }

  getStatusIcon(status) {
    switch (status) {
      case 'success': return 'doc-done'
      case 'warning': return 'doc-warning'
      case 'danger': return 'doc-danger'
      default: return 'doc'
    }
  }

  render() {
    const {
      match: { url },
      data: { refetch, loading, error, members }
    } = this.props
    const { active } = this.state

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

        <div className="uk-grid">
          <div className="menubar" id="menubar">
            <button className="menubar__close-btn uk-offcanvas-close" type="button" data-uk-close />

            <aside className="main-aside">
              <div className="main-aside__section">
                <div className="main-aside__structure-heading">
                  <img className="main-aside__section-pic" src="/img/structure.svg" alt="" />
                  <span className="main-aside__section-title">Структура программы</span>
                </div>
                <ul className="main-aside__structure-list">
                  {!!member.program.modules.length && member.program.modules.map((module, i) => (
                    <li key={module.id}>
                      <button
                        id={`structure-${i}`}
                        className="main-aside__structure main-aside__structure_open"
                        // main-aside__structure_active
                      >
                        <SvgIcon
                          name="folder"
                          className="main-aside__structure-icon"
                        />
                        <span className="main-aside__structure-title">
                          {romanize(i+1)}. {module.name}
                        </span>
                      </button>

                      {!!module.tasks.length && (
                        <Fragment>
                          <button
                            className="main-aside__structure-dropdown"
                            type="button"
                            data-uk-toggle={`target: #structure-${i}; cls: main-aside__structure_open`}
                          />
                          <ul className="main-aside__substructure-list">
                            {module.tasks.map(task => (
                              <li key={task.id}>
                                <Link
                                  to={`${url}/tasks/${task.id}`}
                                  className="main-aside__substructure"
                                  activeClassName="main-aside__substructure_active"
                                >
                                  <SvgIcon
                                    name={this.getStatusIcon(task.status)}
                                    className="main-aside__substructure-icon"
                                  />
                                  {task.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </Fragment>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="main-aside__section">
                <Link
                  to={`${url}/dialog`}
                  className="main-aside__link"
                >
                  <SvgIcon
                    name="bubbles"
                    className="main-aside__icon main-aside__icon_expert"
                  />
                  <span className="main-aside__link-title">Вопросы куратору</span>
                </Link>
              </div>
            </aside>
          </div>

          <div className="uk-width-expand uk-position-relative">
            <div className="container">
              <Switch>
                <Route path={`${url}`} exact render={() => (
                  <MemberMain />
                )} />

                <Route path={`${url}/dialog`} exact render={() => (
                  <MemberDialog />
                )} />

                <Route path={`${url}/tasks/:task`} exact render={props => (
                  <MemberTask
                    refetchMember={refetch}
                    program_id={member.program.id}
                    student_id={member.student.id}
                    {...props}
                  />
                )} />

                <Route path={`${url}/`} render={() => <h1>Нет такой страницы</h1>} />
              </Switch>
            </div>

            <button className="menu-btn" data-uk-icon="icon: menu" type="button" data-uk-toggle="target: #menubar" />
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
    scope: "curator",
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
      modules {
        id
        name
        tasks {
          id
          name
          status(member_id: $member_id)
        }
      }
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