import React, { Component, Fragment } from 'react'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import classNames from 'classnames'
import getIconName from '../utils/getIconName'
import SvgIcon from '../components/UI/SvgIcon'
import { catchErrorsNotification } from '../utils/graphql'
// import update from 'immutability-helper'

class TestFixation extends Component {
  state = {
    values: {}
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
    this.setState({ values: {} })
  }

  render() {
    const { data: { loading, error, tests } } = this.props
    const { values } = this.state

    if (loading)
      return <div className="preloader preloader_absolute" />

    if (error)
      return <div className="uk-alert-danger" data-uk-alert>{error.message}</div>

    if (!tests.length)
      return <div className="uk-alert-danger" data-uk-alert>Тест не найден</div>

    const test = tests[0]

    return (
      <div className="test-panel">
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
                    checked={Boolean(values[answer.id])}
                  />
                  {answer.title}
                </label>
              ))}
            </div>
          </Fragment>
        ))}

        <div className="test-panel__body">
          <div className="uk-grid-small" data-uk-grid>
            <div className="uk-width-auto">
              <button className="uk-button uk-button-primary">Проверить ответы</button>
            </div>
            <div className="uk-width-auto">
              <button
                className="uk-button uk-button-default"
                onClick={this.reset}
              >Начать заново</button>
            </div>
          </div>
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
  }
}
`
// const checkAnswersMutation = gql`
// mutation sendTestResult(
//   $answers: []
// ) {
//   checkAnswers(
//     answers: $answers
//   ) {
//     id
//   }
// }
// `
export default compose(
  graphql(query, {
    options: ({ task_id, test_id }) => ({
      fetchPolicy: "network-only",
      variables: { test_id }
    })
  }),
  // graphql(checkAnswersMutation, {
  //   name: 'checkAnswers'
  // })
)(TestFixation)