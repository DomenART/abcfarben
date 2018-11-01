import React, { Component, Fragment } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import classNames from 'classnames'
import { catchErrorsNotification } from '../utils/graphql'
import { pluralize } from 'numeralize-ru'
import Cookies from 'js-cookie'

class TestEvaluation extends Component {
  state = {
    values: this.getInitialValues(),
    sending: false,
    progress: this.getInitialProgress(),
    timeOver: this.isTimeOver(),
    timerStarted: false
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { data: { loading, error, tests } } = this.props
    const { timerStarted, progress, timeOver } = this.state

    if (!loading && !error && !!tests.length) {
      if (!timeOver && !!progress && !timerStarted) {
        this.start()
      }
    }
  }

  componentDidMount() {
    // Cookies.remove(`progress-50`)
    // Cookies.remove(`timeOver-50`)
    // Cookies.remove(`values-50`)
    // Cookies.remove(`answers-50`)
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
  }

  isTimeOver() {
    const { test_id } = this.props

    if (Cookies.get(`timeOver-${test_id}`)) {
      return true
    }

    return false
  }

  getInitialProgress() {
    const { test_id } = this.props

    if (Cookies.get(`progress-${test_id}`)) {
      return true
    }

    return false
  }

  getInitialValues() {
    const { test_id } = this.props
    const values = Cookies.get(`values-${test_id}`)
    return values ? JSON.parse(values) : {}
  }

  handlerChange = (e) => {
    const { test_id } = this.props
    const { name, checked } = e.target

    this.setState({
      values: {
        ...this.state.values,
        [name]: checked
      }
    }, () => {
      Cookies.set(`values-${test_id}`, this.state.values)
    })
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

  isChecked(id) {
    const { data: { tests } } = this.props
    const { values } = this.state

    if (values[id] !== undefined) {
      return !!values[id]
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

  start = () => {
    const { data: { tests: [test] } } = this.props

    const next = () => {
      const progress = parseInt(Cookies.get(`progress-${test.id}`)) || 0

      if (progress < test.time) {
        this.setState({
          progress: progress + 1
        }, () => {
          Cookies.set(`progress-${test.id}`, this.state.progress)
        })

        this.timer = setTimeout(next, 1000)
      } else {
        this.setState({
          progress: null,
          timeOver: true
        }, () => {
          Cookies.remove(`progress-${test.id}`)
          Cookies.set(`timeOver-${test.id}`, true)
          Cookies.set(`values-${test.id}`, this.state.values)
        })
      }
    }

    this.setState({
      timerStarted: true
    }, next)
  }

  canSend() {
    const { data: { tests: [test] } } = this.props
    const { timeOver } = this.state

    if (!!test.result) {
      return false
    }

    let count = 0
    test.questions.forEach(question => {
      if (question.answers.filter(row => this.isChecked(row.id)).length) {
        count++
      }
    })

    if (count === test.questions.length) {
      return true
    }

    if (!!test.time && timeOver) {
      return true
    }

    return false
  }

  canCheck() {
    const { data: { tests: [test] } } = this.props
    const { timerStarted, timeOver } = this.state

    if (!!test.result) {
      return false
    }

    if (!!test.time && !timerStarted) {
      return false
    }

    if (!!test.time && timeOver) {
      return false
    }

    return true
  }

  render() {
    const { data: { loading, error, tests } } = this.props
    const { sending, progress, timeOver, timerStarted } = this.state

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

        {(!!test.time && !test.result) && (
          <div className="test-panel__body">
            {!timeOver ? (
              <div className="uk-flex uk-flex-middle uk-flex-between">
                <button
                  className="uk-button uk-button-primary"
                  onClick={this.start}
                  disabled={timerStarted}
                >Приступить к выполнению</button>

                {!timerStarted ? (
                  <div className="uk-label">
                    Время на выполнение: <strong>{test.time}</strong> {pluralize(test.time, 'секунда', 'секунды', 'секунд')}
                  </div>
                ) : (
                  <div className="uk-label uk-label-warning">
                    Осталось времени: <strong>{test.time - progress}</strong> {pluralize(test.time - progress, 'секунда', 'секунды', 'секунд')}
                  </div>
                )}
              </div>
            ) : (
              <h3>Время вышло!</h3>
            )}
          </div>
        )}

        {test.questions.map(question => (
          <Fragment key={question.id}>
            <div className="test-panel__heading">{question.title}</div>
            <div className="test-panel__list">
              {question.answers.map(answer => (
                <label className="test-panel__list-item" key={answer.id}>
                  <input
                    className="uk-checkbox"
                    type="checkbox"
                    name={answer.id}
                    onChange={this.handlerChange}
                    checked={this.isChecked(answer.id)}
                    disabled={!this.canCheck()}
                  />
                  {answer.title}
                </label>
              ))}
            </div>
          </Fragment>
        ))}

        {!!!test.result && (
          <div className="test-panel__body">
            <button
              className="uk-button uk-button-primary"
              onClick={this.sendTestResult}
              disabled={!this.canSend()}
            >Отправить на проверку</button>
          </div>
        )}
      </div>
    )
  }
}

const query = gql`
query TestEvaluation($test_id: Int!) {
  tests(id: $test_id) {
    id
    auto
    time
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
      report {
        id
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
      report {
        id
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
  })
)(TestEvaluation)