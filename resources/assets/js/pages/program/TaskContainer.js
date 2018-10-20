import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { Redirect } from 'react-router'
import { catchErrorsNotification } from '../../utils/graphql'
import Task from './Task'


class TaskContainer extends Component {
  componentDidMount() {
    this.start()
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.task !== prevProps.match.params.task) {
      this.start()
    }
  }

  start() {
    this.props.startTask({
      variables: {
        task_id: this.props.match.params.task
      }
    })
  }

  read() {
    this.props.readTask({
      variables: {
        task_id: this.props.match.params.task
      }
    })
    .catch(catchErrorsNotification)
  }

  render() {
    const {
      program,
      data: { loading, error, modules, tasks }
    } = this.props

    if (loading)
      return <div className="preloader preloader_absolute" />

    if (error)
      return <div className="uk-alert-danger" data-uk-alert>{error.message}</div>

    if (modules.length === 0 || tasks.length === 0)
      return <div className="uk-alert-danger" data-uk-alert>Запись не найдена</div>

    const module = modules[0]
    const task = tasks[0]

    if (task.next_lesson_id) {
      const pathname = `/programs/${program.id}/${module.id}/${task.id}/${task.next_lesson_id}`
      return <Redirect to={{ pathname }} />
    }

    return <Task
      {...{task, module, program}}
      readHandler={this.read.bind(this)}
    />
  }
}

const query = gql`
  query Task(
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
      content
      solo
      status
      first_lesson_id
      next_lesson_id
      files
      has_access
    }
  }
`
const startTaskMutation = gql`
  mutation StartTast($task_id: Int!) {
    startTask(task_id: $task_id) {
      id
      status
    }
  }
`
const readTaskMutation = gql`
  mutation ReadTask($task_id: Int!) {
    readTask(task_id: $task_id) {
      id
      status
    }
  }
`
export default compose(
  graphql(query, {
    options: ({ match: { params }, program }) => ({
      fetchPolicy: "network-only",
      variables: {
        task_id: params.task,
        module_id: params.module,
        program_id: program.id
      }
    })
  }),
  graphql(startTaskMutation, { name: 'startTask' }),
  graphql(readTaskMutation, { name: 'readTask' })
)(TaskContainer)