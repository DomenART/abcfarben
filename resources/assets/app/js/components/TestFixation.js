import React, { Component, Fragment } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import classNames from 'classnames'
import { catchErrorsNotification } from '../utils/graphql'

class TestFixation extends Component {
  state = {
    values: {},
    sending: false
  }

  handlerChange = (e) => {
    const { name, checked } = e.target

    this.setState({
      values: {
        ...this.state.values,
        [name]: checked
      }
    })
  }

  reset = () => {
    const { resetTestResult } = this.props

    this.setState({
      values: {},
      sending: true
    })

    resetTestResult()
    .finally(() => this.setState({ sending: false }))
    .catch(catchErrorsNotification)
  }

  sendTestResult = () => {
    const {
      sendTestResult,
      data: { tests: [test] }
    } = this.props
    const report = []

    test.questions.forEach(question => {
      question.answers.forEach(({ id }) => {
        if (this.isChecked(id)) {
          report.push(id)
        }
      })
    })

    this.setState({ sending: true })

    sendTestResult({
      variables: { report }
    })
    .finally(() => this.setState({ sending: false }))
    .catch(catchErrorsNotification)
  }

  getAnswerCls(id, cls) {
    const { data: { tests: [test] } } = this.props
    const found = test.result && test.result.report.filter(row => row.id === id)[0]

    if (!found) return false

    return cls[found.success ? 'success' : 'danger']
  }

  isChecked(id) {
    const { data: { tests } } = this.props
    const { values } = this.state

    if (values[id] !== undefined) {
      return Boolean(values[id])
    } else {
      if (!tests.length || !tests[0].result) {
        return false
      }
      const found = tests[0].result.report.filter(row => row.id === id)[0]
      if (found && found.checked) {
        return true
      } else {
        return false
      }
    }
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

        {test.questions.map(question => (
          <Fragment key={question.id}>
            <div className="test-panel__heading">{question.title}</div>
            <div className="test-panel__list">
              {question.answers.map(answer => (
                <label
                  key={answer.id}
                  className={classNames('test-panel__list-item', this.getAnswerCls(answer.id, {
                    'success': 'test-panel__list-item_success',
                    'danger': 'test-panel__list-item_danger'
                  }))}
                >
                  <input
                    className="uk-checkbox"
                    type="checkbox"
                    name={answer.id}
                    onChange={this.handlerChange}
                    checked={this.isChecked(answer.id)}
                    disabled={Boolean(test.result)}
                  />
                  {answer.title}
                </label>
              ))}
            </div>
          </Fragment>
        ))}

        <div className="test-panel__body">
          {(test.result && test.result.success) ? (
            <h3>Тест завершен!</h3>
          ) : (
            <div className="uk-grid-small" data-uk-grid>
              <div className="uk-width-auto">
                <button
                  className="uk-button uk-button-primary"
                  onClick={this.sendTestResult}
                  disabled={test.result && !test.result.success}
                >Завершить задание</button>
              </div>
              <div className="uk-width-auto">
                <button
                  className="uk-button uk-button-default"
                  onClick={this.reset}
                  disabled={test.result && test.result.success}
                >Начать заново</button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
}

const query = gql`
query TestFixation($test_id: Int!) {
  tests(id: $test_id) {
    id
    questions {
      id
      title
      answers {
        id
        title
      }
    }
    result {
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
const sendTestResultMutation = gql`
mutation sendTestResult(
  $test_id: Int!
  $report: [Int]
) {
  sendTestResult(
    test_id: $test_id,
    report: $report
  ) {
    id
    result {
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
mutation resetTestResult($test_id: Int!) {
  resetTestResult(test_id: $test_id) {
    id
    result {
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
export default compose(
  graphql(query, {
    options: ({ test_id }) => ({
      fetchPolicy: "network-only",
      variables: { test_id }
    })
  }),
  graphql(sendTestResultMutation, {
    name: 'sendTestResult',
    options: ({ test_id }) => ({
      variables: { test_id }
    })
  }),
  graphql(resetTestResultMutation, {
    name: 'resetTestResult',
    options: ({ test_id }) => ({
      variables: { test_id }
    })
  })
)(TestFixation)