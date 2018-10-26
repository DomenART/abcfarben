import React, { Component, Fragment } from 'react'
import axios from 'axios'
import update from 'immutability-helper'
import Switch from 'react-bootstrap-switch'

class TestFormFixation extends Component {
  state = {
    loading: false,
    test_id: this.props.test_id,
    questions: [],
    data: {}
  }

  componentDidMount() {
    this.loadQuestions()
  }

  loadQuestions() {
    const { test_id } = this.state

    this.setState({ loading: true }, () => {
      NProgress.start()

      axios.get(`/admin/api/test-questions`, {
        params: { test_id }
      })
      .finally(() => {
        NProgress.done()

        this.setState({ loading: false })
      })
      .then(({ data }) => {
        this.setState({
          questions: data
        })
      })
      .catch(this.errorHandler)
    })
  }

  handlerChange(e) {
    this.setState({
      data: {
        ...this.state.data,
        [e.target.name]: e.target.value
      }
    })
  }

  addQuestion(e) {
    e.preventDefault()

    const { test_id, questions, data } = this.state

    NProgress.start()

    axios.post(`/admin/api/test-questions`, {
      test_id,
      title: data.question,
      order: questions.length
    })
    .finally(() => {
      NProgress.done()
    })
    .then(response => {
      const rows = update(questions, {
        $push: [{
          answers: [],
          title: response.data.title,
          id: response.data.id
        }]
      })

      this.setState({
        questions: rows,
        data: {
          ...data,
          question: ''
        }
      })
    })
    .catch(this.errorHandler)
  }

  orderQuestion(question_id, dir) {
    const { questions } = this.state
    const index = questions.findIndex(row => row.id == question_id)

    let new_index = dir === 'up' ? index - 1 : index + 1
    if (new_index < 0) new_index = questions.length - 1
    if (new_index >= questions.length) new_index = 0

    const new_questions = update(questions, {
      $splice: [[new_index, 0, questions.splice(index, 1)[0]]]
    })
    const order = new_questions.map((row, i) => ({
      id: row.id,
      order: i
    }))

    NProgress.start()

    axios.post(`/admin/api/test-questions/order`, { order })
    .finally(() => {
      NProgress.done()
    })
    .then(() => {
      this.setState({ questions: new_questions })
    })
    .catch(this.errorHandler)
  }

  removeQuestion(question_id) {
    const { questions, data } = this.state

    NProgress.start()

    axios.delete(`/admin/api/test-questions/${question_id}`)
    .finally(() => {
      NProgress.done()
    })
    .then(response => {
      if (response.data.success) {
        const index = questions.findIndex(row => row.id == question_id)
        const rows = update(questions, {
          $splice: [[index, 1]]
        })
        this.setState({
          questions: rows
        })
      }
    })
    .catch(this.errorHandler)
  }

  addAnswer(e, question_id) {
    e.preventDefault()

    const { questions, data } = this.state
    const index = questions.findIndex(row => row.id == question_id)

    NProgress.start()

    axios.post(`/admin/api/test-answers`, {
      question_id,
      title: data[`question-${question_id}-answer`],
      order: questions[index].answers.length
    })
    .finally(() => NProgress.done())
    .then(response => {
      const new_questions = update(questions, {
          [index]: {
            answers: {
              $push: [{
                id: response.data.id,
                title: response.data.title,
                correct: response.data.correct
              }]
            }
          }
      })

      this.setState({
        questions: new_questions,
        data: {
          ...data,
          [`question-${question_id}-answer`]: ''
        }
      })
    })
    .catch(this.errorHandler)
  }

  orderAnswer(answer_id, question_id, dir) {
    const { questions } = this.state
    const question_index = questions.findIndex(row => row.id == question_id)
    const answers = questions[question_index].answers
    const answer_index = answers.findIndex(row => row.id == answer_id)

    let new_index = dir === 'up' ? answer_index - 1 : answer_index + 1
    if (new_index < 0) new_index = answers.length - 1
    if (new_index >= answers.length) new_index = 0

    const new_questions = update(questions, {
      [question_index]: {
        answers: {
          $splice: [[new_index, 0, answers.splice(answer_index, 1)[0]]]
        }
      }
    })
    const order = new_questions[question_index].answers.map((row, i) => ({
      id: row.id,
      order: i
    }))

    NProgress.start()

    axios.post(`/admin/api/test-answers/order`, { order })
    .finally(() => NProgress.done())
    .then(() => {
      this.setState({ questions: new_questions })
    })
    .catch(this.errorHandler)
  }

  removeAnswer(answer_id, question_id) {
    const { questions } = this.state

    NProgress.start()

    axios.delete(`/admin/api/test-answers/${answer_id}`)
    .finally(() => NProgress.done())
    .then(response => {
      if (response.data.success) {
        const question_index = questions.findIndex(row => row.id == question_id)
        const answer_index = questions[question_index].answers.findIndex(row => row.id == answer_id)
        const new_questions = update(questions, {
          [question_index]: {
            answers: {
              $splice: [[answer_index, 1]]
            }
          }
        })
        this.setState({
          questions: new_questions
        })
      }
    })
    .catch(this.errorHandler)
  }

  handleSwitch(el, state, answer_id, question_id) {
    const { questions } = this.state

    NProgress.start()

    axios.put(`/admin/api/test-answers/${answer_id}`, {
      correct: state
    })
    .finally(() => NProgress.done())
    .then(response => {
      const question_index = questions.findIndex(row => row.id == question_id)
      const answer_index = questions[question_index].answers.findIndex(row => row.id == answer_id)
      const new_questions = update(questions, {
        [question_index]: {
          answers: {
            [answer_index]: {
              correct: { $set: response.data.correct }
            }
          }
        }
      })
      this.setState({
        questions: new_questions
      })
    })
    .catch(this.errorHandler)
  }

  errorHandler(error) {
    console.log(error)
  }

  render() {
    const { questions, data, loading } = this.state

    if (loading) {
      return <div />
    }

    return (
      <Fragment>
        {questions.map(question => (
          <div className="panel panel-default" key={question.id}>
            <div className="panel-heading">
              {question.title}
              <div className="btn-toolbar pull-right" role="toolbar">
                {questions.length > 1 && (
                  <div className="btn-group btn-group-xs" role="group">
                    <button
                      type="button"
                      className="btn btn-default"
                      onClick={() => this.orderQuestion(question.id, 'down')}
                    >
                      <i className="glyphicon glyphicon-menu-down" />
                    </button>
                    <button
                      type="button"
                      className="btn btn-default"
                      onClick={() => this.orderQuestion(question.id, 'up')}
                    >
                      <i className="glyphicon glyphicon-menu-up" />
                    </button>
                  </div>
                )}
                <div className="btn-group btn-group-xs" role="group">
                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={() => this.removeQuestion(question.id)}
                  >
                    <i className="glyphicon glyphicon-remove" />
                  </button>
                </div>
              </div>
            </div>

            <ul className="list-group">
              {question.answers.map(answer => (
                <li className="list-group-item admin-test-form-answer" key={answer.id}>
                  <div className="admin-test-form-answer__title">
                    {answer.title}
                  </div>

                  <div className="admin-test-form-answer__switch">
                    <Switch
                      onChange={(el, state) => this.handleSwitch(el, state, answer.id, question.id)}
                      bsSize="mini"
                      onText="да"
                      offText="нет"
                      defaultValue={Boolean(answer.correct)}
                      value={Boolean(answer.correct)}
                    />
                  </div>

                  <div className="btn-toolbar admin-test-form-answer__toolbar" role="toolbar">
                    {question.answers.length > 1 && (
                      <div className="btn-group btn-group-xs" role="group">
                        <button
                          type="button"
                          className="btn btn-default"
                          onClick={() => this.orderAnswer(answer.id, question.id, 'down')}
                        >
                          <i className="glyphicon glyphicon-menu-down" />
                        </button>

                        <button
                          type="button"
                          className="btn btn-default"
                          onClick={() => this.orderAnswer(answer.id, question.id, 'up')}
                        >
                          <i className="glyphicon glyphicon-menu-up" />
                        </button>
                      </div>
                    )}

                    <div className="btn-group btn-group-xs" role="group">
                      <button
                        type="button"
                        className="btn btn-default"
                        onClick={() => this.removeAnswer(answer.id, question.id)}
                      >
                        <i className="glyphicon glyphicon-remove" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="panel-body">
              <form className="admin-test-form" onSubmit={e => this.addAnswer(e, question.id)}>
                <input
                  type="text"
                  name={`question-${question.id}-answer`}
                  value={data[`question-${question.id}-answer`] || ''}
                  className="form-control"
                  placeholder="Текст ответа"
                  onChange={e => this.handlerChange(e)}
                />
                <button type="submit" className="btn btn-default">Добавить ответ</button>
              </form>
            </div>
          </div>
        ))}

        <form className="admin-test-form" onSubmit={e => this.addQuestion(e)}>
          <input
            type="text"
            name="question"
            value={data.question || ''}
            className="form-control"
            placeholder="Текст вопроса"
            onChange={e => this.handlerChange(e)}
          />
          <button type="submit" className="btn btn-default">Добавить вопрос</button>
        </form>
      </Fragment>
    )
  }
}

export default TestFormFixation