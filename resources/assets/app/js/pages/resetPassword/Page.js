import React, { Component } from 'react'
import Validator from 'ree-validate'
import classNames from 'classnames'
import { Link, Redirect } from 'react-router-dom'
import AuthErrorTooltip from '../../components/AuthErrorTooltip'
import Http from '../../Http'

class Page extends Component {
  constructor(props) {
    super(props)

    this.validator = new Validator({
      password: 'required|min:6',
      password_confirmation: 'required|min:6',
      token: 'required',
      email: 'required'
    })
    this.validator.localize('ru', require('ree-validate/dist/locale/ru'))

    this.state = {
      credentials: {
        password: '',
        password_confirmation: '',
        token: this.props.match.params.token,
        email: this.props.match.params.email.replace("29gnmLTv686QsnV","@")
      },
      isLoading: false,
      isSuccess: false,
      errors: this.validator.errors,
      password_shown: false,
      focused: {
        email: false,
        password: false
      }
    }
    this.handlerChange = this.handlerChange.bind(this)
    this.handlerSubmit = this.handlerSubmit.bind(this)
    this.handlerFocus = this.handlerFocus.bind(this)
    this.handlerBlur = this.handlerBlur.bind(this)
    this.togglePasswordShown = this.togglePasswordShown.bind(this)
  }

  componentDidMount() {
    this.setState({
      isLoading: false
    })
  }

  handlerChange(event) {
    const name = event.target.name
    const value = event.target.value
    const { credentials } = this.state
    credentials[name] = value
    this.validator.validate(name, value)
      .then(() => {
        const { errors } = this.validator
        this.setState({ errors: errors, credentials })
      })
  }

  handlerSubmit(event) {
    event.preventDefault()
    const { credentials } = this.state
    this.validator.validateAll(credentials)
      .then(success => {
        if (success) {
          this.setState({
            isLoading: true
          })
          this.submit(credentials)
        } else {
          this.setState({
            errors: this.validator.errors
          })
        }
      })
  }

  submit(credentials) {
    Http.post('/api/password/reset', credentials)
      .then(({ data }) => {
        const { message, success } = data
        UIkit.notification({
          message: message,
          status: success ? 'success' : 'danger'
        })
        this.setState({
          isLoading: false,
          isSuccess: success
        })
      })
      .catch(({ response }) => {
        const errors = response.data.errors || {}
        Object.keys(errors).map(key => {
          this.validator.errors.add(key, errors[key])
        })
        this.setState({
          errors: this.validator.errors,
          isLoading: false
        })
      })
  }

  handlerFocus(e) {
    this.setState({
      focused: {
        ...this.state.focused,
        [e.target.name]: true
      }
    })
  }

  handlerBlur(e) {
    this.setState({
      focused: {
        ...this.state.focused,
        [e.target.name]: Boolean(e.target.value.length)
      }
    })
  }

  togglePasswordShown() {
    this.setState({
      password_shown: !this.state.password_shown
    })
  }

  render() {
    if (!!this.props.data.currentUser) {
      return <Redirect to='/' replace />
    }

    const { errors, isSuccess } = this.state

    if (isSuccess) {
      return <Redirect to="/login" />
    }

    return (
      <main className="autorization page">
        <form className="autorization-form" onSubmit={this.handlerSubmit}>
          <div className="autorization-form__main">
            <img className="autorization-form__logo" src={require('../../../img/logo.png')} alt="" />

            <div className="autorization-form__title">
              Электронная Академия <span>ABC Farben</span>
            </div>

            <div className="autorization-form__input-container">
              <input
                onFocus={this.handlerFocus}
                onBlur={this.handlerBlur}
                onChange={this.handlerChange}
                className={classNames('autorization-form__input', 'uk-input', {
                  'autorization-form__input_invalid':  errors.has('password'),
                  'autorization-form__input_focus':  this.state.focused.password
                })}
                name="password"
                id="password"
                type={this.state.password_shown ? 'text' : 'password'}
                placeholder="Пароль"
                title="Пожалуйста, введите свой пароль"
              />
              <label className="autorization-form__label" htmlFor="password">Пароль</label>
              <label
                className={classNames('autorization-form__password-toggler', {
                  'autorization-form__password-toggler_shown':  this.state.password_shown
                })}
                htmlFor="password"
                onClick={this.togglePasswordShown}
              >
                <svg className="autorization-form__eye-closed">
                  <use href="img/sprite.svg#eye-closed" />
                </svg>
                <svg className="autorization-form__eye-opened">
                  <use href="img/sprite.svg#eye-opened" />
                </svg>
              </label>
              {errors.has('password') && (
                <AuthErrorTooltip
                  style={{background:'none'}}
                  title={errors.first('password')}
                />
              )}
            </div>

            <div className="autorization-form__input-container">
              <input
                onFocus={this.handlerFocus}
                onBlur={this.handlerBlur}
                onChange={this.handlerChange}
                className={classNames('autorization-form__input', 'uk-input', {
                  'autorization-form__input_invalid':  errors.has('password_confirmation'),
                  'autorization-form__input_focus':  this.state.focused.password_confirmation
                })}
                name="password_confirmation"
                id="password_confirmation"
                type={this.state.password_shown ? 'text' : 'password'}
                placeholder="Повторите пароль"
                title="Пожалуйста, введите свой пароль"
              />
              <label className="autorization-form__label" htmlFor="password_confirmation">Повторите пароль</label>
              <label
                className={classNames('autorization-form__password-toggler', {
                  'autorization-form__password-toggler_shown':  this.state.password_shown
                })}
                htmlFor="password_confirmation"
                onClick={this.togglePasswordShown}
              >
                <svg className="autorization-form__eye-closed">
                  <use href="img/sprite.svg#eye-closed" />
                </svg>
                <svg className="autorization-form__eye-opened">
                  <use href="img/sprite.svg#eye-opened" />
                </svg>
              </label>
              {errors.has('password_confirmation') && (
                <AuthErrorTooltip
                  style={{background:'none'}}
                  title={errors.first('password_confirmation')}
                />
              )}
            </div>

            <button className="autorization-form__submit" type="submit">Изменить пароль</button>
          </div>
          <div className="autorization-form__additional">
            <Link to="/login" className="autorization-form__forgot">Вход</Link>
            <Link to="/register" className="autorization-form__forgot">Регистрация</Link>
          </div>
        </form>

        <div className="autorization__preloader js-autorization-preloader" hidden>
          <img className="autorization__preloader-logo" src={require('../../../img/logo.png')} alt="" />
        </div>
      </main>
    )
  }
}

export default Page