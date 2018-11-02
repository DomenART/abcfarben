import React, { Component, Fragment } from 'react'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import Head from '../../components/Head'
import Materials from '../../components/Materials'
import Dialog from '../../components/Dialog'
import TestResults from '../../components/TestResults'
import { catchErrorsNotification } from '../../utils/graphql'

class MemberTask extends Component {
  toggleStatus = e => {
    if (!!e.target.value) {
      const { updateTaskStatus, refetchMember } = this.props

      this.setState({ sending: true })

      updateTaskStatus({
        variables: {
          status: e.target.value
        }
      })
      .finally(() => {
        this.setState({ sending: false })
        refetchMember()
      })
      .catch(catchErrorsNotification)
    }
  }

  render() {
    const {
      student_id,
      data: { loading, error, tasks }
    } = this.props

    if (loading)
      return <div className="preloader" />

      if (error)
      return <div className="uk-alert-danger" data-uk-alert dangerouslySetInnerHTML={{__html:error.message}} />

    if (!tasks.length)
      return <div className="uk-alert-danger" data-uk-alert>Запись не найдена</div>

    const task = tasks[0]

    return (
      <Fragment>
        <Head title={task.name} />

        <div className="practice__heading">
          <h1 className="practice__page-title page-title uk-width-1-1">
            <svg className="page-title__icon page-title__icon_practice">
              <use href="#doc" />
            </svg>
            {task.name}
          </h1>

          {task.statuses && (
            <div className="uk-margin-right">
              <button
                data-uk-toggle="target: #statusses"
                type="button"
                className="uk-icon-button"
                data-uk-icon="list"
              />

              <div id="statusses" data-uk-modal>
                <div className="uk-modal-dialog uk-modal-body">
                  <table className="uk-table uk-table-striped uk-table-small">
                    <tbody>
                      {task.statuses.map(row => (
                        <tr key={row.id}>
                          <td>
                            {row.status === 'success' && 'Выполнен'}
                            {row.status === 'primary' && 'Не выполнен'}
                            {row.status === 'warning' && 'Выполняется'}
                            {row.status === 'danger' && 'Возвращен'}
                          </td>
                          <td>{row.created_at}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          <div>
            <select
              onChange={this.toggleStatus}
              defaultValue={task.status}
              className="uk-select"
            >
              <option value=""></option>
              <option value={'success'}>Выполнен</option>
              <option value={'primary'}>Не выполнен</option>
              <option value={'warning'}>Выполняется</option>
              <option value={'danger'}>Возвращен</option>
            </select>
          </div>
        </div>

        <div className="practice__exercises exercises">
          <div className="exercises__heading">
            Задание
          </div>
          <div
            className="exercises__text"
            dangerouslySetInnerHTML={{
              __html: task.content
            }}
          />
        </div>

        <Materials files={task.files} />

        {task.test && (
          <TestResults
            test_id={task.test.id}
            student_id={student_id}
          />
        )}

        {(task.type === 'default' && task.thread_id) && (
          <Dialog
            title="Переписка с куратором"
            thread={task.thread_id}
          />
        )}
      </Fragment>
    )
  }
}

const query = gql`
query MemberTask(
  $task_id: Int!
  $student_id: Int!
) {
  tasks(
    id: $task_id
  ) {
    id
    name
    content
    type
    status(student_id: $student_id)
    files
    thread_id(student_id: $student_id)
    test {
      id
      type
    }
    statuses(student_id: $student_id) {
      id
      status
      created_at
    }
  }
}
`
const updateTaskStatusMutation = gql`
mutation UpdateTaskStatus(
  $task_id: Int!
  $student_id: Int!
  $status: String!
) {
  updateTaskStatus(
    task_id: $task_id,
    student_id: $student_id,
    status: $status
  ) {
    id
    status(student_id: $student_id)
    statuses(student_id: $student_id) {
      id
      status
      created_at
    }
  }
}
`
export default compose(
  graphql(query, {
    options: ({ program_id, student_id, match: { params } }) => ({
      fetchPolicy: "network-only",
      variables: {
        task_id: params.task,
        program_id,
        student_id
      }
    })
  }),
  graphql(updateTaskStatusMutation, {
    name: 'updateTaskStatus',
    options: ({ student_id, match: { params } }) => ({
      variables: {
        task_id: params.task,
        student_id
      }
    })
  })
)(MemberTask)