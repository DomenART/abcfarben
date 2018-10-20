import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { catchErrorsNotification } from '../../utils/graphql'
import Lesson from "./Lesson"

class LessonContainer extends Component {
  state = {
    loading: false
  }

  read() {
    const {
      program, readLesson, history,
      data: {
        modules: [module],
        tasks: [task],
        lessons: [lesson]
      }
    } = this.props

    this.setState({ loading: true })

    readLesson({
      variables: {
        lesson_id: lesson.id
      }
    })
    .finally(() => this.setState({ loading: false }))
    .then(() => {
      const path = !lesson.next_lesson_id ?
        `/programs/${program.id}/${module.id}/${task.id}` :
        `/programs/${program.id}/${module.id}/${task.id}/${lesson.next_lesson_id}`

      history.push(path)
    })
    .catch(catchErrorsNotification)
  }

  render() {
    const {
      program,
      data: { loading, error, modules, tasks, lessons }
    } = this.props

    if (loading || this.state.loading)
      return <div className="preloader preloader_absolute" />

    if (error)
      return <div className="uk-alert-danger" data-uk-alert>{error.message}</div>

    if (modules.length === 0 || tasks.length === 0 || lessons.length === 0)
      return <div className="uk-alert-danger" data-uk-alert>Запись не найдена</div>

    const module = modules[0]
    const task = tasks[0]
    const lesson = lessons[0]

    return (
      <Lesson
        {...{lesson, task, module, program}}
        readHandler={this.read.bind(this)}
      />
    )
  }
}

const query = gql`
query Lesson(
  $lesson_id: Int!
  $task_id: Int!
  $module_id: Int!
  $program_id: Int!
) {
  modules(id: $module_id) {
    id
    name
    next_module_id(program: $program_id)
  }
  tasks(id: $task_id) {
    id
    name
  }
  lessons(id: $lesson_id) {
    id
    name
    content
    status
    has_access
    previous_lesson_id
    next_lesson_id
  }
}
`
const mutation = gql`
mutation ReadLesson($lesson_id: Int!) {
  readLesson(lesson_id: $lesson_id) {
    id
    status
    has_access
    task {
      id
      next_lesson_id
    }
  }
}
`
export default compose(
  graphql(query, {
    options: ({ match: { params }, program }) => ({
      fetchPolicy: "network-only",
      variables: {
        lesson_id: params.lesson,
        task_id: params.task,
        module_id: params.module,
        program_id: program.id
      }
    })
  }),
  graphql(mutation, { name: 'readLesson' })
)(withRouter(LessonContainer))