import React, { Component } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'
import HeaderContainer from '../../containers/HeaderContainer'
import SvgIcon from '../../components/UI/SvgIcon'
import Head from '../../components/Head'
import ChangePasswordForm from '../../components/Office/ChangePasswordForm'
import { catchErrorsNotification } from '../../utils/graphql'

const queryCurrentUser = gql`
query CurrentUser {
  currentUser {
    id
    name
    firstname
    secondname
    avatar
    city
    country
    subdivision
    sphere
    about
    email
    email_public
    phone
    phone_public
    skype
    skype_public
  }
}
`

class Page extends Component {
  constructor(props) {
    super(props)

    this.state = {
      data: {},
      sendingData: false,
      sendingAvatar: false,
    }

    this.handlerInput = this.handlerInput.bind(this)
    this.changeAvatar = this.changeAvatar.bind(this)
    this.booleanChange = this.booleanChange.bind(this)
    this.handlerSubmit = this.handlerSubmit.bind(this)
  }

  handlerInput(event) {
    this.setState({
      data: {
        ...this.state.data,
        [event.target.name]: event.target.value
      }
    })
  }

  changeAvatar(event) {
    const files = event.target.files || event.dataTransfer.files

    this.setState({
      sendingAvatar: true
    }, () => {
      this.props.changeAvatar({
        variables: {
          avatar: files[0]
        }
      })
      .then(() => {
        this.setState({
          sendingAvatar: false
        })
      })
      .catch(response => {
        this.setState({
          sendingAvatar: false
        })
        catchErrorsNotification(response)
      })
    })
  }

  booleanChange(event) {
    const { data: { currentUser } } = this.props
    const { data } = this.state

    if (data[event.target.name] === undefined) {
      data[event.target.name] = currentUser[event.target.name]
    }

    this.setState({
      data: {
        ...data,
        [event.target.name]: !data[event.target.name]
      }
    })
  }

  handlerSubmit(event) {
    event.preventDefault()

    const { data: { currentUser } } = this.props
    const fields = {...currentUser, ...this.state.data}

    this.setState({
      sendingData: true
    }, () => {
      this.props.updateProfile({
        variables: fields
      })
      .then(() => {
        this.setState({
          sendingData: false
        })
      })
      .catch(response => {
        this.setState({
          sendingData: false
        })
        catchErrorsNotification(response)
      })
    })
  }

  render() {
    const { sendingData, sendingAvatar, data } = this.state

    return (
      <Query
        query={queryCurrentUser}
        fetchPolicy="network-only"
      >
        {({ client, loading, error, data: { currentUser }}) => {
          if (loading)
            return <div className="preloader" />

          if (error)
            return <div className="uk-alert-danger" data-uk-alert>{error.message}</div>

          const fields = {...currentUser, ...data}

          return (
            <main className="page">
              <HeaderContainer />

              <div className="editing page">
                <Head title="Редактирование профиля" />

                <div className="profile-info">
                  <div className="profile-info__inner">
                    <div className="profile-info__leftside">
                      <div className="profile-info__avatar" data-uk-form-custom>
                        <input type="file" name="avatar" onChange={this.changeAvatar} />
                        <img src={currentUser.avatar} />
                        {sendingAvatar && (
                            <div className="profile-info__loading">
                                <span className="uk-position-center uk-spinner" uk-icon="spinner" />
                            </div>
                        )}
                      </div>
                      <div className="profile-info__name">
                        {fields.name}
                      </div>
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
                        onClick={() => {
                          localStorage.setItem('token', '')
                          client.resetStore()
                        }}
                      >
                        <SvgIcon className="profile-info__logout-icon" name="logout" />
                        Выход
                      </button>
                    </div>
                  </div>
                </div>

                <form onSubmit={this.handlerSubmit}>
                  <div className="uk-form uk-position-relative">
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
                              defaultValue={fields.country}
                              name="country"
                              onChange={this.handlerInput}
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
                              value={fields.city || ''}
                              type="text"
                              name="city"
                              onChange={this.handlerInput}
                            />
                          </div>
                        </div>
                        <div className="editing__name-row">
                          <div className="editing__name-row-leftside">
                            <img className="profile__contacts-icon" src="/img/bust.svg" />
                            <input
                              className="editing__contacts-input editing__contacts-input_name uk-input"
                              value={fields.firstname || ''}
                              type="text"
                              name="firstname"
                              onChange={this.handlerInput}
                            />
                          </div>
                          <div className="editing__name-row-rightside">
                            <input
                              className="editing__contacts-input uk-input"
                              value={fields.secondname || ''}
                              type="text"
                              name="secondname"
                              onChange={this.handlerInput}
                            />
                          </div>
                        </div>
                        <br/><br/>
                        <div className="editing__contacts-row">
                          <img className="editing__contacts-icon" src="/img/mail.svg" />
                          <input
                            className="editing__contacts-input uk-input"
                            type="email"
                            value={fields.email || ''}
                            name="email"
                            onChange={this.handlerInput}
                          />
                          <div className="editing__show">
                            <input
                              className="editing__show-checkbox"
                              id="show-email"
                              type="checkbox"
                              checked={fields.email_public}
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
                            value={fields.phone || ''}
                            name="phone"
                            onChange={this.handlerInput}
                          />
                          <div className="editing__show">
                            <input
                              className="editing__show-checkbox"
                              id="show-tel"
                              type="checkbox"
                              checked={fields.phone_public}
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
                            value={fields.skype || ''}
                            name="skype"
                            onChange={this.handlerInput}
                          />
                          <div className="editing__show">
                            <input
                              className="editing__show-checkbox"
                              id="show-skype"
                              type="checkbox"
                              checked={fields.skype_public}
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
                        <div className="editing__company-row">
                          <img className="editing__company-icon" src="/img/position.svg" />
                          <div className="editing__company-info">
                            <div className="editing__company-field">
                              Подразделение
                            </div>
                            <input
                              className="editing__company-input uk-input"
                              type="text"
                              value={fields.subdivision || ''}
                              name="subdivision"
                              onChange={this.handlerInput}
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
                              value={fields.sphere || ''}
                              name="sphere"
                              onChange={this.handlerInput}
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
                              value={fields.about || ''}
                              name="about"
                              onChange={this.handlerInput}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <button className="editing__submit" type="submit">Сохранить изменения</button>
                  </div>
                </form>
              </div>
            </main>
          )
        }}
      </Query>
    )
  }
}

export default Page