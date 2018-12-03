import React, { Component, Fragment } from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { Route } from 'react-router'
import { Switch, NavLink as Link } from 'react-router-dom'
import SvgIcon from '../../components/UI/SvgIcon'
import romanize from "romanize"
import classNames from "classnames"
import HeaderContainer from '../../containers/HeaderContainer'
import routes from '../../routes/routes';

class PageWrap extends Component {
  state = {
    active: null
  }

  getPrograms() {
    const { data: { members } } = this.props
    const programs = []

    members.forEach(member => {
      if (member.student && member.program) {
        if (!programs.filter(program => program.id === member.program.id).length) {
          programs.push(member.program)
        }
      }
    })

    return programs
  }

  getStudents() {
    const { data: { members } } = this.props
    const { active } = this.state
    const users = []

    members.forEach(member => {
      if (member.student && member.program) {
        if (!users.filter(user => user.id === member.student.id).length) {
          if (active === null) {
            users.push({
              ...member.student,
              member_id: member.id
            })
          } else if (member.program.id === active) {
            users.push({
              ...member.student,
              member_id: member.id
            })
          }
        }
      }
    })

    return users
  }

  getActiveProgramName() {
    const { data: { members } } = this.props
    const { active } = this.state

    return members.filter(member => {
      if (member.student && member.program) {
        return member.program.id === active
      }
    })[0].program.name
  }

  render() {
    const {
      match: { url },
      data: { loading, error, members }
    } = this.props
    const { active } = this.state

    if (loading)
      return <div className="preloader" />

    if (error)
      return <div className="uk-alert-danger" data-uk-alert dangerouslySetInnerHTML={{__html:error.message}} />

    return (
      <main className="page">
        <HeaderContainer />

        {/* <ProgramHeader {...program} /> */}

        <div className="uk-grid">
          <div className="menubar" id="menubar">
            <button className="menubar__close-btn uk-offcanvas-close" type="button" data-uk-close />

            <aside className="main-aside">
              <div className="main-aside__section">
                <div className="main-aside__structure-heading">
                  <img className="main-aside__section-pic" src="/img/structure.svg" alt="" />
                  <span className="main-aside__section-title">Программы</span>
                </div>
                <ul className="main-aside__structure-list">
                  {this.getPrograms().map(({ id, name }, i) => (
                    <li key={id}>
                      <button
                        onClick={() => this.setState({active:id})}
                        className={classNames('main-aside__structure', {
                          'main-aside__structure_active': active === id
                        })}
                      >
                        <SvgIcon
                          name="folder"
                          className="main-aside__structure-icon"
                        />
                        <span className="main-aside__structure-title">
                          {romanize(i+1)}. {name}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>

          <div className="uk-width-expand uk-position-relative">
            <div className="container">
              {active === null ? (
                <h1 className="program__title">
                  <span data-uk-icon="icon: arrow-left"></span>
                  Выберите программу
                </h1>
              ) : (
                <Fragment>
                  <h1 className="program__title">
                    Пользователи программы: <span>"{this.getActiveProgramName()}"</span>
                  </h1>

                  <table className="uk-table uk-table-small uk-table-hover uk-table-striped curator-table">
                    <tbody>
                      {this.getStudents().map(({ id, name, member_id }, i) => (
                        <tr key={id}>
                          <td width="100%">
                            <Link to={`/curator/${member_id}`}>{name}</Link>
                          </td>
                          <td>
                            <Link
                              to={`/curator/${member_id}`}
                              className="uk-button uk-button-primary uk-button-small"
                            >Открыть</Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Fragment>
              )}
            </div>

            <button className="menu-btn" data-uk-icon="icon: menu" type="button" data-uk-toggle="target: #menubar" />
          </div>
        </div>
      </main>
    )
  }
}

const query = gql`
query Members {
  members(scope: "curator") {
    id
    student {
      id
      name
    }
    program {
      id
      name
    }
  }
}
`
export default compose(
  graphql(query, {
    options: ({ match: { params } }) => ({
      fetchPolicy: "network-only",
    })
  }),
)(PageWrap)