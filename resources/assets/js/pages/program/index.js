import React from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { Route } from 'react-router'
import { Switch } from 'react-router-dom'
// import Wiki from './Wiki'
import Main from './Main'
import Tasks from './Tasks'
import Members from './Members'
import ModuleContainer from './ModuleContainer'
import TaskContainer from './TaskContainer'
import LessonContainer from './LessonContainer'
import WikiContainer from './WikiContainer'
// import Expert from './Expert'
// import Container from './Container'
import ProgramAside from '../../components/Program/ProgramAside'
import ProgramHeader from '../../components/Program/ProgramHeader'
import HeaderContainer from '../../containers/HeaderContainer'

const PageWrap = ({
  match: { url },
  data: { loading, error, programs }
}) => {
  if (loading)
    return <div className="preloader" />

  if (error)
    return <div className="uk-alert-danger" data-uk-alert dangerouslySetInnerHTML={{__html:error.message}} />

  if (programs.length === 0)
    return <div className="uk-alert-danger" data-uk-alert>Программа не найдена</div>

  const program = programs[0]

  return (
    <main className="page">
      <HeaderContainer />

      <ProgramHeader {...program} />

      {program.has_access ? (
        <div className="uk-grid">
          <ProgramAside {...program} />

          <div className="uk-width-expand uk-position-relative">
            <div className="container">
              <Switch>
                <Route path={`${url}`} exact render={() => (
                  <Main {...program} />
                )} />

                <Route path={`${url}/wiki`} exact render={() => (
                  <WikiContainer program={program} />
                )} />

                <Route path={`${url}/tasks`} exact render={() => (
                  <Tasks {...program} />
                )} />

                <Route path={`${url}/members`} exact render={() => (
                  <Members program={program} />
                )} />

                {/* <Route path={`${url}/expert`} exact component={Expert}/> */}

                <Route path={`${url}/:module`} exact render={props => (
                  <ModuleContainer
                    {...props}
                    program={program}
                  />
                )} />

                <Route path={`${url}/:module/:task`} exact render={props => (
                  <TaskContainer
                    {...props}
                    program={program}
                  />
                )} />

                <Route path={`${url}/:module/:task/:lesson`} exact render={props => (
                  <LessonContainer
                    {...props}
                    program={program}
                  />
                )} />

                <Route path={`${url}/`} render={() => <h1>Нет такой страницы</h1>} />
              </Switch>
            </div>
            <button className="menu-btn" data-uk-icon="icon: menu" type="button" data-uk-toggle="target: #menubar" />
          </div>
        </div>
      ) : <h1>У вас нет доступа к данной программе</h1>}
    </main>
  )
}

const query = gql`
query Program($program_id: Int!) {
  programs(id: $program_id) {
    id
    name
    status
    image
    annotation
    completed_time
    be_completed_time
    passing_time
    content
    has_access
    progress {
      done
      available
      total
    }
    modules {
      id
      name
      content
      status
      opened(program: $program_id)
      tasks {
        id
        name
        status
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
        program_id: params.program
      }
    })
  }),
)(PageWrap)