import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const mutation = gql`
  mutation ChangePassword(
    $password: String!,
    $password_confirmation: String!
  ) {
    changePassword(
      password: $password,
      password_confirmation: $password_confirmation
    ) {
      id
    }
  }
`

class ChangePasswordForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      sending: false,
      variables: {
        password: '',
        password_confirmation: ''
      }
    }

    this.handlerSubmit = this.handlerSubmit.bind(this)
    this.handlerInput = this.handlerInput.bind(this)
  }

  handlerSubmit(e, changePassword) {
    e.preventDefault()
    const { variables } = this.state

    this.setState({
      sending: true
    }, () => {
      changePassword({variables})
      .then(() => {
        this.setState({
          sending: false
        })
        UIkit.notification('Пароль изменен!', {
          status: 'success'
        })
      })
      .catch(({ graphQLErrors }) => {
        this.setState({
          sending: false
        })
        graphQLErrors.forEach(error => {
          if (error.message === 'validation') {
            Object.keys(error.validation).forEach(key => {
              UIkit.notification(error.validation[key][0], {
                status: 'danger'
              })
            })
          } else {
            UIkit.notification(error.message, {
              status: 'danger'
            })
          }
        })
      })
    })
  }

  handlerInput(e) {
    this.setState({
      variables: {
        ...this.state.variables,
        [e.target.name]: e.target.value
      }
    })
  }

  render() {
    const { sending, variables: { password, password_confirmation } } = this.state

    return (
      <Mutation mutation={mutation}>
        {changePassword => (
          <form
            className="uk-form uk-position-relative"
            onSubmit={e => this.handlerSubmit(e, changePassword)}
          >
            {sending && (
              <div className="profile-info__loading">
                <span
                  className="uk-position-center uk-spinner"
                  uk-icon="icon: spinner; ratio: 2"
                />
              </div>
            )}

            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="form-password">Новый пароль</label>
              <div className="uk-form-controls">
                <input
                  className="uk-input"
                  id="form-password"
                  type="password"
                  name="password"
                  value={password}
                  onChange={this.handlerInput}
                />
              </div>
            </div>

            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="form-password_confirmation">Повторите пароль</label>
              <div className="uk-form-controls">
                <input
                  className="uk-input"
                  id="form-password_confirmation"
                  type="password"
                  name="password_confirmation"
                  value={password_confirmation}
                  onChange={this.handlerInput}
                />
              </div>
            </div>

            <div className="uk-margin">
              <button type="submit" className="uk-button uk-button-default">Изменить</button>
            </div>
          </form>
        )}
      </Mutation>
    )
  }
}

export default ChangePasswordForm