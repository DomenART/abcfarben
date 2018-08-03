import React, { Component } from 'react'
import Validator from 'ree-validate'
import ru from 'ree-validate/dist/locale/ru'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import AuthService from '../../services'
import { Link, Redirect } from 'react-router-dom'
import AuthErrorTooltip from '../../components/AuthErrorTooltip'

class Page extends Component {
    constructor(props) {
        super(props)

        this.validator = new Validator({
            firstname: 'required|min:3',
            email: 'required|email',
            password: 'required|min:6',
            password_confirmation: 'required|min:6'
            // password_confirmation: 'required|min:6|confirmed:password'
        })
        this.validator.localize('ru', ru)

        this.state = {
            credentials: {
                firstname: '',
                secondname: '',
                email: '',
                password: '',
                password_confirmation: ''
            },
            isSuccess: false,
            isLoading: false,
            errors: this.validator.errors,
            password_shown: false,
            focused: {
                firstname: false,
                secondname: false,
                email: false,
                password: false,
                password_confirmation: false
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
                this.setState({
                    errors: this.validator.errors,
                    credentials
                })
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
        this.props.dispatch(AuthService.register(credentials))
            .then(response => {
                this.setState({
                    isLoading: false,
                    isSuccess: true,
                })
            })
            .catch(response => {
                if (response.errors) {
                    Object.keys(response.errors).map(key => {
                        this.validator.errors.add(key, response.errors[key])
                    })
                }
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
        if (this.props.isAuthenticated) {
            return <Redirect to='/' replace />
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
                                    'autorization-form__input_invalid':  errors.has('firstname'),
                                    'autorization-form__input_focus':  this.state.focused.firstname
                                })}
                                name="firstname"
                                id="firstname"
                                type="text"
                                title="Пожалуйста, введите свое имя"
                                placeholder="Имя"
                            />
                            <label className="autorization-form__label" htmlFor="firstname">Имя</label>
                            {errors.has('firstname') && <AuthErrorTooltip title={errors.first('firstname')} />}
                        </div>

                        <div className="autorization-form__input-container">
                            <input
                                onFocus={this.handlerFocus}
                                onBlur={this.handlerBlur}
                                onChange={this.handlerChange}
                                className={classNames('autorization-form__input', 'uk-input', {
                                    'autorization-form__input_invalid':  errors.has('secondname'),
                                    'autorization-form__input_focus':  this.state.focused.secondname
                                })}
                                name="secondname"
                                id="secondname"
                                type="text"
                                title="Пожалуйста, введите свою фамилию"
                                placeholder="Фамилия"
                            />
                            <label className="autorization-form__label" htmlFor="secondname">Фамилия</label>
                            {errors.has('secondname') && <AuthErrorTooltip title={errors.first('secondname')} />}
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

                        <button className="autorization-form__submit" type="submit">Зарегистрироваться</button>
                    </div>
                    <div className="autorization-form__additional">
                        <Link to="/forgot-password" className="autorization-form__forgot">Забыли пароль?</Link>
                        <Link to="/login" className="autorization-form__forgot">Вход</Link>
                    </div>
                </form>
                <div className="autorization__preloader js-autorization-preloader" hidden>
                    <img className="autorization__preloader-logo" src={require('../../../img/logo.png')} alt="" />
                </div>
            </main>
        )
    }
}


Page.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired
}

export default Page