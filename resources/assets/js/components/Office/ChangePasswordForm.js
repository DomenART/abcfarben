import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'
import Header from '../../components/Header'
import SvgIcon from '../../components/UI/SvgIcon'
import ChangePasswordForm from '../../components/Office/ChangePasswordForm'
import Http from '../../Http'
import * as authActions from '../../store/actions/auth'

class Page extends Component {
    constructor(props) {
        super(props)

        this.state = {
            sending: false
        }

        this.handlerSubmit = this.handlerSubmit.bind(this)
    }

    handlerSubmit(event) {
        event.preventDefault()

        const { authUser } = this.props
        const formData = new FormData(event.target)
        formData.append('_method', 'PUT')

        this.setState({
            sending: true
        }, () => {
            Http.post(`/api/users/${authUser.id}/password`, formData)
            .then(response => {
                this.setState({
                    sending: false
                })
                UIkit.notification('Пароль изменен!', {
                    status: 'success'
                })
            })
            .catch(({ response }) => {
                this.setState({
                    sending: false
                })
                UIkit.notification(response.data.message, {
                    status: 'danger'
                })
            })
        })
    }

    render() {
        const { sending } = this.state

        return (
            <form className="uk-form uk-position-relative" onSubmit={this.handlerSubmit}>
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
                        />
                    </div>
                </div>

                <div className="uk-margin">
                    <button type="submit" className="uk-button uk-button-default">Изменить</button>
                </div>
            </form>
        )
    }
}

const mapStateToProps = store => ({
    authUser: store.Auth.user
})

export default connect(mapStateToProps)(Page)