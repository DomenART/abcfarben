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
      email: 'required|email',
      password: 'required|min:6'
    })
    this.validator.localize('ru', require('ree-validate/dist/locale/ru'))

    this.state = {
      credentials: {
        email: '',
        password: '',
        remember: false
      },
      responseError: {
        isError: false,
        code: '',
        text: ''
      },
      isLoading: false,
      errors: this.validator.errors,
      password_shown: false,
      focused: {
        email: false,
        password: false
      }
    }
    this.handlerChangeRemember = this.handlerChangeRemember.bind(this)
    this.handlerChange = this.handlerChange.bind(this)
    this.handlerSubmit = this.handlerSubmit.bind(this)
    this.handlerFocus = this.handlerFocus.bind(this)
    this.handlerBlur = this.handlerBlur.bind(this)
    this.togglePasswordShown = this.togglePasswordShown.bind(this)
    this.submit = this.submit.bind(this)
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

  handlerChangeRemember(e) {
    this.setState({
      credentials: {
        ...this.state.credentials,
        [e.target.name]: e.target.checked
      }
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
    Http.post('/api/auth/login', credentials)
      .then(({ data: { token } }) => {
        // const { token } = data
        // Http.defaults.headers.common['Authorization'] = `Bearer ${token}`
        // localStorage.setItem('token', token)
        this.props.assignAuthToken({
          variables: { token }
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
    const { from } = this.props.location.state || { from: { pathname: '/' } }

    if (this.props.data.isAuthenticated) {
      return <Redirect to={from}/>
    }

    const { errors } = this.state

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
                  'autorization-form__input_invalid':  errors.has('email'),
                  'autorization-form__input_focus':  this.state.focused.email
                })}
                name="email"
                id="email"
                type="email"
                title="Пожалуйста, введите свой e-mail"
                placeholder="E-mail"
              />
              <label className="autorization-form__label" htmlFor="email">E-mail</label>
              {errors.has('email') && <AuthErrorTooltip title={errors.first('email')} />}
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

            <button className="autorization-form__submit" type="submit">Войти в систему</button>
          </div>
          <div className="autorization-form__additional">
            <div>
              <input
                className="autorization-form__checkbox"
                name="remember"
                id="remember"
                type="checkbox"
                value="1"
                onChange={this.handlerChangeRemember}
                checked={this.state.remember}
              />
              <label className="autorization-form__remember" htmlFor="remember">
                <span className="autorization-form__checkbox-custom" />
                Запомнить меня
              </label>
            </div>
            <Link to="/forgot-password" className="autorization-form__forgot">Забыли пароль?</Link>
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