import React, { Component, Fragment } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import classNames from 'classnames'
import { catchErrorsNotification } from '../utils/graphql'

class TestReults extends Component {
  state = {
    sending: false
  }

  reset = () => {
    const { resetTestResult } = this.props

    this.setState({ sending: true })

    resetTestResult()
    .finally(() => this.setState({ sending: false }))
    .catch(catchErrorsNotification)
  }

  toggle = e => {
    const { updateTestResult } = this.props

    this.setState({ sending: true })

    updateTestResult({
      variables: {
        success: e.target.value === 'true'
      }
    })
    .finally(() => this.setState({ sending: false }))
    .catch(catchErrorsNotification)
  }

  getAnswerCls(answer_id, answers, cls) {
    const { data: { tests: [test] } } = this.props

    if (!test.result) return false

    const reported_answers = answers.filter(answer => {
      return !!test.result.report.filter(row => row.id === answer.id && row.checked).length
    })

    if (!reported_answers.length) {
      return cls['warning']
    }

    const found = test.result.report.filter(row => row.id === answer_id)

    if (!found.length) return false

    return cls[found[0].success ? 'success' : 'danger']
  }

  isChecked(id) {
    const { data: { tests } } = this.props

    if (!tests.length || !tests[0].result) {
      return false
    }
    const found = tests[0].result.report.filter(row => row.id === id)[0]
    return found && found.checked
  }

  render() {
    const { data: { loading, error, tests } } = this.props
    const { sending } = this.state

    if (loading)
      return <div className="preloader preloader_absolute" />

    if (error)
      return <div className="uk-alert-danger" data-uk-alert>{error.message}</div>

    if (!tests.length)
      return <div className="uk-alert-danger" data-uk-alert>Тест не найден</div>

    const test = tests[0]

    return (
      <div className="test-panel">
        {sending && <div className="preloader preloader_absolute" />}

        {test.result && (
          <div className="test-panel__body">
            <div className="uk-flex uk-flex-between uk-flex-middle">
              <select onChange={this.toggle} defaultValue={test.result.success}>
                <option value={true}>Выполнен</option>
                <option value={false}>Не выполнен</option>
              </select>

              <div className="uk-label">
                Результат: <strong>{test.result.percent}%</strong>
              </div>
            </div>
          </div>
        )}

        {test.questions.map(question => (
          <Fragment key={question.id}>
            <div className="test-panel__heading">{question.title}</div>
            <div className="test-panel__list">
              {question.answers.map(answer => (
                <label
                  key={answer.id}
                  className={classNames('test-panel__list-item', this.getAnswerCls(answer.id, question.answers, {
                    'success': 'test-panel__list-item_success',
                    'danger': 'test-panel__list-item_danger',
                    'warning': 'test-panel__list-item_warning',
                  }))}
                >
                  <input
                    className="uk-checkbox"
                    type="checkbox"
                    name={answer.id}
                    checked={this.isChecked(answer.id)}
                    disabled={true}
                  />
                  {answer.title}
                  {answer.correct && (
                    <div className="test-panel__list-item-check">
                      <span data-uk-icon="icon: check"></span>
                    </div>
                  )}
                </label>
              ))}
            </div>
          </Fragment>
        ))}

        {test.result && (
          <div className="test-panel__body">
            <button
              className="uk-button uk-button-default"
              onClick={this.reset}
            >Сбросить результаты теста</button>
          </div>
        )}
      </div>
    )
  }
}

const query = gql`
query TestReults(
  $test_id: Int!
  $student_id: Int!
) {
  tests(id: $test_id) {
    id
    questions {
      id
      title
      answers {
        id
        title
        correct
      }
    }
    result(student_id: $student_id) {
      id
      percent
      success
      report {
        id
        success
        checked
      }
    }
    task {
      id
      status
    }
  }
}
`
const resetTestResultMutation = gql`
mutation resetTestResult(
  $test_id: Int!
  $student_id: Int!
) {
  resetTestResult(
    test_id: $test_id,
    student_id: $student_id
  ) {
    id
    result(student_id: $student_id) {
      id
      percent
      success
      report {
        id
        success
        checked
      }
    }
  }
}
`
const updateTestResultMutation = gql`
mutation updateTestResult(
  $test_id: Int!
  $student_id: Int!
  $success: Boolean
) {
  updateTestResult(
    test_id: $test_id,
    student_id: $student_id,
    success: $success
  ) {
    id
    result(student_id: $student_id) {
      id
      success
    }
  }
}
`
export default compose(
  graphql(query, {
    options: ({ test_id, student_id }) => ({
      fetchPolicy: "network-only",
      variables: { test_id, student_id }
    })
  }),
  graphql(resetTestResultMutation, {
    name: 'resetTestResult',
    options: ({ test_id, student_id }) => ({
      variables: { test_id, student_id }
    })
  }),
  graphql(updateTestResultMutation, {
    name: 'updateTestResult',
    options: ({ test_id, student_id }) => ({
      variables: { test_id, student_id }
    })
  })
)(TestReults)