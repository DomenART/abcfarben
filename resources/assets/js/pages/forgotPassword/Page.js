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
            email: 'required|email',
        })
        this.validator.localize('ru', ru)

        this.state = {
            credentials: {
                email: '',
            },
            isLoading: false,
            isSuccess: false,
            errors: this.validator.errors,
            focused: {
                email: false,
            }
        }
        this.handlerChange = this.handlerChange.bind(this)
        this.handlerSubmit = this.handlerSubmit.bind(this)
        this.handlerFocus = this.handlerFocus.bind(this)
        this.handlerBlur = this.handlerBlur.bind(this)
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
        this.props.dispatch(AuthService.resetPassword(credentials))
            .then(response => {
                UIkit.notification({
                    message: response.message,
                    status: response.success ? 'success' : 'danger'
                })
                this.setState({
                    isLoading: false,
                    isSuccess: response.success
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

    render() {
        const { errors, isSuccess } = this.state

        if (isSuccess) {
            return (
                <Redirect to="/login" />
            )
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

                        <button className="autorization-form__submit" type="submit">Запросить сброс</button>
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


Page.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired
}

export default Page