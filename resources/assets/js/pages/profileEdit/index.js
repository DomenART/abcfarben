import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'
import HeaderContainer from '../../containers/HeaderContainer'
import SvgIcon from '../../components/UI/SvgIcon'
import Head from '../../components/Head'
import ChangePasswordForm from '../../components/Office/ChangePasswordForm'
import Http from '../../Http'
import * as authActions from '../../store/actions/auth'

class Page extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data: null,
            sendingData: false,
            sendingAvatar: false,
            loaded: false,
            error: null
        }

        this.handlerChange = this.handlerChange.bind(this)
        this.booleanChange = this.booleanChange.bind(this)
        this.handlerSubmit = this.handlerSubmit.bind(this)
        this.changeAvatar = this.changeAvatar.bind(this)
    }

    componentDidMount() {
        const { authUser } = this.props

        Http.get(`/api/users/${authUser.id}`)
        .then(response => {
            this.setState({
                data: response.data.data,
                loaded: true
            })
        })
        .catch(({ response }) => {
            this.setState({
                loaded: true,
                error: response.data.message
            })
        })
    }

    handlerChange(event) {
        this.setState({
            data: {
                ...this.state.data,
                [event.target.name]: event.target.value
            }
        })
    }

    booleanChange(event) {
        this.setState({
            data: {
                ...this.state.data,
                [event.target.name]: !this.state.data[event.target.name]
            }
        })
    }

    handlerSubmit(event) {
        event.preventDefault()

        const { authUser, authActions } = this.props
        const formData = new FormData(event.target)
        formData.append('_method', 'PUT')

        this.setState({
            sendingData: true
        }, () => {
            Http.post(`/api/users/${authUser.id}`, formData)
            .then(response => {
                authActions.updateUser(response.data.data)
                this.setState({
                    sendingData: false
                })
            })
            .catch(({ response }) => {
                this.setState({
                    sendingData: false
                })
                UIkit.notification(response.data.message, {
                    status: 'danger'
                })
            })
        })
    }

    changeAvatar(event) {
        event.preventDefault()

        const { authUser } = this.props
        const files = event.target.files || event.dataTransfer.files
        const formData = new FormData()
        formData.append('avatar', files[0])
        formData.append('_method', 'PUT')

        this.setState({
            sendingAvatar: true
        }, () => {
            Http.post(`/api/users/${authUser.id}/avatar`, formData)
            .then(response => {
                this.setState({
                    data: {
                        ...this.state.data,
                        avatar: response.data
                    },
                    sendingAvatar: false
                })
            })
            .catch(({ response }) => {
                this.setState({
                    sendingAvatar: false
                })
                UIkit.notification(response.data.message, {
                    status: 'danger'
                })
            })
        })
    }

    getContent() {
        const { loaded, error, data, sendingAvatar, sendingData } = this.state
        const { authActions } = this.props

        if (!loaded) {
            return <div className="preloader preloader_absolute" />
        }

        if (error) {
            return <div className="uk-alert-danger" dangerouslySetInnerHTML={{__html:error}} />
        }

        return (
            <main className="editing page">
                <Head title="Редактирование профиля" />

                <div className="profile-info">
                    <div className="profile-info__inner">
                        <div className="profile-info__leftside">
                            <div className="profile-info__avatar" data-uk-form-custom>
                                <input type="file" onChange={this.changeAvatar} />
                                <img src={data.avatar} />
                                {sendingAvatar && (
                                    <div className="profile-info__loading">
                                        <span className="uk-position-center uk-spinner" uk-icon="spinner" />
                                    </div>
                                )}
                            </div>
                            <div
                                className="profile-info__name"
                                dangerouslySetInnerHTML={{__html:data.name}}
                            />
                        </div>
                        <div className="profile-info__rightside">
                            <button
                                className="profile-info__password"
                                data-uk-toggle="target: #change-password"
                                type="button"
                            >
                                <SvgIcon className="profile-info__password-icon" name="lock" />
                                Изменить пароль
                            </button>
                            <div id="change-password" className="uk-flex-top" data-uk-modal>
                                <div className="uk-modal-dialog uk-margin-auto-vertical uk-modal-body">
                                    <button className="uk-modal-close-default" type="button" data-uk-close />
                                    <ChangePasswordForm />
                                </div>
                            </div>
                            <button
                                className="profile-info__logout"
                                type="button"
                                onClick={authActions.authLogout}
                            >
                                <SvgIcon className="profile-info__logout-icon" name="logout" />
                                Выход
                            </button>
                        </div>
                    </div>
                </div>
                <form className="uk-form uk-position-relative" onSubmit={this.handlerSubmit}>
                    {sendingData && (
                        <div className="profile-info__loading">
                            <span
                                className="uk-position-center uk-spinner"
                                data-uk-icon="icon: spinner; ratio: 2"
                            />
                        </div>
                    )}
                    <div className="editing__contacts">
                        <div className="profile-container">
                            <div className="editing__location-row">
                                <div className="editing__location-row-leftside">
                                    <img className="editing__contacts-icon" src="/img/map-pin.svg" />
                                    <select
                                        className="editing__country uk-select"
                                        defaultValue={data.country}
                                        name="country"
                                        onChange={this.handlerChange}
                                    >
                                        {['', 'Россия', 'Украина', 'Белорусия', 'Казахстан'].map(row => (
                                            <option
                                                key={row}
                                                value={row}
                                                dangerouslySetInnerHTML={{__html:row}}
                                            />
                                        ))}
                                    </select>
                                </div>
                                <div className="editing__location-row-rightside">
                                    <input
                                        className="editing__location-input uk-input"
                                        value={data.city || ''}
                                        type="text"
                                        name="city"
                                        onChange={this.handlerChange}
                                    />
                                </div>
                            </div>
                            <div className="editing__name-row">
                                <div className="editing__name-row-leftside">
                                    <img className="profile__contacts-icon" src="/img/bust.svg" />
                                    <input
                                        className="editing__contacts-input editing__contacts-input_name uk-input"
                                        value={data.firstname || ''}
                                        type="text"
                                        name="firstname"
                                        onChange={this.handlerChange}
                                    />
                                </div>
                                <div className="editing__name-row-rightside">
                                    <input
                                        className="editing__contacts-input uk-input"
                                        value={data.secondname || ''}
                                        type="text"
                                        name="secondname"
                                        onChange={this.handlerChange}
                                    />
                                </div>
                            </div>
                            <br/><br/>
                            <div className="editing__contacts-row">
                                <img className="editing__contacts-icon" src="/img/mail.svg" />
                                <input
                                    className="editing__contacts-input uk-input"
                                    type="email"
                                    value={data.email || ''}
                                    name="email"
                                    onChange={this.handlerChange}
                                />
                                <div className="editing__show">
                                    <input
                                        className="editing__show-checkbox"
                                        id="show-email"
                                        type="checkbox"
                                        checked={data.email_public}
                                        name="email_public"
                                        onChange={this.booleanChange}
                                    />
                                    <label className="editing__show-label" htmlFor="show-email">
                                        <span className="editing__show-checkbox-custom" />
                                        Виден всем
                                    </label>
                                </div>
                            </div>
                            <div className="editing__contacts-row">
                                <img className="editing__contacts-icon" src="/img/phone.svg" />
                                <input
                                    className="editing__contacts-input editing__contacts-input_communications uk-input"
                                    type="tel"
                                    value={data.phone || ''}
                                    name="phone"
                                    onChange={this.handlerChange}
                                />
                                <div className="editing__show">
                                    <input
                                        className="editing__show-checkbox"
                                        id="show-tel"
                                        type="checkbox"
                                        checked={data.phone_public}
                                        name="phone_public"
                                        onChange={this.booleanChange}
                                    />
                                    <label className="editing__show-label" htmlFor="show-tel">
                                        <span className="editing__show-checkbox-custom" />
                                        Виден всем
                                    </label>
                                </div>
                            </div>
                            <div className="editing__contacts-row">
                                <img className="editing__contacts-icon" src="/img/skype.svg" />
                                <input
                                    className="editing__contacts-input editing__contacts-input_communications uk-input"
                                    type="text"
                                    value={data.skype || ''}
                                    name="skype"
                                    onChange={this.handlerChange}
                                />
                                <div className="editing__show">
                                    <input
                                        className="editing__show-checkbox"
                                        id="show-skype"
                                        type="checkbox"
                                        checked={data.skype_public}
                                        name="skype_public"
                                        onChange={this.booleanChange}
                                    />
                                    <label className="editing__show-label" htmlFor="show-skype">
                                        <span className="editing__show-checkbox-custom" />
                                        Виден всем
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="editing__company">
                        <div className="profile-container">
                            {/* <div className="editing__company-row">
                                <img className="editing__company-icon" src="/img/house.svg" />
                                <div className="editing__company-info">
                                    <div className="editing__company-field">
                                        Компания
                                    </div>
                                    <input className="editing__company-input uk-input" type="text" value="ABC Farben" />
                                </div>
                            </div> */}
                            <div className="editing__company-row">
                                <img className="editing__company-icon" src="/img/position.svg" />
                                <div className="editing__company-info">
                                    <div className="editing__company-field">
                                        Подразделение
                                    </div>
                                    <input
                                        className="editing__company-input uk-input"
                                        type="text"
                                        value={data.subdivision || ''}
                                        name="subdivision"
                                        onChange={this.handlerChange}
                                    />
                                </div>
                            </div>
                            <div className="editing__company-row">
                                <img className="editing__company-icon" src="/img/field.svg" />
                                <div className="editing__company-info">
                                    <div className="editing__company-field">
                                        Сфера деятельности
                                    </div>
                                    <input
                                        className="editing__company-input uk-input"
                                        type="text"
                                        value={data.sphere || ''}
                                        name="sphere"
                                        onChange={this.handlerChange}
                                    />
                                </div>
                            </div>
                            <div className="editing__company-row">
                                <img className="editing__company-icon" src="/img/about.svg" />
                                <div className="editing__company-info">
                                    <div className="editing__company-field">
                                        О себе
                                    </div>
                                    <textarea
                                        className="editing__textarea uk-textarea"
                                        value={data.about || ''}
                                        name="about"
                                        onChange={this.handlerChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className="editing__submit" type="submit">Сохранить изменения</button>
                </form>
            </main>
        )
    }

    render() {
        return (
            <main className="page">
                <HeaderContainer />
                {this.getContent()}
            </main>
        )
    }
}

const mapStateToProps = store => ({
    authUser: store.Auth.user
})

const mapDispatchToProps = dispatch => ({
    authActions: bindActionCreators(authActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Page)