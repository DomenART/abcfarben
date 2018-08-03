import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'
import Header from '../../components/Header'
import SvgIcon from '../../components/UI/SvgIcon'
import Http from '../../Http'
import * as authActions from '../../store/actions/auth'

class Page extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data: null,
            owner: false,
            loaded: false,
            error: null
        }
    }

    componentDidUpdate(prevProps) {
        const { user: user_id } = this.props.match.params

        if (user_id && user_id !== prevProps.match.params.user) {
            this.loadUser(user_id)
        }
    }

    componentDidMount() {
        const { user: user_id } = this.props.match.params

        if (user_id) {
            this.loadUser(user_id)
        }
    }

    loadUser(user_id) {
        Http.get(`/api/users/${user_id}`)
        .then(response => {
            this.setState({
                ...response.data,
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

    getContent() {
        const { loaded, error, data, owner } = this.state
        const { authActions } = this.props

        if (!loaded) {
            return <div className="preloader preloader_absolute" />
        }

        if (error) {
            return <div class="uk-alert-danger" dangerouslySetInnerHTML={{__html:error}} />
        }

        const address = []
        if (data.city) address.push(data.city)
        if (data.country) address.push(data.country)

        return (
            <main className="profile page">
                <div className="profile-info">
                    <div className="profile-info__inner">
                        <div className="profile-info__leftside">
                            <div className="profile-info__avatar">
                                <img  src={data.avatar} />
                            </div>
                            <div
                                className="profile-info__name"
                                dangerouslySetInnerHTML={{__html:data.name}}
                            />
                        </div>
                        {owner && (
                            <div className="profile-info__rightside">
                                <Link
                                    className="profile-info__password"
                                    to="/profile/edit"
                                >
                                    <SvgIcon
                                        className="profile-info__password-icon"
                                        name="lock"
                                    />
                                    Редактировать профиль
                                </Link>
                                <button
                                    className="profile-info__logout"
                                    type="button"
                                    onClick={authActions.authLogout}
                                >
                                    <SvgIcon className="profile-info__logout-icon" name="logout" />
                                    Выход
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="profile__contacts">
                    <div className="profile-container">
                        {Boolean(address.length) && (
                            <div className="profile__contacts-row">
                                <img className="profile__contacts-icon" src="/img/map-pin.svg" alt="" />
                                <span className="profile__contacts-info">{address.join(', ')}</span>
                            </div>
                        )}
                        {data.name && (
                            <div className="profile__contacts-row">
                                <img className="profile__contacts-icon" src="/img/bust.svg" alt="" />
                                <span
                                    className="profile__contacts-info"
                                    dangerouslySetInnerHTML={{__html:data.name}}
                                />
                            </div>
                        )}
                        {data.email && (
                            <div className="profile__contacts-row">
                                <img className="profile__contacts-icon" src="/img/mail.svg" alt="" />
                                <span
                                    className="profile__contacts-info"
                                    dangerouslySetInnerHTML={{__html:data.email}}
                                />
                                {(!data.email_public && owner) && (
                                    <span className="profile__visibility-warning">(Виден только Вам)</span>
                                )}
                            </div>
                        )}
                        {data.phone && (
                            <div className="profile__contacts-row">
                                <img className="profile__contacts-icon" src="/img/phone.svg" alt="" />
                                <span
                                    className="profile__contacts-info"
                                    dangerouslySetInnerHTML={{__html:data.phone}}
                                />
                                {(!data.phone_public && owner) && (
                                    <span className="profile__visibility-warning">(Виден только Вам)</span>
                                )}
                            </div>
                        )}
                        {data.skype && (
                            <div className="profile__contacts-row">
                                <img className="profile__contacts-icon" src="/img/skype.svg" alt="" />
                                <span
                                    className="profile__contacts-info"
                                    dangerouslySetInnerHTML={{__html:data.skype}}
                                />
                                {(!data.skype_public && owner) && (
                                    <span className="profile__visibility-warning">(Виден только Вам)</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className="profile__company">
                    <div className="profile-container">
                        {/* <div className="profile__company-row">
                            <img className="profile__company-icon" src="/img/house.svg" alt="" />
                            <div className="profile__company-info">
                                <div className="profile__company-field">
                                    Компания
                                </div>
                                <div className="profile__company-text">
                                    ABC Farben
                                </div>
                            </div>
                        </div> */}
                        {data.subdivision && (
                            <div className="profile__company-row">
                                <img className="profile__company-icon" src="/img/position.svg" alt="" />
                                <div className="profile__company-info">
                                    <div className="profile__company-field">
                                        Подразделение
                                    </div>
                                    <div
                                        className="profile__company-text"
                                        dangerouslySetInnerHTML={{__html:data.subdivision}}
                                    />
                                </div>
                            </div>
                        )}
                        {data.sphere && (
                            <div className="profile__company-row">
                                <img className="profile__company-icon" src="/img/field.svg" alt="" />
                                <div className="profile__company-info">
                                    <div className="profile__company-field">
                                        Сфера деятельности
                                    </div>
                                    <div
                                        className="profile__company-text"
                                        dangerouslySetInnerHTML={{__html:data.sphere}}
                                    />
                                </div>
                            </div>
                        )}
                        {data.about && (
                            <div className="profile__company-row">
                                <img className="profile__company-icon" src="/img/about.svg" alt="" />
                                <div className="profile__company-info">
                                    <div className="profile__company-field">
                                        О себе
                                    </div>
                                    <div
                                        className="profile__company-text"
                                        dangerouslySetInnerHTML={{__html:data.about}}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        )
    }

    render() {
        const { authUser } = this.props

        return (
            <main className="page">
                <Header user={authUser} />
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